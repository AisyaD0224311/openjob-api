const express = require('express');
const { validatePayload, schemas } = require('../../middlewares/validator');
const authHandler = require('../../middlewares/authHandler');

const createApplicationsRouter = (handler) => {
  const router = express.Router();

  router.post('/', authHandler, validatePayload(schemas.applyJob), handler.postApplicationHandler);
  router.get('/', authHandler, handler.getApplicationsHandler);
  router.get('/:id', authHandler, handler.getApplicationByIdHandler);
  router.get('/user/:userId', authHandler, handler.getApplicationsByUserIdHandler);
  router.get('/job/:jobId', authHandler, handler.getApplicationsByJobIdHandler);
  router.put('/:id', authHandler, handler.putApplicationStatusHandler);
  router.delete('/:id', authHandler, handler.deleteApplicationHandler);

  return router;
};

module.exports = createApplicationsRouter;