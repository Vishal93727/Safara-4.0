import { logger } from '../utils/logger.js';
import { verifySocketToken } from '../middlewares/authMiddleware.js';

export const setupSocketIO = (io) => {
  // Socket authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization;
      if (!token) {
        return next(new Error('Authentication error'));
      }
      
      const user = await verifySocketToken(token);
      socket.userId = user.id;
      socket.userRole = user.role;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    logger.info(`User connected: ${socket.userId} (${socket.userRole})`);
    
    // Join room based on role
    socket.join(socket.userRole);
    socket.join(`user_${socket.userId}`);

    // Handle real-time events
    socket.on('join_zone', (zoneId) => {
      socket.join(`zone_${zoneId}`);
      logger.info(`User ${socket.userId} joined zone ${zoneId}`);
    });

    socket.on('leave_zone', (zoneId) => {
      socket.leave(`zone_${zoneId}`);
      logger.info(`User ${socket.userId} left zone ${zoneId}`);
    });

    socket.on('incident_update', (data) => {
      // Broadcast incident updates to relevant users
      io.to('admin').to('supervisor').emit('incident_update', data);
    });

    socket.on('emergency_alert', (data) => {
      // Broadcast emergency alerts to all connected users
      io.emit('emergency_alert', data);
    });

    socket.on('disconnect', () => {
      logger.info(`User disconnected: ${socket.userId}`);
    });
  });

  return io;
};