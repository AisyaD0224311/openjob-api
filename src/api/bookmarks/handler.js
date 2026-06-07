class BookmarksHandler {
  constructor(service) {
    this._service = service;

    this.postBookmarkHandler = this.postBookmarkHandler.bind(this);
    this.deleteBookmarkHandler = this.deleteBookmarkHandler.bind(this);
    this.getBookmarksHandler = this.getBookmarksHandler.bind(this);
    this.getBookmarkByIdHandler = this.getBookmarkByIdHandler.bind(this);
  }

  async postBookmarkHandler(req, res, next) {
    try {
      const { jobId } = req.params;
      const user_id = req.user.id;
      const bookmarkId = await this._service.addBookmark({ user_id, job_id: jobId });
      res.status(201).json({
        status: 'success',
        data: { id: bookmarkId }
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteBookmarkHandler(req, res, next) {
    try {
      const { jobId } = req.params;
      const user_id = req.user.id;
      await this._service.deleteBookmark({ user_id, job_id: jobId });
      res.json({
        status: 'success',
        message: 'Bookmark berhasil dihapus'
      });
    } catch (error) {
      next(error);
    }
  }

  async getBookmarksHandler(req, res, next) {
    try {
      const user_id = req.user.id;
      const bookmarks = await this._service.getBookmarksByUserId(user_id);
      res.json({
        status: 'success',
        data: { bookmarks }
      });
    } catch (error) {
      next(error);
    }
  }

  async getBookmarkByIdHandler(req, res, next) {
    try {
      const { id } = req.params;
      const bookmark = await this._service.getBookmarkById(id);
      res.json({
        status: 'success',
        data: bookmark
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = BookmarksHandler;