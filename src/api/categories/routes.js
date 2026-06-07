const express = require('express');
const { validatePayload, schemas } = require('../../middlewares/validator');
const authHandler = require('../../middlewares/authHandler');

const createCategoriesRouter = (handler) => {
  const router = express.Router();

  router.post('/', authHandler, validatePayload(schemas.createCategory), handler.postCategoryHandler);
  router.get('/', handler.getCategoriesHandler);
  router.get('/:id', handler.getCategoryByIdHandler);
  router.put('/:id', authHandler, validatePayload(schemas.createCategory), handler.putCategoryByIdHandler);
  router.delete('/:id', authHandler, handler.deleteCategoryByIdHandler);

  return router;
};

module.exports = createCategoriesRouter;