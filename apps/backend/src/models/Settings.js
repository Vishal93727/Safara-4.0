import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  sosAlerts: { type: Boolean, default: true },
  zoneViolations: { type: Boolean, default: true },
  emergencyProtocols: { type: Boolean, default: true },
  systemUpdates: { type: Boolean, default: false },
  weeklyReports: { type: Boolean, default: true }
}, { _id: false });

const settingsSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  preferences: {
    language: { type: String, default: 'english' },
    timezone: { type: String, default: 'IST' },
    notifications: notificationSchema
  },
  system: {
    systemName: { type: String, default: 'SentinelView' },
    timezone: { type: String, default: 'Asia/Kolkata' },
    language: { type: String, default: 'en' }
  },
  apiIntegrations: {
    digiLocker: {
      enabled: { type: Boolean, default: true },
      baseUrl: { type: String, default: '' }
    },
    erss: {
      enabled: { type: Boolean, default: true },
      endpoint: { type: String, default: '' }
    },
    weather: {
      enabled: { type: Boolean, default: true },
      provider: { type: String, default: 'openweather' }
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

export default mongoose.model('Settings', settingsSchema);