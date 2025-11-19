import { body, param, query, validationResult } from 'express-validator';

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// User validation rules
// export const validateRegistration = [
//   body('personalInfo.firstName').trim().isLength({ min: 2 }).withMessage('First name must be at least 2 characters'),
//   body('personalInfo.lastName').trim().isLength({ min: 2 }).withMessage('Last name must be at least 2 characters'),
//   body('personalInfo.email').isEmail().normalizeEmail().withMessage('Valid email is required'),
//   body('personalInfo.phone').isMobilePhone().withMessage('Valid phone number is required'),
//   body('personalInfo.dateOfBirth').isDate().withMessage('Valid date of birth is required'),
//   body('accountDetails.username').trim().isLength({ min: 4 }).withMessage('Username must be at least 4 characters'),
//   body('accountDetails.password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
//   body('departmentInfo.department').notEmpty().withMessage('Department is required'),
//   body('departmentInfo.designation').notEmpty().withMessage('Designation is required'),
//   handleValidationErrors
// ];
export const validateRegistration = (req, res, next) => {
  const { personalInfo, accountDetails, departmentInfo, consent, uploadedFiles } = req.body;

  // basic fields
  if (!personalInfo?.email) {
    return res.status(400).json({ message: "Email is required" });
  }
  if (!accountDetails?.username) {
    return res.status(400).json({ message: "Username is required" });
  }
  if (!departmentInfo?.employeeId) {
    return res.status(400).json({ message: "Employee ID is required" });
  }
  // if (!consent?.accepted) {
  //   return res.status(400).json({ message: "Consent must be accepted" });
  // }
  
  
  // ✅ check uploadedFiles instead of req.files
  // const requiredDocs = ["profilePhoto", "idProof", "addressProof", "departmentLetter", "joiningLetter"];
  // for (const doc of requiredDocs) {
  //   if (!uploadedFiles?.[doc]) {
  //     return res.status(400).json({ message: `${doc} is required` });
  //   }
  // }

  next();
};
export const validateLogin = [
  body('username').trim().notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required'),
  body('role').isIn(['officer', 'supervisor', 'admin']).withMessage('Valid role is required'),
  handleValidationErrors
];

export const validateIncident = [
  body('type').isIn(['emergency', 'medical', 'security', 'traffic', 'natural_disaster']).withMessage('Valid incident type is required'),
  body('priority').isIn(['low', 'medium', 'high', 'critical']).withMessage('Valid priority is required'),
  body('location.coordinates').isArray({ min: 2, max: 2 }).withMessage('Valid coordinates are required'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  handleValidationErrors
];