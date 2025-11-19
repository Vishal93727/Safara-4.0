import { User } from '../models/User.js';
import { AuditLog } from '../models/AuditLog.js';
import { logger } from '../utils/logger.js';
import { createAuditLog } from '../utils/audit.js';
import { sendEmail } from '../utils/email.js';

export const getAllUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      role,
      status,
      department,
      search
    } = req.query;

    const filter = {};
    
    if (role) filter['accountDetails.role'] = role;
    if (status) filter.status = status;
    if (department) filter['departmentInfo.department'] = department;
    
    if (search) {
      filter.$or = [
        { 'personalInfo.firstName': { $regex: search, $options: 'i' } },
        { 'personalInfo.lastName': { $regex: search, $options: 'i' } },
        { 'personalInfo.email': { $regex: search, $options: 'i' } },
        { 'accountDetails.username': { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(filter)
      .select('-accountDetails.password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(filter);

    res.json({
      status: 'success',
      data: {
        users,
        pagination: {
          page: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });

  } catch (error) {
    logger.error('Get all users error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch users'
    });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-accountDetails.password');

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Check permissions - users can only view their own profile unless admin/supervisor
    if (req.user._id.toString() !== user._id.toString() && 
        !['admin', 'supervisor'].includes(req.user.accountDetails.role)) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied'
      });
    }

    res.json({
      status: 'success',
      data: { user }
    });

  } catch (error) {
    logger.error('Get user error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch user'
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Update user fields
    Object.keys(updates).forEach(key => {
      if (key !== 'accountDetails.password') { // Don't allow password updates through this endpoint
        user[key] = updates[key];
      }
    });

    await user.save();

    await createAuditLog({
      user: req.user._id,
      action: 'USER_UPDATE',
      description: `Updated user: ${user.fullName}`,
      category: 'user_management',
      metadata: { 
        targetUser: user._id,
        updatedFields: Object.keys(updates)
      }
    });

    res.json({
      status: 'success',
      message: 'User updated successfully',
      data: { user }
    });

  } catch (error) {
    logger.error('Update user error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update user'
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    await user.deleteOne();

    await createAuditLog({
      user: req.user._id,
      action: 'USER_DELETE',
      description: `Deleted user: ${user.fullName}`,
      category: 'user_management',
      metadata: { deletedUser: user._id }
    });

    res.json({
      status: 'success',
      message: 'User deleted successfully'
    });

  } catch (error) {
    logger.error('Delete user error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete user'
    });
  }
};

export const getUserStats = async (req, res) => {
  try {
    const stats = await User.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          active: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
          inactive: { $sum: { $cond: [{ $eq: ['$status', 'inactive'] }, 1, 0] } },
          suspended: { $sum: { $cond: [{ $eq: ['$status', 'suspended'] }, 1, 0] } },
          pending: { $sum: { $cond: [{ $eq: ['$registrationStatus.status', 'pending'] }, 1, 0] } },
          approved: { $sum: { $cond: [{ $eq: ['$registrationStatus.status', 'approved'] }, 1, 0] } }
        }
      }
    ]);

    const roleStats = await User.aggregate([
      {
        $group: {
          _id: '$accountDetails.role',
          count: { $sum: 1 }
        }
      }
    ]);

    const departmentStats = await User.aggregate([
      {
        $group: {
          _id: '$departmentInfo.department',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      status: 'success',
      data: {
        overview: stats[0] || {
          total: 0, active: 0, inactive: 0, suspended: 0, pending: 0, approved: 0
        },
        roleDistribution: roleStats,
        departmentDistribution: departmentStats
      }
    });

  } catch (error) {
    logger.error('Get user stats error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch user statistics'
    });
  }
};

export const approveUser = async (req, res) => {
  try {
    const { role, permissions } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    user.registrationStatus.status = 'approved';
    user.registrationStatus.approvedAt = new Date();
    user.registrationStatus.approvedBy = req.user._id;
    user.status = 'active';
    
    if (role) user.accountDetails.role = role;
    if (permissions) user.permissions = permissions;

    await user.save();

    await createAuditLog({
      user: req.user._id,
      action: 'USER_APPROVE',
      description: `Approved user: ${user.fullName}`,
      category: 'user_management',
      metadata: { approvedUser: user._id, role }
    });

    // Send approval email
    try {
      await sendEmail({
        to: user.personalInfo.email,
        subject: 'Account Approved - SentinelView Authority',
        template: 'account-approved',
        data: {
          name: user.fullName,
          username: user.accountDetails.username,
          role: user.accountDetails.role
        }
      });
    } catch (emailError) {
      logger.error('Failed to send approval email:', emailError);
    }

    res.json({
      status: 'success',
      message: 'User approved successfully',
      data: { user }
    });

  } catch (error) {
    logger.error('Approve user error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to approve user'
    });
  }
};

export const rejectUser = async (req, res) => {
  try {
    const { reason } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    user.registrationStatus.status = 'rejected';
    user.registrationStatus.reviewedAt = new Date();
    user.registrationStatus.reviewedBy = req.user._id;
    user.registrationStatus.rejectionReason = reason;

    await user.save();

    await createAuditLog({
      user: req.user._id,
      action: 'USER_REJECT',
      description: `Rejected user: ${user.fullName}`,
      category: 'user_management',
      metadata: { rejectedUser: user._id, reason }
    });

    // Send rejection email
    try {
      await sendEmail({
        to: user.personalInfo.email,
        subject: 'Account Registration Update - SentinelView Authority',
        template: 'account-rejected',
        data: {
          name: user.fullName,
          reason
        }
      });
    } catch (emailError) {
      logger.error('Failed to send rejection email:', emailError);
    }

    res.json({
      status: 'success',
      message: 'User rejected successfully'
    });

  } catch (error) {
    logger.error('Reject user error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to reject user'
    });
  }
};

export const suspendUser = async (req, res) => {
  try {
    const { reason } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    user.status = 'suspended';
    await user.save();

    await createAuditLog({
      user: req.user._id,
      action: 'USER_SUSPEND',
      description: `Suspended user: ${user.fullName}`,
      category: 'user_management',
      metadata: { suspendedUser: user._id, reason }
    });

    res.json({
      status: 'success',
      message: 'User suspended successfully'
    });

  } catch (error) {
    logger.error('Suspend user error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to suspend user'
    });
  }
};

export const activateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    user.status = 'active';
    await user.save();

    await createAuditLog({
      user: req.user._id,
      action: 'USER_ACTIVATE',
      description: `Activated user: ${user.fullName}`,
      category: 'user_management',
      metadata: { activatedUser: user._id }
    });

    res.json({
      status: 'success',
      message: 'User activated successfully'
    });

  } catch (error) {
    logger.error('Activate user error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to activate user'
    });
  }
};

export const getUserAuditLog = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const userId = req.params.id;

    const auditLogs = await AuditLog.find({
      $or: [
        { user: userId },
        { 'metadata.targetUser': userId },
        { 'metadata.approvedUser': userId },
        { 'metadata.rejectedUser': userId }
      ]
    })
    .populate('user', 'personalInfo.firstName personalInfo.lastName')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

    const total = await AuditLog.countDocuments({
      $or: [
        { user: userId },
        { 'metadata.targetUser': userId },
        { 'metadata.approvedUser': userId },
        { 'metadata.rejectedUser': userId }
      ]
    });

    res.json({
      status: 'success',
      data: {
        auditLogs,
        pagination: {
          page: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });

  } catch (error) {
    logger.error('Get user audit log error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch user audit log'
    });
  }
};