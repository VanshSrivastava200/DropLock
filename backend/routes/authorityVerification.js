const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const Document = require('../models/Document');
const Authority = require('../models/Authority');
const { authorityProtect } = require('../middleware/authorityAuth');
const { calculateFileHash, verifyHashMatch } = require('../utils/hashUtils');

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

// Verify document by comparing hashes
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
    });

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

      await document.save();

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
    res.status(500).json({
      success: false,
      error: 'Verification failed: ' + error.message
    });
  }
});

module.exports = router;