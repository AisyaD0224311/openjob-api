const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const authHandler = require('../../middlewares/authHandler');

const uploadDir = path.join(__dirname, '../../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

const createDocumentsRouter = (handler) => {
  const router = express.Router();

  router.post('/', authHandler, upload.single('document'), handler.postDocumentHandler);
  router.get('/', authHandler, handler.getDocumentsHandler);
  router.get('/:id', authHandler, handler.getDocumentByIdHandler);

  return router;
};

module.exports = createDocumentsRouter;