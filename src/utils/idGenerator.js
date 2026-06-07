const crypto = require('crypto');

const generateId = (prefix) => {
  const uuid = crypto.randomUUID().replace(/-/g, '').slice(0, 16);
  return `${prefix}-${uuid}`;
};

module.exports = { generateId };