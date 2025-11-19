import mongoose from 'mongoose';

const systemSettingsSchema = new mongoose.Schema({
  general: {
    systemName: { type: String, default: 'SentinelView' },
    version: { type: String, default: '1.0.0' },
    timezone: { type: String, default: 'Asia/Kolkata' },
    language: { type: String, default: 'en' },
    dateFormat: { type: String, default: 'DD/MM/YYYY' },
    currency: { type: String, default: 'INR' }
  },
  security: {
    passwordMinLength: { type: Number, default: 8 },
    passwordComplexity: { type: Boolean, default: true },
    sessionTimeout: { type: Number, default: 3600 },
    maxLoginAttempts: { type: Number, default: 5 },
    lockoutDuration: { type: Number, default: 7200 },
    twoFactorRequired: { type: Boolean, default: false }
  },
  notifications: {
    emailEnabled: { type: Boolean, default: true },
    smsEnabled: { type: Boolean, default: true },
    pushEnabled: { type: Boolean, default: true },
    emailProvider: { type: String, default: 'smtp' },
    smsProvider: { type: String, default: 'twilio' }
  },
  api: {
    rateLimit: { type: Number, default: 100 },
    rateLimitWindow: { type: Number, default: 900000 },
    apiVersion: { type: String, default: 'v1' },
    corsEnabled: { type: Boolean, default: true }
  }
}, { timestamps: true });

const SystemSettings = mongoose.model('SystemSettings', systemSettingsSchema);
export default SystemSettings;