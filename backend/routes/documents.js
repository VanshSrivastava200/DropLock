const express = require('express');
const multer = require('multer');
const crypto = require('crypto');
const router = express.Router();
const Document = require('../models/Document');
const pinataService = require('../utils/pinataService');
const { protect } = require('../middleware/auth');
const { calculateFileHash } = require('../utils/hashUtils');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Upload document
router.post('/upload', protect, upload.single('document'), async (req, res) => {
  try {
    const { documentType, description } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    if (!documentType) {
      return res.status(400).json({
        success: false,
        error: 'Document type is required'
      });
    }

    console.log(`📤 Uploading document: ${file.originalname}`);

    const fileHash = calculateFileHash(file.buffer);

    const pinataResult = await pinataService.uploadToIPFS(file.buffer, file.originalname);
    const ipfsURL = pinataService.getGatewayURL(pinataResult.ipfsHash);

    const document = await Document.create({
      user: req.user.id,
      did: req.user.did,
      documentType,
      fileName: file.originalname,
      fileSize: file.size,
      fileType: file.mimetype,
      description,
      ipfsHash: pinataResult.ipfsHash,
      ipfsURL,
      documentHash: fileHash,
      metadata: {
        uploadedBy: req.user.username,
        uploadMethod: 'web_upload'
      }
    });

    console.log(`✅ Document saved to database: ${document._id}`);

    res.status(201).json({
      success: true,
      message: 'Document uploaded successfully',
      document: {
        id: document._id,
        documentType: document.documentType,
        fileName: document.fileName,
        fileSize: document.fileSize,
        ipfsHash: document.ipfsHash,
        ipfsURL: document.ipfsURL,
        uploadedAt: document.createdAt,
        isVerified: document.isVerified
      }
    });
  } catch (error) {
    console.error('❌ Document upload error:', error);
    res.status(500).json({
      success: false,
      error: 'Document upload failed: ' + error.message
    });
  }
});

// Get all documents for the current user
router.get('/my-documents', protect, async (req, res) => {
  try {
    console.log(`📋 Fetching documents for user: ${req.user.id}`);
    
    const documents = await Document.find({ 
      user: req.user.id 
    }).sort({ createdAt: -1 });

    console.log(`✅ Found ${documents.length} documents for user`);

    res.status(200).json({
      success: true,
      count: documents.length,
      documents: documents.map(doc => ({
        id: doc._id,
        status : doc.status,
        documentType: doc.documentType,
        fileName: doc.fileName,
        fileSize: doc.fileSize,
        fileType: doc.fileType,
        description: doc.description,
        ipfsHash: doc.ipfsHash,
        ipfsURL: doc.ipfsURL,
        documentHash: doc.documentHash,
        isVerified: doc.isVerified,
        verifiedBy: doc.verifiedBy,
        uploadedAt: doc.createdAt,
        updatedAt: doc.updatedAt
      }))
    });
  } catch (error) {
    console.error('❌ Get documents error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch documents: ' + error.message
    });
  }
});

// Get a specific document by ID
router.get('/:id', protect, async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        error: 'Document not found'
      });
    }

    res.status(200).json({
      success: true,
      document: {
        id: document._id,
        documentType: document.documentType,
        fileName: document.fileName,
        fileSize: document.fileSize,
        fileType: document.fileType,
        description: document.description,
        ipfsHash: document.ipfsHash,
        ipfsURL: document.ipfsURL,
        documentHash: document.documentHash,
        isVerified: document.isVerified,
        verifiedBy: document.verifiedBy,
        uploadedAt: document.createdAt,
        updatedAt: document.updatedAt
      }
    });
  } catch (error) {
    console.error('❌ Get document error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch document: ' + error.message
    });
  }
});

// Delete a document
router.delete('/:id', protect, async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        error: 'Document not found'
      });
    }

    await Document.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Document deleted successfully'
    });
  } catch (error) {
    console.error('❌ Delete document error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete document: ' + error.message
    });
  }
});

module.exports = router;