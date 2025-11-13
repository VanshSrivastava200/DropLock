const crypto = require('crypto');

exports.calculateFileHash = (fileBuffer) => {
  // Ensure we're hashing the raw binary data
  const buffer = Buffer.isBuffer(fileBuffer) ? fileBuffer : Buffer.from(fileBuffer);
  return crypto.createHash('sha256').update(buffer).digest('hex');
};

exports.verifyHashMatch = (hash1, hash2) => {
  return hash1.toLowerCase() === hash2.toLowerCase();
};