import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  personalInfo: {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, enum: ['male', 'female', 'other'], required: true },
    nationality: { type: String, default: 'Indian' },
    bloodGroup: { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] }
  },
  
  addressInfo: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String, default: 'India' },
    permanentAddress: {
      isSameAsCurrent: { type: Boolean, default: true },
      street: String,
      city: String,
      state: String,
      pincode: String,
      country: { type: String, default: 'India' }
    }
  },

  departmentInfo: {
    department: { type: String, required: true },
    division: String,
    designation: { type: String, required: true },
    employeeId: { type: String, required: true, unique: true },
    joiningDate: { type: Date, required: true },
    reportingOfficer: String,
    workLocation: String,
    officeAddress: {
      street: String,
      city: String,
      state: String,
      pincode: String
    },
    previousExperience: [String]
  },

  identityProof: {
    type: { type: String, required: true, enum: ['aadhar', 'pan', 'passport', 'voter_id', 'driving_license'] },
    number: { type: String, required: true },
    issuingAuthority: String,
    issueDate: Date,
    expiryDate: Date
  },

  emergencyContact: {
    name: String,
    relationship: String,
    phone: String,
    email: String,
    address: String
  },

  accountDetails: {
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, minlength: 8 },
    role: { type: String, enum: ['officer', 'supervisor', 'admin'], default: 'officer' },
    requestedRole: { type: String, enum: ['officer', 'supervisor', 'admin'], default: 'officer' }
  },

  uploadedDocuments: {
    profilePhoto: {
      url: String,
      publicId: String,
      uploadedAt: Date
    },
    idProof: {
      url: String,
      publicId: String,
      uploadedAt: Date
    },
    addressProof: {
      url: String,
      publicId: String,
      uploadedAt: Date
    },
    departmentLetter: {
      url: String,
      publicId: String,
      uploadedAt: Date
    },
    joiningLetter: {
      url: String,
      publicId: String,
      uploadedAt: Date
    }
  },

  verificationStatus: {
    aiVerification: {
      status: { type: String, enum: ['pending', 'processing', 'verified', 'failed'], default: 'pending' },
      confidence: { type: Number, default: 0 },
      issues: [String],
      extractedData: mongoose.Schema.Types.Mixed,
      verifiedAt: Date
    },
    digiLockerVerification: {
      status: { type: String, enum: ['pending', 'processing', 'verified', 'failed'], default: 'pending' },
      documents: [{
        id: String,
        name: String,
        type: String,
        issuer: String,
        issuedBy: String,
        issuedDate: String,
        verifiedAt: String,
        uri: String,
        url: String
      }],
      verifiedAt: Date,
      error: String
    },
    faceVerification: {
      status: { type: String, enum: ['pending', 'processing', 'verified', 'failed'], default: 'pending' },
      confidence: { type: Number, default: 0 },
      verifiedAt: Date
    }
  },

  consent: {
    digiLockerConsent: { type: Boolean, default: false },
    dataProcessingConsent: { type: Boolean, default: false },
    termsAndConditions: { type: Boolean, default: false },
    backgroundVerificationConsent: { type: Boolean, default: false },
    consentGivenAt: Date
  },

  registrationStatus: {
    status: { type: String, enum: ['pending', 'under_review', 'approved', 'rejected'], default: 'pending' },
    requestId: String,
    submittedAt: { type: Date, default: Date.now },
    reviewedAt: Date,
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    approvedAt: Date,
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rejectionReason: String,
    estimatedProcessingTime: String
  },

  status: { type: String, enum: ['active', 'inactive', 'suspended'], default: 'inactive' },
  lastLogin: Date,
  loginAttempts: { type: Number, default: 0 },
  lockUntil: Date,
  
  permissions: [{
    type: String,
    enum: [
      'full_access', 'user_management', 'system_config',
      'incident_management', 'zone_config', 'reports',
      'incident_response', 'tourist_management'
    ]
  }],

  preferences: {
    language: { type: String, default: 'english' },
    timezone: { type: String, default: 'IST' },
    notifications: {
      sosAlerts: { type: Boolean, default: true },
      zoneViolations: { type: Boolean, default: true },
      emergencyProtocols: { type: Boolean, default: true },
      systemUpdates: { type: Boolean, default: false },
      weeklyReports: { type: Boolean, default: true }
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.personalInfo.firstName} ${this.personalInfo.lastName}`;
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('accountDetails.password')) return next();
  
  const salt = await bcrypt.genSalt(12);
  this.accountDetails.password = await bcrypt.hash(this.accountDetails.password, salt);
  next();
});

// Method to check password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.accountDetails.password);
};

// Method to check if account is locked
userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

export const User = mongoose.model('User', userSchema);