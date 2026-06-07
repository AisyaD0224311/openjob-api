const upload = require('../../middlewares/multerMiddleware');
const authHandler = require('../../middlewares/authHandler');

const createDocumentsRouter = (handler) => {
  const router = require('express').Router();

  // Upload dokumen PDF (dengan middleware multer dan auth)
  router.post(
    '/',
    authHandler,
    upload.single('file'),
    handler.postUploadDocumentHandler
  );

  // Ambil semua dokumen milik user
  router.get('/', authHandler, handler.getDocumentsByUserIdHandler);

  // Ambil detail dokumen berdasarkan ID
  router.get('/:id', authHandler, handler.getDocumentByIdHandler);

  // Hapus dokumen
  router.delete('/:id', authHandler, handler.deleteDocumentHandler);

  return router;
};

module.exports = createDocumentsRouter;
