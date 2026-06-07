const TokenManager = require('../../utils/tokenManager');

class AuthenticationsHandler {
  constructor(authenticationsService, usersService) {
    this._authenticationsService = authenticationsService;
    this._usersService = usersService;

    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
    this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this);
    this.deleteAuthenticationHandler = this.deleteAuthenticationHandler.bind(this);
  }

  async postAuthenticationHandler(req, res, next) {
    try {
      const { email, password } = req.body;
      const { id, role } = await this._usersService.verifyUserCredentials(email, password);

      const accessToken = TokenManager.generateAccessToken({ id, role });
      const refreshToken = TokenManager.generateRefreshToken({ id, role });

      await this._authenticationsService.addRefreshToken(refreshToken);

      res.status(200).json({
        status: 'success',
        data: {
          accessToken,
          refreshToken
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async putAuthenticationHandler(req, res, next) {
    try {
      const { refreshToken } = req.body;
      await this._authenticationsService.verifyRefreshToken(refreshToken);
      const { id, role } = TokenManager.verifyRefreshToken(refreshToken);

      const accessToken = TokenManager.generateAccessToken({ id, role });

      res.json({
        status: 'success',
        data: {
          accessToken
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteAuthenticationHandler(req, res, next) {
    try {
      const { refreshToken } = req.body;
      await this._authenticationsService.verifyRefreshToken(refreshToken);
      await this._authenticationsService.deleteRefreshToken(refreshToken);

      res.json({
        status: 'success',
        message: 'Refresh token berhasil dihapus'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthenticationsHandler;