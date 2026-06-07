const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('./exceptions');

const TokenManager = {
  generateAccessToken: (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_KEY, { expiresIn: '3h' });
  },
  generateRefreshToken: (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_KEY);
  },
  verifyAccessToken: (token) => {
    try {
      return jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
    } catch (error) {
      throw new AuthenticationError('Access token tidak valid atau telah kedaluwarsa.');
    }
  },
  verifyRefreshToken: (token) => {
    try {
      return jwt.verify(token, process.env.REFRESH_TOKEN_KEY);
    } catch (error) {
      throw new AuthenticationError('Refresh token tidak valid.');
    }
  }
};

module.exports = TokenManager;
