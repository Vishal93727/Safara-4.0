import { AuditLog } from '../models/AuditLog.js';
import { logger } from './logger.js';

export const createAuditLog = async ({
  user,
  action,
  description,
  category,
  resource,
  metadata = {},
  ipAddress,
  userAgent,
  severity = 'info',
  status = 'success'
}) => {
  try {
    const auditLog = new AuditLog({
      user,
      action,
      description,
      category,
      resource,
      metadata,
      ipAddress,
      userAgent,
      severity,
      status
    });

    await auditLog.save();
    return auditLog;

  } catch (error) {
    logger.error('Failed to create audit log:', error);
    // Don't throw error as audit logging should not break the main flow
    return null;
  }
};