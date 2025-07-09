const verifyToken = (req, res, next) => {
  // Comprobar si existe una sesión de usuario activa
  if (req.session && req.session.user) {
    req.user = req.session.user;
    next();
  } else {
    return res.status(401).json({ message: 'Acceso denegado. No autenticado.' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.rol.toLowerCase() === 'administrador') {
    return next();
  }
  return res.status(403).json({ message: 'Acceso denegado. Se requiere rol de administrador.' });
};

const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.rol) {
      return res.status(403).json({ message: 'Acceso denegado. Rol no especificado.' });
    }
    if (roles.includes(req.user.rol)) {
      next();
    } else {
      res.status(403).json({ message: 'Acceso denegado. No tiene el rol requerido.' });
    }
  };
};

// Alias para mantener compatibilidad con otras rutas
const isAuthenticated = verifyToken;

module.exports = { verifyToken, isAdmin, isAuthenticated, authorizeRole };