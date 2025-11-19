import mongoose from 'mongoose';

const incidentSchema = new mongoose.Schema({
  incidentId: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['emergency', 'medical', 'theft', 'accident', 'harassment', 'natural_disaster', 'security_threat', 'other'],
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['reported', 'acknowledged', 'in_progress', 'resolved', 'closed'],
    default: 'reported'
  },
  location: {
    coordinates: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true }
    },
    address: String,
    landmark: String,
    zone: String
  },
  reporter: {
    name: String,
    phone: String,
    email: String,
    type: { type: String, enum: ['tourist', 'local', 'authority', 'anonymous'], default: 'tourist' }
  },
  description: {
    type: String,
    required: true
  },
  category: String,
  subCategory: String,
  involvedParties: [{
    name: String,
    role: String,
    contact: String,
    details: String
  }],
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  responders: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: String,
    assignedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['assigned', 'en_route', 'on_scene', 'completed'] }
  }],
  timeline: [{
    timestamp: { type: Date, default: Date.now },
    action: String,
    description: String,
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    location: {
      latitude: Number,
      longitude: Number
    }
  }],
  evidence: [{
    type: { type: String, enum: ['photo', 'video', 'audio', 'document'] },
    filename: String,
    originalName: String,
    path: String,
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    uploadedAt: { type: Date, default: Date.now },
    description: String
  }],
  resolution: {
    summary: String,
    actions_taken: [String],
    outcome: String,
    resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    resolvedAt: Date
  },
  feedback: {
    rating: { type: Number, min: 1, max: 5 },
    comments: String,
    submittedAt: Date
  },
  escalation: {
    isEscalated: { type: Boolean, default: false },
    escalatedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    escalatedAt: Date,
    reason: String
  },
  notifications: [{
    type: { type: String, enum: ['sms', 'email', 'push', 'call'] },
    recipient: String,
    message: String,
    sentAt: Date,
    status: { type: String, enum: ['sent', 'delivered', 'failed'] }
  }],
  metadata: {
    source: { type: String, enum: ['mobile_app', 'web_portal', 'phone_call', 'walk_in'], default: 'mobile_app' },
    deviceInfo: String,
    ipAddress: String,
    userAgent: String
  }
}, {
  timestamps: true
});

// Indexes for better performance
// incidentSchema.index({ incidentId: 1 });
// incidentSchema.index({ type: 1 });
// incidentSchema.index({ status: 1 });
// incidentSchema.index({ priority: 1 });
incidentSchema.index({ assignedTo: 1 });
incidentSchema.index({ 'location.coordinates.latitude': 1, 'location.coordinates.longitude': 1 });
incidentSchema.index({ createdAt: -1 });

// Generate incident ID
incidentSchema.pre('save', function(next) {
  if (!this.incidentId) {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const day = String(new Date().getDate()).padStart(2, '0');
    const randomNum = String(Math.floor(Math.random() * 999) + 1).padStart(3, '0');
    this.incidentId = `INC-${year}${month}${day}-${randomNum}`;
  }
  next();
});

const Incident = mongoose.model('Incident', incidentSchema);

export default Incident;