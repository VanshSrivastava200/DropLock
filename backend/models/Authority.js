const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const authoritySchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },
  employerId: {
    type: String,
    required: [true, 'Employer ID is required'],
    unique: true
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    enum: ['aadhar', 'pan', 'license', 'passport', 'degree', 'other']
  },
  fullName: {
    type: String,
    required: [true, 'Full name is required']
  },
  designation: {
    type: String,
    required: [true, 'Designation is required']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true
});

authoritySchema.index({ email: 1 });
authoritySchema.index({ employerId: 1 });
authoritySchema.index({ department: 1 });

authoritySchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

authoritySchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Authority', authoritySchema);