const ClientError = require('../exceptions/ClientError');

const ALLOWED_MIME_TYPES = ['application/pdf'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const fileUploadValidator = {
  validateFile(file) {
    if (!file) {
      throw new ClientError('File tidak ditemukan. Silakan unggah file PDF.', 400);
    }

    // Validasi MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new ClientError(
        'Tipe file tidak valid. Hanya file PDF yang diperbolehkan.',
        400
      );
    }

    // Validasi ukuran file
    if (file.size > MAX_FILE_SIZE) {
      throw new ClientError(
        `Ukuran file terlalu besar. Maksimal ukuran file adalah 5 MB, file Anda berukuran ${(file.size / (1024 * 1024)).toFixed(2)} MB.`,
        400
      );
    }

    return true;
  },
};

module.exports = fileUploadValidator;
