const express = require('express');
const { validatePayload, schemas } = require('../../middlewares/validator');

const createUsersRouter = (handler) => {
  const router = express.Router();

  router.post('/', validatePayload(schemas.userRegister), handler.postUserHandler);
  router.get('/:id', handler.getUserByIdHandler);

  return router;
};

module.exports = createUsersRouter;