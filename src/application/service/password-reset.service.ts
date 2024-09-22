import axios from "axios";
import bcrypt from "bcryptjs";
import { authService } from "./auth.service";
import { TokenManager } from "../../infrastructure/utils/token-manager";
import { userService } from "./user.service";
import { logger } from "../../logger";

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
      const token = "YOUR_ACTUAL_TOKEN"; // Replace with your actual token

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
    } catch (err) {
      logger.error("Error verifying registration OTP", { error: err.message });
      return { success: false, message: "Error verifying OTP" };
    }
  }

  async verifyOtp(verificationId: string, receivedOtp: string, phoneNumber: string): Promise<OtpResponse> {
    try {
      const query = verificationId ? `vc=${verificationId}&code=${receivedOtp}` : `to=${phoneNumber}&code=${receivedOtp}`;
      const url = `https://api.afromessage.com/api/verify?${query}`;
      const token = "YOUR_ACTUAL_TOKEN"; // Replace with your actual token

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
    } catch (err) {
      logger.error("Error verifying OTP", { error: err.message });
      return { success: false, message: "Error verifying OTP" };
    }
  }

  async changePassword(token: string, newPassword: string): Promise<OtpResponse> {
    try {
      const decodedToken = TokenManager.verifyAccessToken(token);
      const { phoneNumber } = decodedToken.data;

      const user = await authService.findUser(phoneNumber);
      if (!user) {
        logger.warn(`User with phone number ${phoneNumber} not found`);
        return { success: false, message: "User not found" };
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await userService.updateUser(user._id, { password: hashedPassword });

      logger.info("Password changed successfully for user", { phoneNumber });
      return { success: true, message: "Password changed successfully" };
    } catch (error) {
      logger.error("Error changing password", { error });
      return { success: false, message: "Error changing password" };
    }
  }

  async changePasswordByAdmin(phoneNumber: string, newPassword: string): Promise<OtpResponse> {
    try {
      const user = await authService.findUser(phoneNumber);
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
    const base_url = "https://api.afromessage.com/api/challenge";
    const token = "YOUR_ACTUAL_TOKEN"; // Replace with your actual token
    const identifier = "YOUR_IDENTIFIER"; // Replace with your actual identifier
    const sender = ""; // Replace with your actual sender name

    const url = `${base_url}?from=${identifier}&sender=${sender}&to=${phoneNumber}&ttl=300&len=4&t=0`;

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
