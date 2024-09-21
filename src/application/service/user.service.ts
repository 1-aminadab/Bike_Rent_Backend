import { UserRole } from '../../domain/enums/user.enum';
import { IUser } from '../../domain/interface/user.interface';
import UserModel  from '../../infrastructure/models/user.model';
import { logger } from '../../logger';

class UserService {
  async getUserById(userId: string): Promise<IUser | null> {
    try {
      return await UserModel.findById(userId).exec();
    } catch (error) {
      logger.error('Error fetching user by ID', { error });
      throw new Error('Error fetching user by ID');
    }
  }

  async updateUser(userId: string, user: Partial<IUser>): Promise<IUser | null> {
    console.log(user, 'updated info ..................');
  
    try {
      // Cast the status to boolean if it exists
      if (user.status) {  
        user.status = user.status === 'active';
      }
  
      return await UserModel.findByIdAndUpdate(userId, user, { new: true }).exec();
    } catch (error) {
      logger.error('Error updating user', { error });
      throw new Error('Error updating user');
    }
  }

  async deleteUser(userId: string): Promise<IUser | null> {
    try {
    return await UserModel.findOneAndDelete({ _id: userId, role: UserRole.User }).exec();
      // return await UserModel.findByIdAndDelete(userId).exec();
    } catch (error) {
      logger.error('Error deleting user', { error });
      throw new Error('Error deleting user');
    }
  }

async getAllUsers(): Promise<IUser[]> {
    try {
      return await UserModel.find({ role: UserRole.User}).exec();
    } catch (error) {
      logger.error('Error fetching all users', { error });
      throw new Error('Error fetching all users');
    }
  }
//  ________________________ sub admins ___________________________________________
  async getSubAdmins(): Promise<IUser[]> {
    try {
      return await UserModel.find({ role: UserRole.SubAdmin })
      .select('-password -refreshToken')  // Exclude password and refreshToken
      .exec();
    } catch (error) {
      logger.error('Error fetching sub-admins', { error });
      throw new Error('Error fetching sub-admins');
    }
  }

//  ________________________ admins ___________________________________________

  async getAdmins(): Promise<IUser[]> {
    try {
      return await UserModel.find({ role: UserRole.Admin }).exec();
    } catch (error) {
      logger.error('Error fetching admins', { error });
      throw new Error('Error fetching admins');
    }
  }
// Update SubAdmin
async updateSubAdmin(userId: string, user: Partial<IUser>): Promise<IUser | null> {
  try {
    console.log('new data ..............');
    
    // Handle status conversion if necessary
    if (user.status) {
      user.status = user.status === 'active';
    }

    return await UserModel.findOneAndUpdate({ _id: userId, role: UserRole.SubAdmin }, user, { new: true }).exec();
  } catch (error) {
    logger.error('Error updating sub-admin', { error });
    throw new Error('Error updating sub-admin');
  }
}

// Update Admin
async updateAdmin(userId: string, user: Partial<IUser>): Promise<IUser | null> {
  try {
    // Handle status conversion if necessary
    if (user.status) {
      user.status = user.status === 'active';
    }

    return await UserModel.findOneAndUpdate({ _id: userId, role: UserRole.Admin }, user, { new: true }).exec();
  } catch (error) {
    logger.error('Error updating admin', { error });
    throw new Error('Error updating admin');
  }
}

// Delete SubAdmin
async deleteSubAdmin(userId: string): Promise<IUser | null> {
  try {
    return await UserModel.findOneAndDelete({ _id: userId, role: UserRole.SubAdmin }).exec();
  } catch (error) {
    logger.error('Error deleting sub-admin', { error });
    throw new Error('Error deleting sub-admin');
  }
}

// Delete Admin
async deleteAdmin(userId: string): Promise<IUser | null> {
  try {
    return await UserModel.findOneAndDelete({ _id: userId, role: UserRole.Admin }).exec();
  } catch (error) {
    logger.error('Error deleting admin', { error });
    throw new Error('Error deleting admin');
  }
}


}


export const userService = new UserService();
