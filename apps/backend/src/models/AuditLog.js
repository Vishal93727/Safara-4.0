import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  action: { type: String, required: true },
  description: { type: String, required: true },
  category: {
    type: String,
    enum: [
      'authentication', 'user_management', 'incident_management',
      'zone_management', 'system_config', 'reports', 'data_access'
    ],
    required: true
  },
  
  resource: {
    type: { type: String }, // 'user', 'incident', 'zone', etc.
    id: mongoose.Schema.Types.ObjectId,
    name: String
  },

  metadata: { type: mongoose.Schema.Types.Mixed },
  
  ipAddress: String,
  userAgent: String,
  timestamp: { type: Date, default: Date.now },
  
  severity: {
    type: String,
    enum: ['info', 'warning', 'error', 'critical'],
    default: 'info'
  },
  
  status: {
    type: String,
    enum: ['success', 'failure', 'pending'],
    default: 'success'
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
// auditLogSchema.index({ user: 1, timestamp: -1 });
// auditLogSchema.index({ action: 1, timestamp: -1 });
// auditLogSchema.index({ category: 1, timestamp: -1 });
// auditLogSchema.index({ timestamp: -1 });

export const AuditLog = mongoose.model('AuditLog', auditLogSchema);

