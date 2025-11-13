const express = require('express');
const router = express.Router();
const Authority = require('../models/Authority');
const { generateToken } = require('../middleware/auth');
const { authorityProtect } = require('../middleware/authorityAuth');

// Authority registration
router.post('/register', async (req, res) => {
  try {
    const { email, password, employerId, department, fullName, designation } = req.body;

    if (!email || !password || !employerId || !department || !fullName || !designation) {
      return res.status(400).json({
        success: false,
        error: 'All fields are required'
      });
    }

    const existingAuthority = await Authority.findOne({ 
      $or: [{ email }, { employerId }] 
    });

    if (existingAuthority) {
      return res.status(400).json({
        success: false,
        error: 'Authority with this email or employer ID already exists'
      });
    }

    const authority = await Authority.create({
      email: email.toLowerCase(),
      password,
      employerId,
      department,
      fullName,
      designation,
      lastLogin: new Date()
    });

    const token = generateToken(authority._id);

    res.status(201).json({
      success: true,
      token,
      message: 'Authority registered successfully',
      authority: {
        id: authority._id,
        email: authority.email,
        employerId: authority.employerId,
        department: authority.department,
        fullName: authority.fullName,
        designation: authority.designation
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Registration failed: ' + error.message
    });
  }
});

// Authority login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    const authority = await Authority.findOne({ email: email.toLowerCase() });
    
    if (!authority) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    const isPasswordValid = await authority.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    authority.lastLogin = new Date();
    await authority.save();

    const token = generateToken(authority._id);

    res.json({
      success: true,
      token,
      message: 'Login successful',
      authority: {
        id: authority._id,
        email: authority.email,
        employerId: authority.employerId,
        department: authority.department,
        fullName: authority.fullName,
        designation: authority.designation
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Login failed: ' + error.message
    });
  }
});

// Get authority profile
router.get('/me', authorityProtect, async (req, res) => {
  try {
    const authority = await Authority.findById(req.user.id);
    
    if (!authority) {
      return res.status(404).json({
        success: false,
        error: 'Authority not found'
      });
    }

    res.json({
      success: true,
      authority: {
        id: authority._id,
        email: authority.email,
        employerId: authority.employerId,
        department: authority.department,
        fullName: authority.fullName,
        designation: authority.designation,
        lastLogin: authority.lastLogin
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get profile'
    });
  }
});

module.exports = router;