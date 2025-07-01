const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  // Si no hay sesión, se devuelve un error 401 (No autorizado)
  res.status(401).json({ message: 'No autorizado. Por favor, inicie sesión.' });
};

const isAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.rol === 'admin') {
    return next();
  }
  // Si no es admin, se devuelve un error 403 (Prohibido)
  res.status(403).json({ message: 'Acceso denegado. Se requiere rol de administrador.' });
};

const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!req.session.user || !roles.includes(req.session.user.rol)) {
      return res.status(403).json({ message: 'Acceso denegado. Su rol no tiene permisos para esta acción.' });
    }
    next();
  };
};

module.exports = {
  isAuthenticated,
  isAdmin,
  authorizeRole,
};