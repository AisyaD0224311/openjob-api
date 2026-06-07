class UsersHandler {
  constructor(service) {
    this._service = service;

    this.postUserHandler = this.postUserHandler.bind(this);
    this.getUserByIdHandler = this.getUserByIdHandler.bind(this);
  }

  async postUserHandler(req, res, next) {
    try {
      const { name, email, password, role } = req.body;
      const userId = await this._service.addUser({ name, email, password, role });
      res.status(201).json({
        status: 'success',
        data: { id: userId }
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserByIdHandler(req, res, next) {
    try {
      const { id } = req.params;
      const user = await this._service.getUserById(id);
      res.json({
        status: 'success',
        data: user
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UsersHandler;