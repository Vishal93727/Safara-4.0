import { User, IUserDocument } from '../models/User';
import { generateToken } from '../utils/jwts';

export class AuthService {
  async createUser(userData: any): Promise<IUserDocument> {
    const user = new User(userData);
    await user.save();
    return user;
  }
  
//   async createUser(userData: any): Promise<IUserDocument> {
//   const { personalInfo, accountDetails } = userData;

//   if (!personalInfo?.email) {
//     throw new Error("Email is required");
//   }
//   if (!accountDetails?.password) {
//     throw new Error("Password is required");
//   }

//   // Hash password
//   const hashedPassword = await (new User()).hashPassword(accountDetails.password);

//   const user = new User({
//     ...userData,
//     email: personalInfo.email, // <-- needed for unique indexing
//     username: accountDetails.username,
//     'accountDetails.password': hashedPassword
//   });

//   await user.save();
//   return user;
// }


  async findUserByUsername(username: string): Promise<IUserDocument | null> {
    return await User.findOne({ 'accountDetails.username': username });
  }

  async findUserByEmail(email: string): Promise<IUserDocument | null> {
    return await User.findOne({ 'personalInfo.email': email });
  }

  async findUserByEmployeeId(employeeId: string): Promise<IUserDocument | null> {
    return await User.findOne({ 'departmentInfo.employeeId': employeeId });
  }

  async findUserById(userId: string): Promise<IUserDocument | null> {
    return await User.findById(userId).select('-accountDetails.password');
  }

  async checkUserExists(email: string, username: string, employeeId: string): Promise<boolean> {
    const existingUser = await User.findOne({
      $or: [
        { 'personalInfo.email': email },
        { 'accountDetails.username': username },
        { 'departmentInfo.employeeId': employeeId }
      ]
    });
    
    return !!existingUser;
  }

  async validateCredentials(username: string, password: string): Promise<IUserDocument | null> {
    const user = await this.findUserByUsername(username);
    
    if (!user) {
      return null;
    }

    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  async isAccountApproved(user: IUserDocument): Promise<boolean> {
    return user.accountDetails.status === 'approved';
  }

  generateAuthToken(user: IUserDocument): string {
    return generateToken({
      userId: user._id.toString(),
      role: user.accountDetails.role,
      username: user.accountDetails.username
    });
  }

  async getAllPendingUsers(): Promise<IUserDocument[]> {
    return await User.find({ 'accountDetails.status': 'pending' })
      .select('-accountDetails.password')
      .sort({ createdAt: -1 });
  }

  async approveUser(userId: string): Promise<IUserDocument | null> {
    return await User.findByIdAndUpdate(
      userId,
      { 'accountDetails.status': 'approved' },
      { new: true }
    ).select('-accountDetails.password');
  }

  async rejectUser(userId: string): Promise<IUserDocument | null> {
    return await User.findByIdAndUpdate(
      userId,
      { 'accountDetails.status': 'rejected' },
      { new: true }
    ).select('-accountDetails.password');
  }

  async updateUserProfile(userId: string, updateData: any): Promise<IUserDocument | null> {
    return await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-accountDetails.password');
  }

  async deleteUser(userId: string): Promise<boolean> {
    const result = await User.findByIdAndDelete(userId);
    return !!result;
  }

  async getAllUsers(filters?: any): Promise<IUserDocument[]> {
    const query = filters || {};
    return await User.find(query)
      .select('-accountDetails.password')
      .sort({ createdAt: -1 });
  }

  async getUserStats(): Promise<any> {
    const totalUsers = await User.countDocuments();
    const pendingUsers = await User.countDocuments({ 'accountDetails.status': 'pending' });
    const approvedUsers = await User.countDocuments({ 'accountDetails.status': 'approved' });
    const rejectedUsers = await User.countDocuments({ 'accountDetails.status': 'rejected' });
    
    const usersByRole = await User.aggregate([
      {
        $group: {
          _id: '$accountDetails.role',
          count: { $sum: 1 }
        }
      }
    ]);

    const usersByDepartment = await User.aggregate([
      {
        $group: {
          _id: '$departmentInfo.department',
          count: { $sum: 1 }
        }
      }
    ]);

    return {
      totalUsers,
      pendingUsers,
      approvedUsers,
      rejectedUsers,
      usersByRole,
      usersByDepartment
    };
  }
}

export const authService = new AuthService();