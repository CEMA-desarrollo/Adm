// d:/Code/Adm/backend/user.test.js
const request = require('supertest');
const app = require('./server'); // Asegúrate de que tu archivo server.js exporte la aplicación Express
const dbPool = require('./config/db'); // Importa el pool de la base de datos
const User = require('./models/userModel'); // Importa el modelo de usuario

describe('User Authentication API', () => {
  let testUser;
  const testPassword = 'testpassword123';
  const testUsername = 'testuser_for_login';

  // Antes de todas las pruebas, crea un usuario de prueba en la base de datos
  beforeAll(async () => {
    // Eliminar el usuario de prueba si ya existe de una ejecución anterior
    const existingUser = await User.findByUsername(testUsername);
    if (existingUser) {
      await User.remove(existingUser.id);
    }

    testUser = await User.create({
      nombre_usuario: testUsername,
      hash_contrasena: testPassword, // Guardamos la contraseña en texto plano
      rol: 'recepcionista'
    });
    console.log(`Usuario de prueba '${testUsername}' creado para tests.`);
  });

  // Después de todas las pruebas, elimina el usuario de prueba
  afterAll(async () => {
    if (testUser && testUser.id) {
      await User.remove(testUser.id);
    }
    console.log(`Usuario de prueba '${testUsername}' eliminado después de tests.`);
    // Cierra la conexión a la base de datos para que Jest pueda terminar
    if (dbPool) {
      await dbPool.end();
      console.log('Conexión a la base de datos cerrada después de tests.');
    }
  });

  // Prueba para un inicio de sesión exitoso
  test('should log in a user with correct credentials', async () => {
    const response = await request(app)
      .post('/api/users/login')
      .send({
        nombre_usuario: testUsername,
        password: testPassword,
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message', 'Login exitoso');
    expect(response.body).toHaveProperty('user');
    expect(response.body.user).toHaveProperty('nombre_usuario', testUsername);
    expect(response.body.user).toHaveProperty('rol', 'recepcionista');
    expect(response.body.user).not.toHaveProperty('hash_contrasena');
  });

  // Prueba para credenciales incorrectas (contraseña)
  test('should return 401 for incorrect password', async () => {
    const response = await request(app)
      .post('/api/users/login')
      .send({
        nombre_usuario: testUsername,
        password: 'wrongpassword',
      });

    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty('message', 'Credenciales inválidas.');
  });

  // Prueba para usuario no encontrado
  test('should return 401 for non-existent user', async () => {
    const response = await request(app)
      .post('/api/users/login')
      .send({
        nombre_usuario: 'nonexistentuser',
        password: 'anypassword',
      });

    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty('message', 'Credenciales inválidas o usuario inactivo.');
  });

  // Prueba para datos de entrada incompletos
  test('should return 400 for missing username or password', async () => {
    const response1 = await request(app)
      .post('/api/users/login')
      .send({
        password: testPassword,
      });
    expect(response1.statusCode).toBe(400);
    expect(response1.body).toHaveProperty('message', 'Nombre de usuario y contraseña son requeridos');

    const response2 = await request(app)
      .post('/api/users/login')
      .send({
        nombre_usuario: testUsername,
      });
    expect(response2.statusCode).toBe(400);
    expect(response2.body).toHaveProperty('message', 'Nombre de usuario y contraseña son requeridos');
  });
});
