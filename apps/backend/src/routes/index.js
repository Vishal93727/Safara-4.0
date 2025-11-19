import { Router } from 'express';
import authRoutes from './auth.js';
import userRoutes from './users.js';
import incidentRoutes from './incidents.js';
import zoneRoutes from './zones.js';
import reportRoutes from './reports.js';
import settingsRoutes from './settings.js';
import uploadRoutes from './upload.js';

export const setupRoutes = (app) => {
  const router = Router();

  // API routes
  router.use('/auth', authRoutes);
  router.use('/users', userRoutes);
  router.use('/incidents', incidentRoutes);
  router.use('/zones', zoneRoutes);
  router.use('/reports', reportRoutes);
  router.use('/settings', settingsRoutes);
  router.use('/upload', uploadRoutes);

  app.use('/api/v1', router);
};