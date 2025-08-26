const mongoose = require('mongoose');
const CryptoJS = require('crypto-js');

const journalSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

// Helper functions for encryption/decryption
const ENCRYPTION_SECRET = process.env.JOURNAL_SECRET || 'default_journal_secret';

function encryptContent(content) {
  return CryptoJS.AES.encrypt(content, ENCRYPTION_SECRET).toString();
}

function decryptContent(encryptedContent) {
  const bytes = CryptoJS.AES.decrypt(encryptedContent, ENCRYPTION_SECRET);
  return bytes.toString(CryptoJS.enc.Utf8);
}


// Encrypt content before saving
journalSchema.pre('save', function(next) {
  if (!this.isModified('content')) return next();
  try {
    this.content = encryptContent(this.content);
    next();
  } catch (err) {
    next(err);
  }
});

// Decrypt content when converting to JSON (for API responses)
journalSchema.methods.toJSON = function() {
  const obj = this.toObject();
  obj.content = decryptContent(obj.content);
  return obj;
};

module.exports = mongoose.model('Journal', journalSchema);
