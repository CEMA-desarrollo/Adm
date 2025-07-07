// Middleware para verificar si el usuario está autenticado
const isAuthenticated = (req, res, next) => {
  // Asumimos que al hacer login, guardas los datos del usuario en req.session.user
  if (req.session?.user) {
    // Si hay un usuario en la sesión, la petición puede continuar.
    return next();
  } else {
    // Si no hay sesión, se devuelve un error 401 (No Autorizado).
    // El interceptor de Axios en el frontend se encargará de esto.
    return res.status(401).json({ message: 'No autenticado. Por favor, inicie sesión.' });
  }
};

// Middleware para verificar roles de usuario
const authorizeRole = (allowedRoles) => {
  return (req, res, next) => {
    // Este middleware debe ejecutarse DESPUÉS de isAuthenticated,
    // por lo que podemos asumir que req.session.user existe.
    const { rol } = req.session.user;

    // Hacemos la comparación insensible a mayúsculas para evitar errores
    // entre 'admin' (DB) y 'Administrador' (código).
    const userRole = rol.toLowerCase(); // ej: 'admin'
    const isAllowed = allowedRoles.some(role => role.toLowerCase() === userRole);

    if (isAllowed) {
      return next(); // El usuario tiene el rol permitido, continuar.
    } else {
      // El usuario está autenticado pero no tiene permiso para este recurso.
      return res.status(403).json({ message: 'Acceso prohibido. No tiene los permisos necesarios.' });
    }
  };
};

module.exports = { isAuthenticated, authorizeRole };