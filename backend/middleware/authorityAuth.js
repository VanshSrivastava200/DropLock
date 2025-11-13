const jwt = require('jsonwebtoken');
const Authority = require('../models/Authority');

const authorityProtect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this route'
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const authority = await Authority.findById(decoded.id);
      
      if (!authority) {
        return res.status(401).json({
          success: false,
          error: 'Authority not found'
        });
      }

      req.user = {
        id: authority._id,
        email: authority.email,
        department: authority.department,
        fullName: authority.fullName,
        designation: authority.designation,
        employerId: authority.employerId
      };
      
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this route'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error in authentication'
    });
  }
};

module.exports = { authorityProtect };