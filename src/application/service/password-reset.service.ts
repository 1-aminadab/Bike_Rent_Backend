import axios from 'axios';
import bcrypt from 'bcryptjs';
import { authService } from './auth.service';
import { TokenManager } from '../../infrastructure/utils/token-manager';
import { userService } from './user.service';
import { logger } from '../../logger';

interface OtpResponse {
  success: boolean;
  message?: string;
  token?: string;
}


export class PasswordResetService {
  private generateOtp(): number {
    const min = 10000;
    const max = 99999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  async sendOtp(phoneNumber: string): Promise<OtpResponse > {
console.log('user otp....')

    try {
      const user = await authService.findUser(phoneNumber);
      if (!user) {
        logger.warn(`User with phone number ${phoneNumber} not found`);
        return { success: false, message: 'User not found' };
      }

      const otp = this.generateOtp().toString();
      console.log('generated otp', otp);
      
      const otpSent = await this.sendOtpViaSms(phoneNumber, otp);

      if (!otpSent) {
        throw new Error('Problem sending OTP, please try again later');
      }

      const token = TokenManager.generateAccessToken({ otp, phoneNumber });
      return { success: true, token };
    } catch (error) {
      logger.error('Error in sendOtp', { error });
      return { success: false, message: 'Internal server error' };
    }
  }

  async verifyOtp(token: string, receivedOtp: string): Promise<OtpResponse> {
    try {
      const decodedToken = TokenManager.verifyAccessToken(token);
      const { otp, phoneNumber } = decodedToken;

      if (!otp || otp.toString() !== receivedOtp || !phoneNumber) {
        logger.warn('Invalid OTP or token');
        return { success: false, message: 'Invalid OTP' };
      }

      const newToken = TokenManager.generateAccessToken({ phoneNumber }, '30m');
      return { success: true, message: 'OTP verification successful', token: newToken };
    } catch (error) {
      logger.error('Error verifying OTP', { error });
      return { success: false, message: 'Error verifying OTP' };
    }
  }

  async changePassword(token: string, newPassword: string): Promise<OtpResponse> {
    try {
      const decodedToken = TokenManager.verifyAccessToken(token);
      const { phoneNumber } = decodedToken;

      const user = await authService.findUser(phoneNumber);
      if (!user) {
        logger.warn(`User with phone number ${phoneNumber} not found`);
        return { success: false, message: 'User not found' };
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await userService.updateUser(user._id, { password: hashedPassword });

      return { success: true, message: 'Password changed successfully' };
    } catch (error) {
      logger.error('Error changing password', { error });
      return { success: false, message: 'Error changing password' };
    }
  }
  async changePasswordByAdmin(phoneNumber:string, newPassword: string): Promise<OtpResponse> {
    try {
      // const decodedToken = TokenManager.verifyAccessToken(token);
      // const { phoneNumber } = decodedToken;
      console.log(phoneNumber);

      const user = await authService.findUser(phoneNumber);
      if (!user) {
        logger.warn(`User with phone number ${phoneNumber} not found`);
        return { success: false, message: 'User not found' };
      }
      console.log(user);

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await userService.updateUser(user._id, { password: hashedPassword });

      return { success: true, message: 'Password changed successfully' };
    } catch (error) {
      logger.error('Error changing password', { error });
      return { success: false, message: 'Error changing password' };
    }
  }

  private async sendOtpViaSms(phoneNumber: string, otp: string): Promise<boolean> {
    const data = {
      id: '26728',
      domain: 'besewonline.com',
      to: phoneNumber,
      otp
    };
    try {
      const response = await axios.post('https://sms.yegara.com/api3/send', data);
      return response.status === 200;
    } catch (error) {
      logger.error('Failed to send OTP via SMS', { error });
      return false;
    }
  }
}

