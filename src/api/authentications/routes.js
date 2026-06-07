const express = require('express');
const { validatePayload, schemas } = require('../../middlewares/validator');

const authMiddleware = require('../../middleware/authMiddleware');

const createAuthenticationsRouter = (handler) => {
  const router = express.Router();
  router.post('/', validatePayload(schemas.userLogin), handler.postAuthenticationHandler);
  router.put('/', validatePayload(schemas.tokenPayload), handler.putAuthenticationHandler);
  router.delete(
    '/', 
    authMiddleware, 
    validatePayload(schemas.tokenPayload), 
    handler.deleteAuthenticationHandler
  );

  return router;
};

module.exports = createAuthenticationsRouter;