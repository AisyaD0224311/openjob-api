const express = require('express');
const { validatePayload, schemas } = require('../../middlewares/validator');
const authHandler = require('../../middlewares/authHandler');

const createJobsRouter = (handler) => {
  const router = express.Router();

  router.post('/', authHandler, validatePayload(schemas.createJob), handler.postJobHandler);
  router.get('/', handler.getJobsHandler);
  router.get('/:id', handler.getJobByIdHandler);
  router.put('/:id', authHandler, validatePayload(schemas.updateJob), handler.putJobByIdHandler);
  router.delete('/:id', authHandler, handler.deleteJobByIdHandler);

  router.get('/company/:companyId', handler.getJobsByCompanyIdHandler);
  router.get('/category/:categoryId', handler.getJobsByCategoryIdHandler);

  return router;
};

module.exports = createJobsRouter;