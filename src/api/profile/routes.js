const express = require('express');
const authHandler = require('../../middlewares/authHandler');

const createProfileRouter = (handler) => {
  const router = express.Router();

  router.get('/', authHandler, handler.getProfileHandler);
  router.get('/applications', authHandler, handler.getProfileApplicationsHandler);
  router.get('/bookmarks', authHandler, handler.getProfileBookmarksHandler);

  return router;
};

module.exports = createProfileRouter;