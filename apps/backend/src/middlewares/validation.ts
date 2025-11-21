import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { errorResponse } from '../utils/responses';

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return errorResponse(res, 'Validation failed', 400, errors.array());
  }
  
  next();
};

export const registerValidation = [
  // Personal Info
  body('personalInfo.firstName').trim().notEmpty().withMessage('First name is required'),
  body('personalInfo.lastName').trim().notEmpty().withMessage('Last name is required'),
  body('personalInfo.email').isEmail().withMessage('Valid email is required'),
  body('personalInfo.phone').isMobilePhone('any').withMessage('Valid phone number is required'),
  body('personalInfo.dateOfBirth').isDate().withMessage('Valid date of birth is required'),
  body('personalInfo.gender').isIn(['male', 'female', 'other']).withMessage('Valid gender is required'),
  
  // Address Info
  body('addressInfo.street').trim().notEmpty().withMessage('Street is required'),
  body('addressInfo.city').trim().notEmpty().withMessage('City is required'),
  body('addressInfo.state').trim().notEmpty().withMessage('State is required'),
  body('addressInfo.pincode').isLength({ min: 6, max: 6 }).withMessage('Valid pincode is required'),
  
  // Department Info
  body('departmentInfo.department').trim().notEmpty().withMessage('Department is required'),
  body('departmentInfo.designation').trim().notEmpty().withMessage('Designation is required'),
  body('departmentInfo.employeeId').trim().notEmpty().withMessage('Employee ID is required'),
  body('departmentInfo.joiningDate').isDate().withMessage('Valid joining date is required'),
  body('departmentInfo.reportingOfficer').trim().notEmpty().withMessage('Reporting officer is required'),
  
  // Account Details
  body('accountDetails.username')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('Username must be 4-20 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('accountDetails.password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  body('accountDetails.requestedRole')
    .isIn(['admin', 'supervisor', 'officer'])
    .withMessage('Invalid role'),
  
  // Consent
  body('consent.accepted').isBoolean().withMessage('Consent must be accepted'),
  
  handleValidationErrors
];

export const loginValidation = [
  body('username').trim().notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required'),
  body('role').optional().isIn(['admin', 'supervisor', 'officer']).withMessage('Invalid role'),
  
  handleValidationErrors
];
