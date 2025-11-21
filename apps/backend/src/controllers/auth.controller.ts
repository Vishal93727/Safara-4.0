import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { emailService } from '../services/email.service';
import { RegistrationRequest } from '../models/RegistrationRequest';
import { successResponse, errorResponse } from '../utils/responses';
import { AuthRequest } from '../middlewares/auth';

export const register = async (req: Request, res: Response) => {
  try {
    const { personalInfo, addressInfo, departmentInfo, accountDetails, uploadedFiles, consent } = req.body;

    // Check if user already exists
    const userExists = await authService.checkUserExists(
      personalInfo.email,
      accountDetails.username,
      departmentInfo.employeeId
    );

    if (userExists) {
      return errorResponse(res, 'User with this email, username, or employee ID already exists', 400);
    }

    // Create new user
    const user = await authService.createUser({
      personalInfo,
      addressInfo,
      departmentInfo,
      accountDetails: {
        ...accountDetails,
        status: 'pending'
      },
      uploadedFiles
    });

    // Generate request ID
    const requestId = `REQ-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(user._id).slice(-4)}`;

    // Create registration request
    const registrationRequest = new RegistrationRequest({
      userId: user._id,
      requestId,
      status: 'pending',
      submittedAt: new Date()
    });

    await registrationRequest.save();

    // Send confirmation email (non-blocking)
    emailService.sendRegistrationConfirmation(
      personalInfo.email,
      personalInfo.firstName,
      requestId
    ).catch(err => console.error('Email error:', err));

    return successResponse(res, {
      requestId,
      userId: user._id,
      status: 'pending',
      message: 'Registration request submitted successfully. Awaiting admin approval.',
      estimatedProcessingTime: '3-5 business days'
    }, 'Registration successful', 201);

  } catch (error: any) {
    console.error('Registration error:', error);
    return errorResponse(res, 'Registration failed', 500, error);
  }
};

export const signin = async (req: Request, res: Response) => {
  try {
    const { username, password, role } = req.body;

    // Validate credentials
    const user = await authService.validateCredentials(username, password);

    if (!user) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    // Check if account is approved
    const isApproved = await authService.isAccountApproved(user);

    if (!isApproved) {
      return errorResponse(res, `Account is ${user.accountDetails.status}. Please contact administrator.`, 403);
    }

    // Check role match if specified
    if (role && user.accountDetails.role !== role) {
      return errorResponse(res, 'Role mismatch', 403);
    }

    // Generate token
    const token = authService.generateAuthToken(user);

    return successResponse(res, {
      token,
      user: {
        id: user._id,
        username: user.accountDetails.username,
        role: user.accountDetails.role,
        firstName: user.personalInfo.firstName,
        lastName: user.personalInfo.lastName,
        email: user.personalInfo.email,
        department: user.departmentInfo.department,
        designation: user.departmentInfo.designation
      }
    }, 'Login successful');

  } catch (error: any) {
    console.error('Login error:', error);
    return errorResponse(res, 'Login failed', 500, error);
  }
};

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await authService.findUserById(req.user!.userId);

    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    return successResponse(res, user, 'Profile retrieved successfully');
  } catch (error: any) {
    return errorResponse(res, 'Failed to retrieve profile', 500, error);
  }
};

export const getAllPendingRequests = async (req: AuthRequest, res: Response) => {
  try {
    const pendingUsers = await authService.getAllPendingUsers();

    return successResponse(res, {
      count: pendingUsers.length,
      requests: pendingUsers
    }, 'Pending requests retrieved successfully');
  } catch (error: any) {
    return errorResponse(res, 'Failed to retrieve pending requests', 500, error);
  }
};

export const approveUser = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await authService.approveUser(userId);

    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    // Update registration request
    await RegistrationRequest.findOneAndUpdate(
      { userId },
      {
        status: 'approved',
        reviewedAt: new Date(),
        reviewedBy: req.user!.userId
      }
    );

    // Send approval email (non-blocking)
    emailService.sendAccountApproval(
      user.personalInfo.email,
      user.personalInfo.firstName,
      user.accountDetails.username
    ).catch(err => console.error('Email error:', err));

    return successResponse(res, user, 'User approved successfully');
  } catch (error: any) {
    return errorResponse(res, 'Failed to approve user', 500, error);
  }
};

export const rejectUser = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;

    const user = await authService.rejectUser(userId);

    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    // Update registration request
    await RegistrationRequest.findOneAndUpdate(
      { userId },
      {
        status: 'rejected',
        reviewedAt: new Date(),
        reviewedBy: req.user!.userId,
        notes: reason
      }
    );

    // Send rejection email (non-blocking)
    emailService.sendAccountRejection(
      user.personalInfo.email,
      user.personalInfo.firstName,
      reason
    ).catch(err => console.error('Email error:', err));

    return successResponse(res, user, 'User rejected successfully');
  } catch (error: any) {
    return errorResponse(res, 'Failed to reject user', 500, error);
  }
};

export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    const { status, role, department } = req.query;
    
    const filters: any = {};
    
    if (status) filters['accountDetails.status'] = status;
    if (role) filters['accountDetails.role'] = role;
    if (department) filters['departmentInfo.department'] = department;

    const users = await authService.getAllUsers(filters);

    return successResponse(res, {
      count: users.length,
      users
    }, 'Users retrieved successfully');
  } catch (error: any) {
    return errorResponse(res, 'Failed to retrieve users', 500, error);
  }
};

export const getUserStats = async (req: AuthRequest, res: Response) => {
  try {
    const stats = await authService.getUserStats();

    return successResponse(res, stats, 'Stats retrieved successfully');
  } catch (error: any) {
    return errorResponse(res, 'Failed to retrieve stats', 500, error);
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { personalInfo, addressInfo, departmentInfo } = req.body;

    const user = await authService.updateUserProfile(req.user!.userId, {
      personalInfo,
      addressInfo,
      departmentInfo
    });

    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    return successResponse(res, user, 'Profile updated successfully');
  } catch (error: any) {
    return errorResponse(res, 'Failed to update profile', 500, error);
  }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;

    const deleted = await authService.deleteUser(userId);

    if (!deleted) {
      return errorResponse(res, 'User not found', 404);
    }

    // Delete associated registration request
    await RegistrationRequest.findOneAndDelete({ userId });

    return successResponse(res, null, 'User deleted successfully');
  } catch (error: any) {
    return errorResponse(res, 'Failed to delete user', 500, error);
  }
};