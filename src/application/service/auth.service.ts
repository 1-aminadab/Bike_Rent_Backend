import bcrypt from "bcryptjs";
import UserModel from "../../infrastructure/models/user.model";
import { IUser } from "../../domain/interface/user.interface";
import { LoginDto, UserDto } from "../dtos/user.dto";
import { TokenManager } from "../../infrastructure/utils/token-manager";
import { logger } from "../../logger";
import {
  validateEmail,
  validatePassword,
  validatePhoneNumber,
} from "../../infrastructure/utils/validator";
import { PasswordResetService } from "./password-reset.service";
import { Request, Response } from "express";

const otpService = new PasswordResetService();

class AuthService {
  private temporaryUserStore: Map<string, any> = new Map();

  private async hashPassword(password: string): Promise<string> {
    const hashed = await bcrypt.hash(password, 10);
    logger.info(`Password hashed successfully`);
    return hashed;
  }

  private async comparePassword(password: string, hash: string): Promise<boolean> {
    const isMatch = await bcrypt.compare(password, hash);
    logger.debug(`Password comparison result: ${isMatch}`);
    return isMatch;
  }

  public async findUser(phoneNumber: string): Promise<IUser | null> {
    const user = await UserModel.findOne({ phoneNumber });
    logger.info(`User lookup for phone number ${phoneNumber}: ${user ? "Found" : "Not Found"}`);
    return user;
  }

  public async register(userDto: UserDto): Promise<any> {
    try {
      logger.info('Registering new user', { email: userDto.email, phoneNumber: userDto.phoneNumber });

      if (userDto.email && !validateEmail(userDto.email)) {
        throw { status: 400, message: "Invalid email format!" };
      }
      if (!validatePhoneNumber(userDto.phoneNumber)) {
        throw { status: 400, message: "Invalid phone number format" };
      }
      if (!validatePassword(userDto.password)) {
        throw { status: 400, message: "Password does not meet security requirements" };
      }

      const existingUser = await this.findUser(userDto.phoneNumber);
      if (existingUser) {
        throw { status: 409, message: "User already exists" };
      }

      const hashedPassword = await this.hashPassword(userDto.password);

      const user = new UserModel({ ...userDto, password: hashedPassword });
      await user.save();

      // const otpResponse = await otpService.sendOtp(userDto.phoneNumber);

      // if (!otpResponse) {
      //   throw { status: 500, message: "Failed to send OTP" };
      // }

      // const verificationId = otpResponse;
      // this.temporaryUserStore.set(verificationId, { ...userDto, password: hashedPassword });

      // logger.info(`OTP sent to ${userDto.phoneNumber}`);

      return {
        success: true,
        message: "OTP sent. Please verify to complete registration.",
        verificationId: userDto,
      };
    } catch (error) {
      logger.error(`Register service error: ${error.message}`);
      throw error;
    }
  }

  public async completeRegistration(verificationId: string): Promise<any> {
    try {
      const userDetails = this.temporaryUserStore.get(verificationId);
      if (!userDetails) {
        throw { status: 400, message: "Invalid or expired verification ID" };
      }

      const user = new UserModel(userDetails);
      await user.save();
      this.temporaryUserStore.delete(verificationId);

      logger.info(`User ${user._id} registered successfully`);

      return {
        success: true,
        message: "Registration completed successfully",
        data: user,
      };
    } catch (error) {
      logger.error(`Complete registration error: ${error.message}`);
      throw error;
    }
  }
  public async login(credentials: LoginDto, res: Response): Promise<any> {
    try {
      logger.info('Login attempt', { phoneNumber: credentials.phoneNumber });

      const user = await UserModel.findOne({ phoneNumber: credentials.phoneNumber });
      if (!user) {
        throw { status: 401, message: "Invalid credentials" };
      }
      if (!user.status) {
        throw { status: 403, message: "Your account is inactive" };
      }

      const isPasswordValid = await this.comparePassword(credentials.password, user.password);
      if (!isPasswordValid) {
        throw { status: 401, message: "Invalid credentials" };
      }

      // Generate access and refresh tokens
      const accessToken = TokenManager.generateAccessToken(user);
      const refreshToken = TokenManager.generateRefreshToken(user);

      // Save refresh token to the user in the database
      user.refreshToken = refreshToken;
      await user.save();

      const { password, refreshToken: _, ...userData } = user.toObject();

      // Set HTTP-only cookies for tokens
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Only secure in production
        sameSite: 'strict',  // Prevent CSRF
        maxAge: 1000 * 60 * 15 // 15 minutes for access token (adjust as needed)
      });

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        // sameSite: 'strict',  // Prevent CSRF
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days for refresh token (adjust as needed)
      });

      logger.info(`User ${user._id} logged in successfully`);
      return {
        message: "Logged in successfully",
        data: userData,
        accessToken
      };
    } catch (error) {
      logger.error(`Login service error: ${error.message}`);
      throw error;
    }
  }


  public async logout(userId: string, res: Response): Promise<void> {
    try {
      logger.info(`Logging out user ${userId}`);

      // Remove the refresh token from the user in the database
      await UserModel.updateOne({ _id: userId }, { refreshToken: null });

      // Clear the access token and refresh token cookies
      res.clearCookie('accessToken', {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',  // Only secure in production
        sameSite: 'strict'  // Prevent CSRF
      });

      res.clearCookie('refreshToken', {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',  // Only secure in production
        sameSite: 'strict'  // Prevent CSRF
      });

      logger.info(`User ${userId} logged out successfully`);
      res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
      logger.error(`Logout service error: ${error.message}`);
      throw error;
    }
  }

  public async refreshToken(req: Request): Promise<any> {
    console.log('====================================');
    console.log("here we go again");
    console.log('====================================');
    try {
      const { refreshToken } = req.cookies;
      logger.info('Refreshing tokens', { refreshToken });

      if (!refreshToken) {
        throw { status: 401, message: "No refresh token provided" };
      }

      const user = await UserModel.findOne({ refreshToken });
      if (!user) {
        throw { status: 401, message: "Invalid refresh token" };
      }

      const validToken = TokenManager.verifyRefreshToken(refreshToken);

      if (!validToken) {
        throw { status: 401, message: "Invalid refresh token" };
      }

      const newAccessToken = TokenManager.generateAccessToken(user);
      const newRefreshToken = TokenManager.generateRefreshToken(user);

      user.refreshToken = newRefreshToken;
      await user.save();

      logger.info(`Tokens refreshed for user ${user._id}`);

      return {
        message: "Tokens refreshed successfully",
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        userData: user
      };
    } catch (error) {
      logger.error(`Refresh token service error: ${error.message}`);
      throw error;
    }
  }
}

export const authService = new AuthService();
