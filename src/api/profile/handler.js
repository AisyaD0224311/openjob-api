class ProfileHandler {
  constructor(usersService, applicationsService, bookmarksService) {
    this._usersService = usersService;
    this._applicationsService = applicationsService;
    this._bookmarksService = bookmarksService;

    this.getProfileHandler = this.getProfileHandler.bind(this);
    this.getProfileApplicationsHandler = this.getProfileApplicationsHandler.bind(this);
    this.getProfileBookmarksHandler = this.getProfileBookmarksHandler.bind(this);
  }

  async getProfileHandler(req, res, next) {
    try {
      const user_id = req.user.id;
      const user = await this._usersService.getUserById(user_id);
      res.json({
        status: 'success',
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  async getProfileApplicationsHandler(req, res, next) {
    try {
      const user_id = req.user.id;
      const applications = await this._applicationsService.getApplicationsByUserId(user_id);
      res.json({
        status: 'success',
        data: { applications }
      });
    } catch (error) {
      next(error);
    }
  }

  async getProfileBookmarksHandler(req, res, next) {
    try {
      const user_id = req.user.id;
      const bookmarks = await this._bookmarksService.getBookmarksByUserId(user_id);
      res.json({
        status: 'success',
        data: { bookmarks }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ProfileHandler;