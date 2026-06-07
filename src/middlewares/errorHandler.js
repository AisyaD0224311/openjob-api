const { ClientError } = require('../utils/exceptions');

const errorHandler = (error, req, res, next) => {
  if (error instanceof ClientError) {
    return res.status(error.statusCode).json({
      status: 'failed',
      message: error.message,
    });
  }

  // Handle unique constraint errors from PostgreSQL (e.g., duplicate email)
  if (error.code === '23505') {
    return res.status(400).json({
      status: 'failed',
      message: 'Data email sudah terdaftar, gunakan email lain.',
    });
  }

  // Handle foreign key constraint violations
  if (error.code === '23503') {
    return res.status(400).json({
      status: 'failed',
      message: 'Resource referensi tidak valid.',
    });
  }

  console.error('SERVER_ERROR:', error);
  return res.status(500).json({
    status: 'failed',
    message: 'Maaf, terjadi kegagalan pada server kami.',
  });
};

module.exports = errorHandler;
