import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { User } from '../models/User.js';
import { generateToken } from '../middlewares/authMiddleware.js';
import { logger } from '../utils/logger.js';
import { redisClient } from '../config/redis.js';
import { sendEmail } from '../utils/email.js';
import { createAuditLog } from '../utils/audit.js';

// export const register = async (req, res) => {
//   try {
//     const userData = req.body;
    
//     // Check if user already exists
//     const existingUser = await User.findOne({
//       $or: [
//         { 'personalInfo.email': userData.personalInfo.email },
//         { 'accountDetails.username': userData.accountDetails.username },
//         { 'departmentInfo.employeeId': userData.departmentInfo.employeeId }
//       ]
//     });

//     if (existingUser) {
//       return res.status(400).json({
//         status: 'error',
//         message: 'User with this email, username, or employee ID already exists'
//       });
//     }

//     // Process uploaded files
//     const uploadedDocuments = {};
//     if (req.files) {
//       Object.keys(req.files).forEach(key => {
//         if (req.files[key] && req.files[key][0]) {
//           uploadedDocuments[key] = {
//             url: req.files[key][0].path,
//             publicId: req.files[key][0].filename,
//             uploadedAt: new Date()
//           };
//         }
//       });
//     }

//     // Generate request ID
//     const requestId = `REQ-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0')}`;

//     // Create user
//     const user = await User.create({
//       ...userData,
//       uploadedDocuments,
//       registrationStatus: {
//         status: 'pending',
//         requestId,
//         submittedAt: new Date(),
//         estimatedProcessingTime: '3-5 business days'
//       },
//       consent: {
//         ...userData.consent,
//         consentGivenAt: new Date()
//       }
//     });

//     // Create audit log
//     await createAuditLog({
//       user: user._id,
//       action: 'USER_REGISTRATION',
//       description: `New user registration: ${user.fullName}`,
//       category: 'user_management',
//       metadata: { requestId, email: user.personalInfo.email }
//     });

//     // Send confirmation email
//     try {
//       await sendEmail({
//         to: user.personalInfo.email,
//         subject: 'Registration Confirmation - SentinelView Authority',
//         template: 'registration-confirmation',
//         data: {
//           name: user.fullName,
//           requestId,
//           estimatedProcessingTime: '3-5 business days'
//         }
//       });
//     } catch (emailError) {
//       logger.error('Failed to send registration confirmation email:', emailError);
//     }

//     res.status(201).json({
//       status: 'success',
//       message: 'Registration request submitted successfully!',
//       data: {
//         requestId,
//         estimatedProcessingTime: '3-5 business days',
//         user: {
//           id: user._id,
//           name: user.fullName,
//           email: user.personalInfo.email,
//           status: user.registrationStatus.status
//         }
//       }
//     });

//   } catch (error) {
//     logger.error('Registration error:', error);
//     res.status(500).json({
//       status: 'error',
//       message: 'Registration failed. Please try again.'
//     });
//   }
// };

export const register = async (req, res) => {
  try {
    const userData = req.body;

    // ✅ Step 1: Ensure accountDetails exists
    if (!userData.accountDetails) {
      userData.accountDetails = {};
    }

    // ✅ Step 2: Auto-generate username if not provided
    if (!userData.accountDetails.username) {
      const first = userData.personalInfo?.firstName || "user";
      const last = userData.personalInfo?.lastName || "guest";
      userData.accountDetails.username = `${first.toLowerCase()}${last.toLowerCase()}${Date.now()}`;
    }

    // ✅ Step 3: Duplicate check AFTER username is set
    const existingUser = await User.findOne({
      $or: [
        { 'personalInfo.email': userData.personalInfo.email },
        { 'accountDetails.username': userData.accountDetails.username },
        { 'departmentInfo.employeeId': userData.departmentInfo.employeeId }
      ]
    });

    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'User with this email, username, or employee ID already exists'
      });
    }

    // ✅ Fix: map uploadedFiles
    const uploadedDocuments = {};
    if (userData.uploadedFiles) {
      Object.entries(userData.uploadedFiles).forEach(([key, url]) => {
        if (url) {
          uploadedDocuments[key] = { url, uploadedAt: new Date() };
        }
      });
    }

    // ✅ Step 4: Generate requestId
    const requestId = `REQ-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0')}`;

    // ✅ Step 5: Create user
    const user = await User.create({
      personalInfo: userData.personalInfo,
      addressInfo: userData.addressInfo,
      departmentInfo: userData.departmentInfo,
      identityProof: userData.identityProof,
      emergencyContact: userData.emergencyContact,
      accountDetails: userData.accountDetails, // ✅ guaranteed not null now
      uploadedDocuments,
      registrationStatus: {
        status: 'pending',
        requestId,
        submittedAt: new Date(),
        estimatedProcessingTime: '3-5 business days'
      },
      consent: {
        ...userData.consent,
        consentGivenAt: new Date()
      }
    });

    // ✅ Audit log + email
    await createAuditLog({
      user: user._id,
      action: 'USER_REGISTRATION',
      description: `New user registration: ${user.fullName}`,
      category: 'user_management',
      metadata: { requestId, email: user.personalInfo.email }
    });

    try {
      await sendEmail({
        to: user.personalInfo.email,
        subject: 'Registration Confirmation - SentinelView Authority',
        template: 'registration-confirmation',
        data: {
          name: user.fullName,
          requestId,
          estimatedProcessingTime: '3-5 business days'
        }
      });
    } catch (emailError) {
      logger.error('Failed to send registration confirmation email:', emailError);
    }

    res.status(201).json({
      status: 'success',
      message: 'Registration request submitted successfully!',
      data: {
        requestId,
        estimatedProcessingTime: '3-5 business days',
        user: {
          id: user._id,
          name: user.fullName,
          email: user.personalInfo.email,
          status: user.registrationStatus.status
        }
      }
    });

  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Registration failed. Please try again.'
    });
  }
};




export const login = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // Find user
    const user = await User.findOne({
      'accountDetails.username': username,
      'accountDetails.role': role
    });

    if (!user) {
      await createAuditLog({
        action: 'LOGIN_FAILED',
        description: `Failed login attempt for username: ${username}`,
        category: 'authentication',
        metadata: { username, role, reason: 'user_not_found' }
      });

      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      });
    }

    // Check if account is locked
    if (user.isLocked) {
      return res.status(423).json({
        status: 'error',
        message: 'Account temporarily locked due to too many failed login attempts'
      });
    }

    // Check if account is active
    if (user.status !== 'active' || user.registrationStatus.status !== 'approved') {
      return res.status(401).json({
        status: 'error',
        message: 'Account is not active or not approved yet'
      });
    }

    // Verify password
    const isPasswordValid = await user.matchPassword(password);
    if (!isPasswordValid) {
      // Increment login attempts
      user.loginAttempts += 1;
      
      // Lock account after 5 failed attempts
      if (user.loginAttempts >= 5) {
        user.lockUntil = Date.now() + 30 * 60 * 1000; // Lock for 30 minutes
      }
      
      await user.save();

      await createAuditLog({
        user: user._id,
        action: 'LOGIN_FAILED',
        description: `Failed login attempt for user: ${user.fullName}`,
        category: 'authentication',
        metadata: { username, attempts: user.loginAttempts }
      });

      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      });
    }

    // Reset login attempts on successful login
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Store token in Redis for session management
    await redisClient.setEx(`session:${user._id}`, 86400, token); // 24 hours

    await createAuditLog({
      user: user._id,
      action: 'LOGIN_SUCCESS',
      description: `Successful login for user: ${user.fullName}`,
      category: 'authentication',
      metadata: { username, role }
    });

    res.json({
      status: 'success',
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          name: user.fullName,
          email: user.personalInfo.email,
          role: user.accountDetails.role,
          permissions: user.permissions,
          preferences: user.preferences
        }
      }
    });

  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Login failed. Please try again.'
    });
  }
};

export const logout = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (token) {
      // Add token to blacklist
      await redisClient.setEx(`blacklist:${token}`, 86400, 'true');
      
      // Remove session
      await redisClient.del(`session:${req.user._id}`);
    }

    await createAuditLog({
      user: req.user._id,
      action: 'LOGOUT',
      description: `User logged out: ${req.user.fullName}`,
      category: 'authentication'
    });

    res.json({
      status: 'success',
      message: 'Logout successful'
    });

  } catch (error) {
    logger.error('Logout error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Logout failed'
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-accountDetails.password');
    
    res.json({
      status: 'success',
      data: { user }
    });

  } catch (error) {
    logger.error('Get profile error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch profile'
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Update allowed fields
    const allowedUpdates = [
      'personalInfo.phone', 'addressInfo', 'emergencyContact', 'preferences'
    ];
    
    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key) || key.startsWith('preferences.')) {
        if (key.includes('.')) {
          const [parent, child] = key.split('.');
          user[parent][child] = updates[key];
        } else {
          user[key] = updates[key];
        }
      }
    });

    await user.save();

    await createAuditLog({
      user: user._id,
      action: 'PROFILE_UPDATE',
      description: `Profile updated for user: ${user.fullName}`,
      category: 'user_management',
      metadata: { updatedFields: Object.keys(updates) }
    });

    res.json({
      status: 'success',
      message: 'Profile updated successfully',
      data: { user }
    });

  } catch (error) {
    logger.error('Update profile error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update profile'
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await user.matchPassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        status: 'error',
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.accountDetails.password = newPassword;
    await user.save();

    await createAuditLog({
      user: user._id,
      action: 'PASSWORD_CHANGE',
      description: `Password changed for user: ${user.fullName}`,
      category: 'authentication'
    });

    res.json({
      status: 'success',
      message: 'Password changed successfully'
    });

  } catch (error) {
    logger.error('Change password error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to change password'
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ 'personalInfo.email': email });

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found with this email address'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Store reset token in Redis with expiration
    await redisClient.setEx(`reset:${hashedToken}`, 600, user._id.toString()); // 10 minutes

    // Send reset email
    try {
      const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
      
      await sendEmail({
        to: user.personalInfo.email,
        subject: 'Password Reset Request - SentinelView Authority',
        template: 'password-reset',
        data: {
          name: user.fullName,
          resetURL
        }
      });

      res.json({
        status: 'success',
        message: 'Password reset email sent successfully'
      });

    } catch (emailError) {
      logger.error('Failed to send password reset email:', emailError);
      res.status(500).json({
        status: 'error',
        message: 'Failed to send password reset email'
      });
    }

  } catch (error) {
    logger.error('Forgot password error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to process password reset request'
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const userId = await redisClient.get(`reset:${hashedToken}`);

    if (!userId) {
      return res.status(400).json({
        status: 'error',
        message: 'Password reset token is invalid or has expired'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Update password
    user.accountDetails.password = password;
    await user.save();

    // Delete reset token
    await redisClient.del(`reset:${hashedToken}`);

    await createAuditLog({
      user: user._id,
      action: 'PASSWORD_RESET',
      description: `Password reset for user: ${user.fullName}`,
      category: 'authentication'
    });

    res.json({
      status: 'success',
      message: 'Password reset successful'
    });

  } catch (error) {
    logger.error('Reset password error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to reset password'
    });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    // Implement refresh token logic here
    // For now, return error as refresh tokens need separate implementation
    res.status(501).json({
      status: 'error',
      message: 'Refresh token functionality not implemented yet'
    });

  } catch (error) {
    logger.error('Refresh token error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to refresh token'
    });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    
    // Implement email verification logic here
    res.status(501).json({
      status: 'error',
      message: 'Email verification functionality not implemented yet'
    });

  } catch (error) {
    logger.error('Verify email error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to verify email'
    });
  }
};