const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) {
    return res.status(401).send({ message: 'Se requiere un token de autenticación válido' });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(401).send({ message: 'Token de autenticación inválido', error: err.message });
    }

    if (new Date(user.exp * 1000) < new Date()) {
      console.log('TOKEN EXPIRADO');
      return res.status(401).send({ message: 'El token de autenticación ha expirado', error: err.message });
    }

    console.log('TOKEN VIGENTE');
    req.user = user;
    next();
  });
};

module.exports = verifyToken;