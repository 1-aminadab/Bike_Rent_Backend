import { Request, Response } from 'express';
import { UserModel } from '../../infrastructure/models/user.model';
import { IUser, IUserService } from '../../domain/interface/user.interface';
import { LoginDto, UserDto } from '../dtos/user.dto';
import { authService } from './auth.service';
import { logger } from '../../logger';

export class UserService implements IUserService {
  async register(userDto: UserDto): Promise<IUser> {
    try {
      logger.info('Registering new user', { userEmail: userDto.phoneNumber});
      
      const hashedPassword = await authService.hashPassword(userDto.password);
      const newUser = new UserModel({ ...userDto, password: hashedPassword });
      await newUser.save();
      
      logger.info('User registered successfully', { userId: newUser._id });
      return newUser;
    } catch (error) {
      logger.error('Error registering user', { error });
      throw error;
    }
  }

  async login(credentials: LoginDto, res: Response): Promise<string> {
    try {
      logger.info('User attempting to log in', { userPhoneNumber: credentials.phoneNumber });
      
      const user = await UserModel.findOne({ phoneNumber: credentials.phoneNumber });
      if (!user) {
        logger.warn('Invalid credentials', { phoneNumber: credentials.phoneNumber });
        throw new Error('Invalid credentials');
      }

      const isPasswordValid = await authService.comparePassword(credentials.password, user.password);
      if (!isPasswordValid) {
        logger.warn('Invalid password', { userId: user._id });
        throw new Error('Invalid credentials');
      }

      const accessToken = authService.generateAccessToken(user);
      const refreshToken = authService.generateRefreshToken(user);
      user.refreshToken = refreshToken;
      await user.save();

      res.cookie('accessToken', accessToken, { httpOnly: true, secure: true, sameSite: 'strict' });
      res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'strict' });
      
      logger.info('User logged in successfully', { userId: user._id });
      return 'Login successful';
    } catch (error) {
      logger.error('Error during login', { error });
      throw error;
    }
  }

  async logout(userId: string, res: Response): Promise<void> {
    try {
      logger.info('User logging out', { userId });

      await UserModel.updateOne({ _id: userId }, { refreshToken: null });

      res.cookie('accessToken', '', {
        httpOnly: true, secure: true, sameSite: 'strict', expires: new Date(0)
      });
      res.cookie('refreshToken', '', {
        httpOnly: true, secure: true, sameSite: 'strict', expires: new Date(0)
      });
      
      logger.info('User logged out successfully', { userId });
    } catch (error) {
      logger.error('Error during logout', { error });
      throw error;
    }
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      logger.info('Refreshing token');
      
      const { refreshToken } = req.cookies;
      if (!refreshToken) {
        logger.warn('No refresh token provided');
        throw new Error('No refresh token provided');
      }

      const user = await UserModel.findOne({ refreshToken });
      if (!user) {
        logger.warn('Invalid refresh token');
        throw new Error('Invalid refresh token');
      }

      const validToken = authService.verifyRefreshToken(refreshToken);
      if (!validToken) {
        logger.warn('Invalid refresh token');
        throw new Error('Invalid refresh token');
      }

      const newAccessToken = authService.generateAccessToken(user);
      const newRefreshToken = authService.generateRefreshToken(user);

      user.refreshToken = newRefreshToken;
      await user.save();

      res.cookie('accessToken', newAccessToken, { httpOnly: true, secure: true, sameSite: 'strict' });
      res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'strict' });
      
      logger.info('Token refreshed successfully', { userId: user._id });
    } catch (error) {
      logger.error('Error during token refresh', { error });
      throw error;
    }
  }
}
