import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUserDocument extends Document {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: Date;
    gender: string;
    nationality: string;
    bloodGroup?: string;
  };
  addressInfo: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    permanentAddress: {
      isSameAsCurrent: boolean;
      street?: string;
      city?: string;
      state?: string;
      pincode?: string;
      country?: string;
    };
  };
  departmentInfo: {
    department: string;
    division?: string;
    designation: string;
    employeeId: string;
    joiningDate: Date;
    reportingOfficer: string;
    workLocation?: string;
  };
  accountDetails: {
    username: string;
    password: string;
    role: 'admin' | 'supervisor' | 'officer';
    status: 'pending' | 'approved' | 'rejected';
  };
  uploadedFiles?: {
    profilePhoto?: string;
    idProof?: string;
    addressProof?: string;
    departmentLetter?: string;
    joiningLetter?: string;
  };
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUserDocument>({
  personalInfo: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, required: true },
    nationality: { type: String, default: 'Indian' },
    bloodGroup: String
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
      country: String
    }
  },
  departmentInfo: {
    department: { type: String, required: true },
    division: String,
    designation: { type: String, required: true },
    employeeId: { type: String, required: true, unique: true },
    joiningDate: { type: Date, required: true },
    reportingOfficer: { type: String, required: true },
    workLocation: String
  },
  accountDetails: {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'supervisor', 'officer'], default: 'officer' },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
  },
  uploadedFiles: {
    profilePhoto: String,
    idProof: String,
    addressProof: String,
    departmentLetter: String,
    joiningLetter: String
  }
}, {
  timestamps: true
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('accountDetails.password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.accountDetails.password = await bcrypt.hash(this.accountDetails.password, salt);
  next();
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.accountDetails.password);
};

export const User = mongoose.model<IUserDocument>('User', UserSchema);


