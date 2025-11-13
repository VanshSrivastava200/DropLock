const express = require('express');
const router = express.Router();
const VerifiableCredential = require('../models/VerifiableCredential');
const Document = require('../models/Document');
const { protect } = require('../middleware/auth');
const { authorityProtect } = require('../middleware/authorityAuth');
const VCService = require('../utils/vcService');

// Get user's VCs
router.get('/my-vcs', protect, async (req, res) => {
  try {
    const vcs = await VerifiableCredential.find({ 
      user: req.user.id,
      status: 'active'
    })
    .populate('document', 'fileName documentType fileSize')
    .populate('authority', 'fullName department designation')
    .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: vcs.length,
      verifiableCredentials: vcs.map(vc => ({
        id: vc.id,
        issuanceDate: vc.issuanceDate,
        document: {
          fileName: vc.document.fileName,
          documentType: vc.document.documentType,
          fileSize: vc.document.fileSize
        },
        authority: {
          fullName: vc.authority.fullName,
          department: vc.authority.department,
          designation: vc.authority.designation
        },
        status: vc.status,
        expiryDate: vc.expiryDate
      }))
    });
  } catch (error) {
    console.error('❌ Get VCs error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch verifiable credentials'
    });
  }
});

// Get specific VC by ID
router.get('/:vcId', async (req, res) => {
  try {
    const vc = await VerifiableCredential.findOne({ 
      id: req.params.vcId 
    })
    .populate('document')
    .populate('authority')
    .populate('user', 'username email did');

    if (!vc) {
      return res.status(404).json({
        success: false,
        error: 'Verifiable Credential not found'
      });
    }

    // Verify signature
    const isSignatureValid = VCService.verifyVCSignature(vc);
    
    res.status(200).json({
      success: true,
      verifiableCredential: vc,
      verification: {
        signatureValid: isSignatureValid,
        issuer: vc.issuer,
        issuanceDate: vc.issuanceDate,
        status: vc.status
      }
    });
  } catch (error) {
    console.error('❌ Get VC error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch verifiable credential'
    });
  }
});

// Verify VC endpoint (public)
router.post('/verify/:vcId', async (req, res) => {
  try {
    const vc = await VerifiableCredential.findOne({ 
      id: req.params.vcId,
      status: 'active'
    })
    .populate('document')
    .populate('authority');

    if (!vc) {
      return res.status(404).json({
        success: false,
        error: 'Verifiable Credential not found or revoked'
      });
    }

    // Check expiry
    const isExpired = vc.expiryDate && new Date() > vc.expiryDate;
    if (isExpired) {
      return res.status(400).json({
        success: false,
        error: 'Verifiable Credential has expired'
      });
    }

    // Verify signature
    const isSignatureValid = VCService.verifyVCSignature(vc);

    res.status(200).json({
      success: true,
      valid: isSignatureValid && !isExpired,
      credential: {
        id: vc.id,
        document: {
          fileName: vc.document.fileName,
          documentType: vc.document.documentType,
          hash: vc.document.documentHash
        },
        authority: {
          fullName: vc.authority.fullName,
          department: vc.authority.department
        },
        issuedTo: vc.credentialSubject.id,
        issuanceDate: vc.issuanceDate,
        expiryDate: vc.expiryDate
      },
      verification: {
        signatureValid: isSignatureValid,
        notExpired: !isExpired,
        active: vc.status === 'active'
      }
    });
  } catch (error) {
    console.error('❌ Verify VC error:', error);
    res.status(500).json({
      success: false,
      error: 'Verification failed'
    });
  }
});

// Revoke VC (authority only)
router.post('/:vcId/revoke', authorityProtect, async (req, res) => {
  try {
    const vc = await VerifiableCredential.findOne({ 
      id: req.params.vcId,
      authority: req.user.id
    });

    if (!vc) {
      return res.status(404).json({
        success: false,
        error: 'Verifiable Credential not found or not authorized'
      });
    }

    vc.status = 'revoked';
    vc.revokedAt = new Date();
    await vc.save();

    res.status(200).json({
      success: true,
      message: 'Verifiable Credential revoked successfully'
    });
  } catch (error) {
    console.error('❌ Revoke VC error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to revoke verifiable credential'
    });
  }
});

module.exports = router;