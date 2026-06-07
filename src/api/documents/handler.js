const path = require('path');

class DocumentsHandler {
  constructor(service) {
    this._service = service;

    this.postDocumentHandler = this.postDocumentHandler.bind(this);
    this.getDocumentsHandler = this.getDocumentsHandler.bind(this);
    this.getDocumentByIdHandler = this.getDocumentByIdHandler.bind(this);
  }

  async postDocumentHandler(req, res, next) {
    try {
      if (!req.file) {
        throw new Error('File tidak ditemukan');
      }

      const { name } = req.body;
      const user_id = req.user.id;
      const filename = req.file.filename;
      const filepath = `/uploads/${filename}`;
      const documentName = name || req.file.originalname;

      const documentId = await this._service.addDocument({
        user_id,
        name: documentName,
        filename,
        filepath
      });

      res.status(201).json({
        status: 'success',
        data: {
          id: documentId,
          filepath
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async getDocumentsHandler(req, res, next) {
    try {
      const user_id = req.user.id;
      const documents = await this._service.getDocumentsByUserId(user_id);
      res.json({
        status: 'success',
        data: { documents }
      });
    } catch (error) {
      next(error);
    }
  }

  async getDocumentByIdHandler(req, res, next) {
    try {
      const { id } = req.params;
      const document = await this._service.getDocumentById(id);
      res.json({
        status: 'success',
        data: { document }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = DocumentsHandler;