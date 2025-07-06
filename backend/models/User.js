const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false // Don't include password in queries by default
  },
  role: {
    type: String,
    enum: ['user', 'mess-owner', 'admin'],
    default: 'user'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  otp: {
    type: String,
    select: false
  },
  otpExpiry: {
    type: Date,
    select: false
  },
  phone: {
    type: String,
    trim: true,
    match: [/^\+?[\d\s-]+$/, 'Please enter a valid phone number']
  },
  profilePicture: {
    type: String,
    default: null
  },
  lastLogin: {
    type: Date,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isVerified: 1 });

// Virtual for user's full profile (excluding sensitive data)
userSchema.virtual('profile').get(function() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
    isVerified: this.isVerified,
    phone: this.phone,
    profilePicture: this.profilePicture,
    lastLogin: this.lastLogin,
    createdAt: this.createdAt
  };
});

// Method to check if password matches
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to generate OTP
userSchema.methods.generateOTP = function() {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiry = new Date(Date.now() + process.env.OTP_EXPIRY_MINUTES * 60 * 1000);
  
  this.otp = otp;
  this.otpExpiry = otpExpiry;
  
  return otp;
};

// Method to verify OTP
userSchema.methods.verifyOTP = function(enteredOTP) {
  if (!this.otp || !this.otpExpiry) {
    return false;
  }
  
  if (this.otpExpiry < new Date()) {
    return false;
  }
  
  return this.otp === enteredOTP;
};

// Method to clear OTP
userSchema.methods.clearOTP = function() {
  this.otp = undefined;
  this.otpExpiry = undefined;
};

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Static method to find user by email with password
userSchema.statics.findByEmailWithPassword = function(email) {
  return this.findOne({ email }).select('+password +otp +otpExpiry');
};

// Static method to find user by email for OTP operations
userSchema.statics.findByEmailForOTP = function(email) {
  return this.findOne({ email }).select('+otp +otpExpiry');
};

module.exports = mongoose.model('User', userSchema); 