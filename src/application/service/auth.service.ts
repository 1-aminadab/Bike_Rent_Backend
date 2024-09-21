import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import UserModel from "../../infrastructure/models/user.model";
import { IUser, IUserService } from "../../domain/interface/user.interface";
import { LoginDto, UserDto } from "../dtos/user.dto";
import { TokenManager } from "../../infrastructure/utils/token-manager";
import { logger } from "../../logger";
import {
  validateEmail,
  validatePassword,
  validatePhoneNumber,
} from "../../infrastructure/utils/validator";
import { PasswordResetService } from "./password-reset.service";

const otpService = new PasswordResetService();

class AuthService implements IUserService {
  private temporaryUserStore: Map<string, any> = new Map();

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  private async comparePassword(
    password: string,
    hash: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  public async findUser(phoneNumber: string): Promise<IUser | null> {
    return UserModel.findOne({ phoneNumber });
  }

  public async register(userDto: UserDto): Promise<any> {
    if (userDto.email && !validateEmail(userDto.email)) {
      throw new Error("Invalid email format!");
    }
    if (!validatePhoneNumber(userDto.phoneNumber)) {
      throw new Error("Invalid phone number format");
    }
    if (!validatePassword(userDto.password)) {
      throw new Error("Password does not meet security requirements");
    }
  
    const existingUser = await this.findUser(userDto.phoneNumber);
    if (existingUser) throw new Error("User already exists");
  
    const hashedPassword = await this.hashPassword(userDto.password);
  
    // Send OTP
    const otpResponse = await otpService.sendOtp(userDto.phoneNumber);
    console.log(otpResponse);
    
    if (!otpResponse) {
      throw new Error(otpResponse.message);
    }
  
    // Store user data temporarily
    // const verificationId = otpResponse.verificationId;
    const verificationId = otpResponse;  // Token to validate OTP
    this.temporaryUserStore.set(verificationId, {
      ...userDto,
      password: hashedPassword,
    });

    // Store user data in temporary storage or a session
    return {
      success: true,
      message: "OTP sent. Please verify to complete registration.",
      verificationId: verificationId,
      // userDetails: {
      //   ...userDto,
      //   password: hashedPassword,
      // },
    };
  }

  public async completeRegistration(verificationId: string): Promise<any> {
    const userDetails = this.temporaryUserStore.get(verificationId);
    if (!userDetails) {
      throw new Error("Invalid or expired verification ID");
    }

    const user = new UserModel(userDetails);
    await user.save();

    // Remove the temporary data after successful registration
    this.temporaryUserStore.delete(verificationId);

    return {
      success: true,
      message: "Registration completed successfully",
      data: user,
    };
  }

  public async login(credentials: LoginDto, res: Response): Promise<any> {
    const user = await UserModel.findOne({
      phoneNumber: credentials.phoneNumber,
    });
    if (!user) throw new Error("Invalid credentials");
    if (!user.status) throw new Error("your account is inactive");
    const isPasswordValid = await this.comparePassword(
      credentials.password,
      user.password
    );
    if (!isPasswordValid) throw new Error("Invalid credentials");

    const accessToken = TokenManager.generateAccessToken(user);
    const refreshToken = TokenManager.generateRefreshToken(user);
    user.refreshToken = refreshToken;
    await user.save();

    const { password, refreshToken: _, ...userData } = user.toObject();
    this.setCookies(res, accessToken, refreshToken);
    return {
      message: "loged in successfully",
      data: userData,
    };
  }

  public async logout(userId: string, res: Response): Promise<void> {
    await UserModel.updateOne({ _id: userId }, { refreshToken: null });
    this.clearCookies(res);
  }

  public async refreshToken(req: Request, res: Response): Promise<void> {
    const { refreshToken } = req.cookies;
    if (!refreshToken) throw new Error("No refresh token provided");

    const user = await UserModel.findOne({ refreshToken });
    if (!user) throw new Error("Invalid refresh token");

    const validToken = TokenManager.verifyRefreshToken(refreshToken);
    if (!validToken) throw new Error("Invalid refresh token");

    const newAccessToken = TokenManager.generateAccessToken(user);
    const newRefreshToken = TokenManager.generateRefreshToken(user);

    user.refreshToken = newRefreshToken;
    await user.save();

    this.setCookies(res, newAccessToken, newRefreshToken);
  }

  private setCookies(
    res: Response,
    accessToken: string,
    refreshToken: string
  ): void {
    console.log("setting cookie");

    res.cookie("accessToken", accessToken, { httpOnly: true, secure: false });
    res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: false });
  }

  private clearCookies(res: Response): void {
    res.cookie("accessToken", "", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      expires: new Date(0),
    });
    res.cookie("refreshToken", "", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      expires: new Date(0),
    });
  }
}

export const authService = new AuthService();
