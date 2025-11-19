import mongoose from 'mongoose';

const integrationSettingsSchema = new mongoose.Schema({
  digiLocker: {
    enabled: { type: Boolean, default: true },
    baseUrl: { type: String, default: process.env.DIGILOCKER_API_URL || '' }
  },
  erss: {
    enabled: { type: Boolean, default: true },
    endpoint: { type: String, default: process.env.ERSS_ENDPOINT || '' }
  },
  weather: {
    enabled: { type: Boolean, default: true },
    provider: { type: String, default: 'openweather' }
  }
}, { timestamps: true });

const IntegrationSettings = mongoose.model('IntegrationSettings', integrationSettingsSchema);
export default IntegrationSettings;