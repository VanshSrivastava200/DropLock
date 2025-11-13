const mongoose = require('mongoose');

const VerifiableCredentialSchema = new mongoose.Schema({
  // VC Core Fields
  '@context': {
    type: [String],
    default: ['https://www.w3.org/2018/credentials/v1']
  },
  type: {
    type: [String],
    default: ['VerifiableCredential', 'DocumentVerificationCredential']
  },
  id: {
    type: String,
    unique: true
  },
  issuer: {
    type: String,
    required: true
  },
  issuanceDate: {
    type: Date,
    default: Date.now
  },
  credentialSubject: {
    id: String, // User's DID
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document',
      required: true
    },
    documentHash: String,
    documentType: String,
    fileName: String,
    verifiedBy: String,
    verificationDate: Date,
    status: {
      type: String,
      enum: ['verified', 'rejected'],
      default: 'verified'
    }
  },
  
  // Proof Section
  proof: {
    type: {
      type: String,
      default: 'EcdsaSecp256k1Signature2019'
    },
    created: {
      type: Date,
      default: Date.now
    },
    verificationMethod: String,
    proofPurpose: {
      type: String,
      default: 'assertionMethod'
    },
    signature: String,
    signatureData: String
  },
  
  // Metadata
  document: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  authority: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Authority',
    required: true
  },
  
  // Status
  status: {
    type: String,
    enum: ['active', 'revoked', 'expired'],
    default: 'active'
  },
  revokedAt: Date,
  expiryDate: Date
}, {
  timestamps: true
});

// Generate unique VC ID before saving
VerifiableCredentialSchema.pre('save', function(next) {
  if (!this.id) {
    this.id = `vc:digilocker:${this._id}`;
  }
  next();
});

module.exports = mongoose.model('VerifiableCredential', VerifiableCredentialSchema);