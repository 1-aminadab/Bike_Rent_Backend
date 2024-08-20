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
    try {
      return await UserModel.findByIdAndUpdate(userId, user, { new: true }).exec();
    } catch (error) {
      logger.error('Error updating user', { error });
      throw new Error('Error updating user');
    }
  }

  async deleteUser(userId: string): Promise<IUser | null> {
    try {
      return await UserModel.findByIdAndDelete(userId).exec();
    } catch (error) {
      logger.error('Error deleting user', { error });
      throw new Error('Error deleting user');
    }
  }

  async getAllUsers(): Promise<IUser[]> {
    try {
      return await UserModel.find().exec();
    } catch (error) {
      logger.error('Error fetching all users', { error });
      throw new Error('Error fetching all users');
    }
  }
}

export const userService = new UserService();
