const express = require('express');
const authHandler = require('../../middlewares/authHandler');

const createBookmarksRouter = (handler) => {
  const router = express.Router();

  router.get('/', authHandler, handler.getBookmarksHandler);

  return router;
};

module.exports = createBookmarksRouter;