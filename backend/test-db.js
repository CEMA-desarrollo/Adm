// d:\Code\Adm\backend\test-db.js
require('dotenv').config();
const mysql = require('mysql2/promise');

async function testConnection() {
  console.log('Intentando conectar a la base de datos con la siguiente configuración:');
  console.log({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD ? '[oculta]' : '[vacía]',
    database: process.env.DB_NAME,
    charset: 'utf8mb4'
  });

  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      charset: 'utf8mb4'
    });

    console.log('\n✅ ÉXITO: ¡La conexión a la base de datos fue exitosa!');
    
    const [rows] = await connection.execute('SELECT 1 + 1 AS solution');
    console.log('✅ ÉXITO: La consulta de prueba se ejecutó. Resultado:', rows[0].solution);

  } catch (err) {
    console.error('\n❌ ERROR: No se pudo conectar a la base de datos.');
    console.error('Código de Error:', err.code);
    console.error('Mensaje de Error:', err.message);
    console.error('\nPasos para solucionar el problema:');
    console.error('1. ¿Está tu servidor XAMPP/MySQL/MariaDB corriendo?');
    console.error('2. ¿Son correctas las credenciales en tu archivo .env? (host, usuario, contraseña, nombre de la base de datos)');
    console.error('3. ¿Hay un firewall bloqueando la conexión?');
    
  } finally {
    if (connection) {
      await connection.end();
      console.log('\nConexión cerrada.');
    }
  }
}

testConnection();
