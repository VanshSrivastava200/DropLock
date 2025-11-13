const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  did: {
    type: String,
    required: true
  },
  documentType: {
    type: String,
    required: [true, 'Document type is required'],
    enum: ['aadhar', 'pan', 'birth','voter','certificate','license', 'passport', 'degree', 'other'],
    default: 'other'
  },
  fileName: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  fileType: {
    type: String,
    required: true
  },
  description: {
    type: String,
    maxlength: 500
  },
  ipfsHash: {
    type: String,
    required: true
  },
  ipfsURL: {
    type: String,
    required: true
  },
  documentHash: {
    type: String,
    required: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Authority'
  },
  verifiedAt: {
    type: Date
  },
  verificationHash: {
    type: String // Hash from authority's original document
  },
  status: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  metadata: {
    type: Map,
    of: String
  },
   verifiableCredential: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VerifiableCredential'
  },
}, {
  timestamps: true
});

documentSchema.index({ user: 1, createdAt: -1 });
documentSchema.index({ did: 1 });
documentSchema.index({ ipfsHash: 1 });
documentSchema.index({ documentType: 1 });
documentSchema.index({ status: 1 });
documentSchema.index({ verifiedBy: 1 });

module.exports = mongoose.model('Document', documentSchema);