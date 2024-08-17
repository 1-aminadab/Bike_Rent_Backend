// src/controllers/password-reset.controller.ts

import { Request, Response, NextFunction } from 'express';
import { PasswordResetService } from '../service/password-reset.service';
import { logger } from '../../logger';

interface ErrorResponse {
  errors: { msg: string }[];
}

interface SuccessResponse<T> {
  data: T;
}

const passwordResetService = new PasswordResetService();

class PasswordResetController {
  async sendOtp(req: Request, res: Response): Promise<Response<SuccessResponse<any> | ErrorResponse>> {
    try {
      const { phoneNumber } = req.params;
      if (!phoneNumber) {
        return res.status(400).json({ errors: [{ msg: 'Phone number is required' }] });
      }

      const result = await passwordResetService.sendOtp(phoneNumber);
      return res.status(201).json({ data: result });
    } catch (error) {
      logger.error('Error in sendOtp controller', { error });
      return res.status(500).json({ errors: [{ msg: 'Internal server error' }] });
    }
  }

  async verifyOtp(req: Request, res: Response): Promise<Response<SuccessResponse<any> | ErrorResponse>> {
    try {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
      const { receivedOtp } = req.params;
      if (!token || !receivedOtp) {
        return res.status(400).json({ errors: [{ msg: 'Token and OTP are required' }] });
      }

      const result = await passwordResetService.verifyOtp(token, receivedOtp);
      return res.status(200).json({ data: result });
    } catch (error) {
      logger.error('Error in verifyOtp controller', { error });
      return res.status(500).json({ errors: [{ msg: 'Internal server error' }] });
    }
  }

  async changePassword(req: Request, res: Response): Promise<Response<SuccessResponse<any> | ErrorResponse>> {
    try {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
      const { newPassword } = req.params;
      if (!token || !newPassword) {
        return res.status(400).json({ errors: [{ msg: 'Token and new password are required' }] });
      }

      const result = await passwordResetService.changePassword(token, newPassword);
      return res.status(200).json({ data: result });
    } catch (error) {
      logger.error('Error in changePassword controller', { error });
      return res.status(500).json({ errors: [{ msg: 'Internal server error' }] });
    }
  }
}

export const passwordResetController = new PasswordResetController();
