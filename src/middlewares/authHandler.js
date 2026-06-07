const TokenManager = require('../utils/tokenManager');
const { AuthenticationError } = require('../utils/exceptions');

const authHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AuthenticationError('Akses ditolak. Token autentikasi tidak ditemukan.');
  }
  const token = authHeader.split(' ')[1];
  const decoded = TokenManager.verifyAccessToken(token);
  req.user = { id: decoded.id, email: decoded.email, role: decoded.role };
  next();
};

module.exports = authHandler;
