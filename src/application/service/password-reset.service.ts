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
  verificationId?:string;
}

export class PasswordResetService {
  async sendOtp(phoneNumber: string): Promise<any> {
    console.log("user otp....");

    try {
      // const user = await authService.findUser(phoneNumber);
      // if (!user) {
      //   logger.warn(`User with phone number ${phoneNumber} not found`);
      //   return { success: false, message: 'User not found' };
      // }

      const otpSent = await this.sendOtpViaSms(phoneNumber);
      console.log(otpSent, otpSent.response.verificationId);
      const { verificationId } = otpSent.response;
      console.log(verificationId);

      // get verify id use it for token generation
      if (!otpSent) {
        return false;
      }

      return verificationId;
    } catch (error) {
      logger.error("Error in sendOtp", { error });
      return { success: false, message: "Internal server error" };
    }
  }

  async verifyRegistrationOtp(
    verificationId: string,
    receivedOtp: string,
    phoneNumber: string
  ): Promise<OtpResponse> {
    try {
      // Use the verificationId if provided, otherwise fallback to the phone number
      const query = verificationId
        ? `vc=${verificationId}&code=${receivedOtp}`
        : `to=${phoneNumber}&code=${receivedOtp}`;
      const url = `https://api.afromessage.com/api/verify?${query}`;
      const token =
        "eyJhbGciOiJIUzI1NiJ9.eyJpZGVudGlmaWVyIjoiaEYyajlCSkFjZ2UxZ1VsTk56NllPYnlKbWRuR0F4S04iLCJleHAiOjE4ODMyNDI2ODgsImlhdCI6MTcyNTQ3NjI4OCwianRpIjoiMzNmYTJjMWUtODZiOC00NzgxLTkyZjItZjNjMzVlMDgxN2I5In0.6Vdj4nlL81xVd6JlAC4X-a0NO0WaQAiU7vHr0h33BOs	"; // Replace with your actual token

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // Replace with your API token
        },
      });
      console.log(response, "verify otp resp.....");

      const result = await response.json();

      if (result.acknowledge === "success") {
        // If OTP is verified, complete registration
        await authService.completeRegistration(verificationId);

        return { success: true, message: "OTP verification and registration successful" };


        // return { success: true, message: "OTP verification successful" };
      } else {
        return { success: false, message: "Error verifying OTP" };
      }
    } catch (err) {
      throw new Error("Error verifying OTP: " + err.message);
    }
  }
  async verifyOtp(
    verificationId: string,
    receivedOtp: string,
    phoneNumber: string
  ): Promise<OtpResponse> {
    try {
      // Use the verificationId if provided, otherwise fallback to the phone number
      const query = verificationId
        ? `vc=${verificationId}&code=${receivedOtp}`
        : `to=${phoneNumber}&code=${receivedOtp}`;
      const url = `https://api.afromessage.com/api/verify?${query}`;
      const token =
        "eyJhbGciOiJIUzI1NiJ9.eyJpZGVudGlmaWVyIjoiaEYyajlCSkFjZ2UxZ1VsTk56NllPYnlKbWRuR0F4S04iLCJleHAiOjE4ODMyNDI2ODgsImlhdCI6MTcyNTQ3NjI4OCwianRpIjoiMzNmYTJjMWUtODZiOC00NzgxLTkyZjItZjNjMzVlMDgxN2I5In0.6Vdj4nlL81xVd6JlAC4X-a0NO0WaQAiU7vHr0h33BOs	"; // Replace with your actual token

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // Replace with your API token
        },
      });
      console.log(response, "verify otp resp.....");

      const result = await response.json();

      if (result.acknowledge === "success") {
        // If OTP is verified, complete registration
        // await authService.completeRegistration(verificationId);

        return { success: true, message: "OTP verification  successful" };


        // return { success: true, message: "OTP verification successful" };
      } else {
        return { success: false, message: "Error verifying OTP" };
      }
    } catch (err) {
      throw new Error("Error verifying OTP: " + err.message);
    }
  }

  async changePassword(
    token: string,
    newPassword: string
  ): Promise<OtpResponse> {
    try {
      const decodedToken = TokenManager.verifyAccessToken(token);
      console.log(decodedToken.data);
      
      const { phoneNumber } = decodedToken.data;

      const user = await authService.findUser(phoneNumber);
      console.log(user,'in change pass service ............')
      if (!user) {
        logger.warn(`User with phone number ${phoneNumber} not found`);
        return { success: false, message: "User not found" };
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await userService.updateUser(user._id, { password: hashedPassword });

      return { success: true, message: "Password changed successfully" };
    } catch (error) {
      logger.error("Error changing password", { error });
      return { success: false, message: "Error changing password" };
    }
  }
  async changePasswordByAdmin(
    phoneNumber: string,
    newPassword: string
  ): Promise<OtpResponse> {
    try {
      // const decodedToken = TokenManager.verifyAccessToken(token);
      // const { phoneNumber } = decodedToken;

      const user = await authService.findUser(phoneNumber);
      if (!user) {
        logger.warn(`User with phone number ${phoneNumber} not found`);
        return { success: false, message: "User not found" };
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await userService.updateUser(user._id, { password: hashedPassword });

      return { success: true, message: "Password changed successfully" };
    } catch (error) {
      logger.error("Error changing password", { error });
      return { success: false, message: "Error changing password" };
    }
  }

  private async sendOtpViaSms(phoneNumber: string): Promise<any> {
    // Configure the Afromessage API parameters
    const base_url = "https://api.afromessage.com/api/challenge";
    const token =
      "eyJhbGciOiJIUzI1NiJ9.eyJpZGVudGlmaWVyIjoiaEYyajlCSkFjZ2UxZ1VsTk56NllPYnlKbWRuR0F4S04iLCJleHAiOjE4ODMyNDI2ODgsImlhdCI6MTcyNTQ3NjI4OCwianRpIjoiMzNmYTJjMWUtODZiOC00NzgxLTkyZjItZjNjMzVlMDgxN2I5In0.6Vdj4nlL81xVd6JlAC4X-a0NO0WaQAiU7vHr0h33BOs	"; // Replace with your actual token
    const identifier = "e80ad9d8-adf3-463f-80f4-7c4b39f7f164"; // Replace with your actual identifier
    const sender = ""; // Replace with your actual sender name
    const callback = ""; // Optional: Replace with your actual callback URL
    const messagePrefix = "addis bike verification code is: "; // Optional: Customize the message prefix
    const messagePostfix = "thanks for registering"; // Optional: Customize the message postfix
    const spacesBefore = 0; // Optional: Customize spaces before the OTP
    const spacesAfter = 0; // Optional: Customize spaces after the OTP
    const ttl = 300; // OTP valid for 5 minutes (300 seconds)
    const codeLength = 4; // OTP length
    const codeType = 0; // 0 for numeric OTP, change if needed

    // Construct the full URL with query parameters
    const url = `${base_url}?from=${identifier}&sender=${sender}&to=${phoneNumber}&pr=${messagePrefix}&ps=${messagePostfix}&sb=${spacesBefore}&sa=${spacesAfter}&ttl=${ttl}&len=${codeLength}&t=${codeType}&callback=${callback}`;

    try {
      // Make the request to Afromessage API
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response, "........./");

      // Check the response and return success or failure
      if (response.data.acknowledge === "success") {
        console.log("OTP sent successfully");

        return response.data;
      } else {
        console.error("Failed to send OTP:", response.data);
        return false;
      }
    } catch (error) {
      console.error("Error sending OTP via Afromessage:", error.message);
      throw new Error("Failed to send OTP via Afromessage");
    }
  }

  async forgetPassword(phoneNumber: string): Promise<OtpResponse> {
    const user = await authService.findUser(phoneNumber);
    if (!user) {
      return { success: false, message: "User not found" };
    }

    const otpSent = await this.sendOtpViaSms(phoneNumber);
    if (!otpSent) {
      return { success: false, message: "Failed to send OTP" };
    }
    const {verificationId} = otpSent.response;  // Token to validate OTP

    return {
      success: true,
      message: "OTP sent to the registered phone number",
      verificationId: verificationId,
    };
  }

  

}
