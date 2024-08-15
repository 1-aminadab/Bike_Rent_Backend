// application/services/auth.service.ts
/* eslint-disable no-return-await */
import bcrypt from 'bcryptjs';
import { IAuthService } from '../../domain/interface/auth.interface';
import { IUser } from '../../domain/interface/user.interface';
import { TokenManager } from '../../infrastructure/utils/token-manager';
import { logger } from '../../logger';

export class AuthService implements IAuthService {
  async hashPassword(password: string): Promise<string> {
    try {
      logger.info('Hashing password');
      const hashedPassword = await bcrypt.hash(password, 10);
      logger.info('Password hashed successfully');
      return hashedPassword;
    } catch (error) {
      logger.error('Error hashing password', { error });
      throw error;
    }
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    try {
      logger.info('Comparing password');
      const isMatch = await bcrypt.compare(password, hash);
      logger.info(`Password comparison result: ${isMatch}`);
      return isMatch;
    } catch (error) {
      logger.error('Error comparing password', { error });
      throw error;
    }
  }

  generateAccessToken(user: IUser): string {
    try {
      logger.info('Generating access token', { userId: user._id });
      const token = TokenManager.generateAccessToken(user);
      logger.info('Access token generated successfully');
      return token;
    } catch (error) {
      logger.error('Error generating access token', { error });
      throw error;
    }
  }

  generateRefreshToken(user: IUser): string {
    try {
      logger.info('Generating refresh token', { userId: user._id });
      const token = TokenManager.generateRefreshToken(user);
      logger.info('Refresh token generated successfully');
      return token;
    } catch (error) {
      logger.error('Error generating refresh token', { error });
      throw error;
    }
  }

  verifyAccessToken(token: string): any {
    try {
      logger.info('Verifying access token');
      const decoded = TokenManager.verifyAccessToken(token);
      logger.info('Access token verified successfully');
      return decoded;
    } catch (error) {
      logger.error('Error verifying access token', { error });
      throw error;
    }
  }

  verifyRefreshToken(token: string): any {
    try {
      logger.info('Verifying refresh token');
      const decoded = TokenManager.verifyRefreshToken(token);
      logger.info('Refresh token verified successfully');
      return decoded;
    } catch (error) {
      logger.error('Error verifying refresh token', { error });
      throw error;
    }
  }
}

export const authService = new AuthService();
