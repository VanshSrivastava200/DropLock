const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const Document = require('../models/Document');
const Authority = require('../models/Authority');
const VerifiableCredential = require('../models/VerifiableCredential');
const User = require('../models/User');
const { authorityProtect } = require('../middleware/authorityAuth');
const { calculateFileHash, verifyHashMatch } = require('../utils/hashUtils');
const VCService = require('../utils/vcService');

// Get authority dashboard statistics
router.get('/stats', authorityProtect, async (req, res) => {
  try {
    const authority = await Authority.findById(req.user.id);
    
    if (!authority) {
      return res.status(404).json({
        success: false,
        error: 'Authority not found'
      });
    }

    console.log(`📊 Fetching stats for authority: ${authority.department}`);

    // Get counts based on authority's department
    const totalDocuments = await Document.countDocuments({ 
      documentType: authority.department 
    });
    
    const pendingVerifications = await Document.countDocuments({ 
      documentType: authority.department,
      isVerified: false,
      status: { $ne: 'rejected' }
    });
    
    const verifiedDocuments = await Document.countDocuments({ 
      documentType: authority.department,
      isVerified: true 
    });
    
    const rejectedDocuments = await Document.countDocuments({ 
      documentType: authority.department,
      status: 'rejected' 
    });

    // Get recent activity (last 7 days)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const recentVerifications = await Document.countDocuments({
      documentType: authority.department,
      isVerified: true,
      verifiedAt: { $gte: oneWeekAgo }
    });

    res.status(200).json({
      success: true,
      stats: {
        totalDocuments,
        pendingVerifications,
        verifiedDocuments,
        rejectedDocuments,
        recentVerifications,
        verificationRate: totalDocuments > 0 ? 
          Math.round((verifiedDocuments / totalDocuments) * 100) : 0,
        department: authority.department
      }
    });
  } catch (error) {
    console.error('❌ Get stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics: ' + error.message
    });
  }
});

// Get pending verification requests for authority's department
router.get('/pending-requests', authorityProtect, async (req, res) => {
  try {
    const authority = await Authority.findById(req.user.id);
    
    const pendingDocuments = await Document.find({
      documentType: authority.department,
      isVerified: false,
      status: { $ne: 'rejected' }
    })
    .populate('user', 'username email did')
    .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: pendingDocuments.length,
      documents: pendingDocuments.map(doc => ({
        id: doc._id,
        documentType: doc.documentType,
        fileName: doc.fileName,
        fileSize: doc.fileSize,
        description: doc.description,
        ipfsHash: doc.ipfsHash,
        documentHash: doc.documentHash,
        uploadedAt: doc.createdAt,
        user: {
          username: doc.user.username,
          email: doc.user.email,
          did: doc.user.did
        }
      }))
    });
  } catch (error) {
    console.error('❌ Get pending requests error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch pending requests: ' + error.message
    });
  }
});

// Get verification history for authority
router.get('/verification-history', authorityProtect, async (req, res) => {
  try {
    const authority = await Authority.findById(req.user.id);
    
    const verifiedDocuments = await Document.find({
      documentType: authority.department,
      verifiedBy: authority._id
    })
    .populate('user', 'username email did')
    .sort({ verifiedAt: -1 });

    res.status(200).json({
      success: true,
      count: verifiedDocuments.length,
      documents: verifiedDocuments.map(doc => ({
        id: doc._id,
        documentType: doc.documentType,
        fileName: doc.fileName,
        fileSize: doc.fileSize,
        description: doc.description,
        isVerified: doc.isVerified,
        status: doc.status,
        verifiedAt: doc.verifiedAt,
        user: {
          username: doc.user.username,
          email: doc.user.email,
          did: doc.user.did
        }
      }))
    });
  } catch (error) {
    console.error('❌ Get verification history error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch verification history: ' + error.message
    });
  }
});

// Verify document by comparing hashes and generate VC
router.post('/verify/:documentId', authorityProtect, express.raw({
  type: '*/*',
  limit: '10mb'
}), async (req, res) => {
  try {
    const { documentId } = req.params;
    const authority = await Authority.findById(req.user.id);
    const originalDocumentBuffer = req.body;

    if (!authority) {
      return res.status(404).json({
        success: false,
        error: 'Authority not found'
      });
    }

    if (!originalDocumentBuffer || originalDocumentBuffer.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Original document file is required'
      });
    }

    // Find the document to verify
    const document = await Document.findOne({
      _id: documentId,
      documentType: authority.department
    }).populate('user');

    if (!document) {
      return res.status(404).json({
        success: false,
        error: 'Document not found or not in your department'
      });
    }

    if (document.isVerified) {
      return res.status(400).json({
        success: false,
        error: 'Document is already verified'
      });
    }

    const authorityDocumentHash = calculateFileHash(originalDocumentBuffer);
    const isHashMatch = verifyHashMatch(document.documentHash, authorityDocumentHash);

    if (isHashMatch) {
      // Update document as verified
      document.isVerified = true;
      document.status = 'verified';
      document.verifiedBy = authority._id;
      document.verifiedAt = new Date();
      document.verificationHash = authorityDocumentHash;

      // Generate Verifiable Credential
      const vcData = await VCService.generateDocumentVC(document, authority, document.user);
      
      // Save VC to database
      const verifiableCredential = await VerifiableCredential.create({
        ...vcData,
        document: document._id,
        user: document.user._id,
        authority: authority._id,
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year expiry
      });

      // Link VC to document
      document.verifiableCredential = verifiableCredential._id;
      await document.save();

      console.log(`✅ Document verified and VC created: ${verifiableCredential.id}`);

      res.json({
        success: true,
        message: 'Document verified successfully',
        document: {
          id: document._id,
          documentType: document.documentType,
          fileName: document.fileName,
          isVerified: document.isVerified,
          verifiedAt: document.verifiedAt,
          verifiedBy: authority.fullName
        },
        verifiableCredential: {
          id: verifiableCredential.id,
          issuanceDate: verifiableCredential.issuanceDate,
          qrCodeData: VCService.generateQRCodeData(vcData)
        }
      });
    } else {
      // Hashes don't match
      document.status = 'rejected';
      await document.save();

      res.status(400).json({
        success: false,
        error: 'Document hashes do not match. Verification failed.',
        details: {
          userDocumentHash: document.documentHash.substring(0, 20) + '...',
          authorityDocumentHash: authorityDocumentHash.substring(0, 20) + '...'
        }
      });
    }
  } catch (error) {
    console.error('❌ Verification failed:', error);
    res.status(500).json({
      success: false,
      error: 'Verification failed: ' + error.message
    });
  }
});

// Get authority's issued VCs
router.get('/my-issued-vcs', authorityProtect, async (req, res) => {
  try {
    const vcs = await VerifiableCredential.find({ 
      authority: req.user.id 
    })
    .populate('document', 'fileName documentType fileSize')
    .populate('user', 'username email did')
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
        user: {
          username: vc.user.username,
          email: vc.user.email,
          did: vc.user.did
        },
        status: vc.status,
        expiryDate: vc.expiryDate
      }))
    });
  } catch (error) {
    console.error('❌ Get issued VCs error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch issued verifiable credentials'
    });
  }
});

// Revoke a VC (authority can revoke their own issued VCs)
router.post('/revoke-vc/:vcId', authorityProtect, async (req, res) => {
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

    // Also update the linked document status
    await Document.findByIdAndUpdate(vc.document, {
      status: 'revoked',
      isVerified: false
    });

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