import mongoose from 'mongoose';

const zoneSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  code: { type: String, required: true, unique: true },
  type: {
    type: String,
    enum: ['tourist_area', 'restricted', 'emergency', 'safe_zone', 'transit'],
    required: true
  },
  description: { type: String, required: true },
  
  geometry: {
    type: { type: String, enum: ['Polygon'], required: true },
    coordinates: { type: [[[Number]]], required: true } // Array of arrays of coordinates
  },

  properties: {
    capacity: { type: Number, default: 0 },
    currentOccupancy: { type: Number, default: 0 },
    riskLevel: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'low' },
    accessLevel: { type: String, enum: ['public', 'restricted', 'authorized_only'], default: 'public' },
    operatingHours: {
      start: String,
      end: String,
      allDay: { type: Boolean, default: true }
    },
    emergencyProtocols: [String],
    contactInfo: {
      phone: String,
      email: String,
      emergencyContact: String
    }
  },

  assignedOfficers: [{
    officer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    shift: { type: String, enum: ['morning', 'afternoon', 'night'] },
    assignedAt: { type: Date, default: Date.now }
  }],

  resources: [{
    type: { type: String, enum: ['camera', 'emergency_button', 'medical_kit', 'patrol_vehicle'] },
    identifier: String,
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: [Number]
    },
    status: { type: String, enum: ['active', 'inactive', 'maintenance'], default: 'active' },
    lastChecked: Date
  }],

  incidents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Incident' }],
  
  statistics: {
    totalIncidents: { type: Number, default: 0 },
    avgResponseTime: { type: Number, default: 0 },
    lastIncident: Date,
    safetyScore: { type: Number, default: 100, min: 0, max: 100 }
  },

  alerts: [{
    type: { type: String, enum: ['weather', 'capacity', 'security', 'maintenance'] },
    message: String,
    severity: { type: String, enum: ['info', 'warning', 'critical'] },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    resolvedAt: Date
  }],

  status: { type: String, enum: ['active', 'inactive', 'maintenance'], default: 'active' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Geospatial index
// zoneSchema.index({ geometry: '2dsphere' });
// zoneSchema.index({ code: 1 });
// zoneSchema.index({ type: 1 });
// zoneSchema.index({ status: 1 });

// Virtual for occupancy percentage
zoneSchema.virtual('occupancyPercentage').get(function() {
  return this.properties.capacity > 0 
    ? (this.properties.currentOccupancy / this.properties.capacity) * 100 
    : 0;
});

export const Zone = mongoose.model('Zone', zoneSchema);