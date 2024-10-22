import axios from "axios";
import bcrypt from "bcryptjs";
import { authService } from "./auth.service";
import { TokenManager } from "../../infrastructure/utils/token-manager";
import { userService } from "./user.service";
import { logger } from "../../logger";
import { IUser } from "../../domain/interface/user.interface";
require('dotenv').config();

interface OtpResponse {
  success: boolean;
  message?: string;
  token?: string;
  verificationId?: string;
}

export class PasswordResetService {
  async sendOtp(phoneNumber: string): Promise<any> {
    logger.info("Sending OTP to user...");

    try {
      const otpSent = await this.sendOtpViaSms(phoneNumber);
      if (otpSent && otpSent.response) {
        const { verificationId } = otpSent.response;
        logger.info(`OTP sent successfully: ${verificationId}`);
        return verificationId;
      } else {
        logger.warn("Failed to send OTP");
        return false;
      }
    } catch (error) {
      logger.error("Error in sendOtp", { error });
      return { success: false, message: "Internal server error" };
    }
  }

  async verifyRegistrationOtp(verificationId: string, receivedOtp: string, phoneNumber: string): Promise<OtpResponse> {
    try {
      const query = verificationId ? `vc=${verificationId}&code=${receivedOtp}` : `to=${phoneNumber}&code=${receivedOtp}`;
      const url = `https://api.afromessage.com/api/verify?${query}`;
      const token = process.env.AFRO_TOKEN  // Replace with your actual token

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (result.acknowledge === "success") {
        await authService.completeRegistration(verificationId);
        logger.info("OTP verification and registration successful");
        return { success: true, message: "OTP verification and registration successful" };
      } else {
        logger.warn("Error verifying OTP");
        return { success: false, message: "Error verifying OTP" };
      }
    } catch (err:any) {
      logger.error("Error verifying registration OTP", { error: err.message });
      return { success: false, message: "Error verifying OTP" };
    }
  }

  async verifyOtp(verificationId: string, receivedOtp: string, phoneNumber: string): Promise<OtpResponse> {
    try {
      const query = verificationId ? `vc=${verificationId}&code=${receivedOtp}` : `to=${phoneNumber}&code=${receivedOtp}`;
      const url = `https://api.afromessage.com/api/verify?${query}`;
      const token = process.env.AFRO_TOKEN // Replace with your actual token

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (result.acknowledge === "success") {
        logger.info("OTP verification successful");
        return { success: true, message: "OTP verification successful" };
      } else {
        logger.warn("Error verifying OTP");
        return { success: false, message: "Error verifying OTP" };
      }
    } catch (err:any) {
      logger.error("Error verifying OTP", { error: err.message });
      return { success: false, message: "Error verifying OTP" };
    }
  }

  async changePassword(token: string, currentPassword: string, newPassword: string): Promise<OtpResponse> {
    try {
      // Verify token and extract phone number
      const decodedToken = TokenManager.verifyAccessToken(token);
      const { phoneNumber } = decodedToken.data;
  
      const user = await authService.findUser(phoneNumber);
      if (!user) {
        return { success: false, message: "User not found" };
      }
  
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return { success: false, message: "Current password is incorrect" };
      }
  
      if (currentPassword === newPassword) {
        return { success: false, message: "New password cannot be the same as the current password" };
      }
  
      const hashedPassword = await bcrypt.hash(newPassword, 10);
  
      // Update the user's password in the database
      await userService.updateUser(user._id, { password: hashedPassword });
  
      return { success: true, message: "Password changed successfully" };
    } catch (error) {
      return { success: false, message: "Error changing password" };
    }
  }
  
  async changePasswordByAdmin(
    phoneNumber: string,
    newPassword: string
  ): Promise<OtpResponse> {
    try {
      const user:any = await authService.findUser(phoneNumber);
      if (!user) {
        logger.warn(`User with phone number ${phoneNumber} not found`);
        return { success: false, message: "User not found" };
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await userService.updateUser(user._id, { password: hashedPassword });

      logger.info("Admin changed password successfully for user", { phoneNumber });
      return { success: true, message: "Password changed successfully" };
    } catch (error) {
      logger.error("Error changing password by admin", { error });
      return { success: false, message: "Error changing password" };
    }
  }

  private async sendOtpViaSms(phoneNumber: string): Promise<any> {
    // Configure the Afromessage API parameters
    const base_url = process.env.AFRO_API_KEY;
    const token = process.env.AFRO_TOKEN
      // "eyJhbGciOiJIUzI1NiJ9.eyJpZGVudGlmaWVyIjoiaEYyajlCSkFjZ2UxZ1VsTk56NllPYnlKbWRuR0F4S04iLCJleHAiOjE4ODMyNDI2ODgsImlhdCI6MTcyNTQ3NjI4OCwianRpIjoiMzNmYTJjMWUtODZiOC00NzgxLTkyZjItZjNjMzVlMDgxN2I5In0.6Vdj4nlL81xVd6JlAC4X-a0NO0WaQAiU7vHr0h33BOs	"; // Replace with your actual token
    const identifier = process.env.AFRO_IDENTIFIER; // Replace with your actual identifier
    const sender = ""; // Replace with your actual sender name
    const callback = ""; // Optional: Replace with your actual callback URL
    const messagePrefix = "addis bike verification code is: "; // Optional: Customize the message prefix
    const messagePostfix = "thanks for registering"; // Optional: Customize the message postfix
    const spacesBefore = 0; // Optional: Customize spaces before the OTP
    const spacesAfter = 0; // Optional: Customize spaces after the OTP
    const ttl = 300; // OTP valid for 5 minutes (300 seconds)
    const codeLength = 4; // OTP length
    const codeType = 0; 

    // const url = `${base_url}?from=${identifier}&sender=${sender}&to=${phoneNumber}&ttl=300&len=4&t=0`;
    const url = `${base_url}?from=${identifier}&sender=${sender}&to=${phoneNumber}&pr=${messagePrefix}&ps=${messagePostfix}&sb=${spacesBefore}&sa=${spacesAfter}&ttl=${ttl}&len=${codeLength}&t=${codeType}&callback=${callback}`;


    try {
      const response:any = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.acknowledge === "success") {
        logger.info("OTP sent successfully");
        return response.data;
      } else {
        logger.error("Failed to send OTP", { response: response.data });
        return false;
      }
    } catch (error) {
      logger.error("Error sending OTP via Afromessage", { error });
      throw new Error("Failed to send OTP via Afromessage");
    }
  }

  async forgetPassword(phoneNumber: string): Promise<OtpResponse> {
    const user = await authService.findUser(phoneNumber);
    if (!user) {
      logger.warn(`User with phone number ${phoneNumber} not found`);
      return { success: false, message: "User not found" };
    }

    const otpSent = await this.sendOtpViaSms(phoneNumber);
    if (!otpSent) {
      logger.error("Failed to send OTP");
      return { success: false, message: "Failed to send OTP" };
    }

    const { verificationId } = otpSent.response; // Token to validate OTP
    logger.info("OTP sent to registered phone number", { phoneNumber });

    return {
      success: true,
      message: "OTP sent to the registered phone number",
      verificationId,
    };
  }
}
