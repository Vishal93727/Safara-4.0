export interface IUser {
  _id: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: Date;
    gender: string;
    nationality: string;
    bloodGroup?: string;
  };
  addressInfo: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    permanentAddress: {
      isSameAsCurrent: boolean;
      street?: string;
      city?: string;
      state?: string;
      pincode?: string;
      country?: string;
    };
  };
  departmentInfo: {
    department: string;
    division?: string;
    designation: string;
    employeeId: string;
    joiningDate: Date;
    reportingOfficer: string;
    workLocation?: string;
  };
  accountDetails: {
    username: string;
    password: string;
    role: 'admin' | 'supervisor' | 'officer';
    status: 'pending' | 'approved' | 'rejected';
  };
  uploadedFiles?: {
    profilePhoto?: string;
    idProof?: string;
    addressProof?: string;
    departmentLetter?: string;
    joiningLetter?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface JWTPayload {
  userId: string;
  role: string;
  username: string;
}
