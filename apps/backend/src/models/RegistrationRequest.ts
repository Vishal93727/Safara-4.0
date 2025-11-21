import mongoose, { Schema, Document } from 'mongoose';

export interface IRegistrationRequest extends Document {
  userId: mongoose.Types.ObjectId;
  requestId: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: mongoose.Types.ObjectId;
  notes?: string;
  verificationStatus: {
    documentsVerified: boolean;
    identityVerified: boolean;
    departmentVerified: boolean;
  };
}

const RegistrationRequestSchema = new Schema<IRegistrationRequest>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  requestId: { type: String, required: true, unique: true },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
  submittedAt: { type: Date, default: Date.now },
  reviewedAt: Date,
  reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  notes: String,
  verificationStatus: {
    documentsVerified: { type: Boolean, default: false },
    identityVerified: { type: Boolean, default: false },
    departmentVerified: { type: Boolean, default: false }
  }
}, {
  timestamps: true
});

export const RegistrationRequest = mongoose.model<IRegistrationRequest>('RegistrationRequest', RegistrationRequestSchema);