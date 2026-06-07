const fileUploadValidator = require('../../utils/fileUploadValidator');
const ClientError = require('../../exceptions/ClientError');

class DocumentsHandler {
  constructor(documentsService) {
    this._documentsService = documentsService;
    this.postUploadDocumentHandler = this.postUploadDocumentHandler.bind(this);
    this.getDocumentByIdHandler = this.getDocumentByIdHandler.bind(this);
    this.getDocumentsByUserIdHandler = this.getDocumentsByUserIdHandler.bind(this);
    this.deleteDocumentHandler = this.deleteDocumentHandler.bind(this);
  }

  async postUploadDocumentHandler(request, h) {
    try {
      const { id: userId } = request.auth.credentials;
      const { file } = request.payload;

      if (!file) {
        throw new ClientError('File tidak ditemukan. Silakan unggah file PDF.', 400);
      }

      // Validasi file
      fileUploadValidator.validateFile(file);

      const uploadedDocument = await this._documentsService.uploadDocument(
        userId,
        file,
        file.filename
      );

      const response = h.response({
        status: 'success',
        message: 'File PDF berhasil diunggah',
        data: {
          document: uploadedDocument,
        },
      });

      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      throw error;
    }
  }

  async getDocumentByIdHandler(request, h) {
    try {
      const { id: userId } = request.auth.credentials;
      const { id: documentId } = request.params;

      const document = await this._documentsService.getDocumentById(documentId);

      // Verifikasi ownership
      const isOwner = await this._documentsService.verifyDocumentOwnership(
        documentId,
        userId
      );

      if (!isOwner) {
        const response = h.response({
          status: 'fail',
          message: 'Anda tidak memiliki akses untuk mengambil dokumen ini',
        });
        response.code(403);
        return response;
      }

      const response = h.response({
        status: 'success',
        data: {
          document,
        },
      });
      response.code(200);
      return response;
    } catch (error) {
      if (error.message === 'Dokumen tidak ditemukan') {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(404);
        return response;
      }
      throw error;
    }
  }

  async getDocumentsByUserIdHandler(request, h) {
    try {
      const { id: userId } = request.auth.credentials;

      const documents = await this._documentsService.getDocumentsByUserId(userId);

      const response = h.response({
        status: 'success',
        data: {
          documents,
        },
      });
      response.code(200);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async deleteDocumentHandler(request, h) {
    try {
      const { id: userId } = request.auth.credentials;
      const { id: documentId } = request.params;

      const isOwner = await this._documentsService.verifyDocumentOwnership(
        documentId,
        userId
      );

      if (!isOwner) {
        const response = h.response({
          status: 'fail',
          message: 'Anda tidak memiliki akses untuk menghapus dokumen ini',
        });
        response.code(403);
        return response;
      }

      await this._documentsService.deleteDocument(documentId, userId);

      const response = h.response({
        status: 'success',
        message: 'Dokumen berhasil dihapus',
      });
      response.code(200);
      return response;
    } catch (error) {
      if (error.message.includes('tidak ditemukan')) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(404);
        return response;
      }
      throw error;
    }
  }
}

module.exports = DocumentsHandler;
