const express = require('express');
const { validatePayload, schemas } = require('../../middlewares/validator');
const authHandler = require('../../middlewares/authHandler');

const createCompaniesRouter = (handler) => {
  const router = express.Router();

  router.post('/', authHandler, validatePayload(schemas.createCompany), handler.postCompanyHandler);
  router.get('/', handler.getCompaniesHandler);
  router.get('/:id', handler.getCompanyByIdHandler);
  router.put('/:id', authHandler, validatePayload(schemas.createCompany), handler.putCompanyByIdHandler);
  router.delete('/:id', authHandler, handler.deleteCompanyByIdHandler);

  return router;
};

module.exports = createCompaniesRouter;