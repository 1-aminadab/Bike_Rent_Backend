// src/controllers/password-reset.controller.ts

import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { PasswordResetService } from '../service/password-reset.service';
import { logger } from '../../logger';

const passwordResetService = new PasswordResetService()
class PasswordResetController {
  async sendOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { phoneNumber } = req.body;
      const result = await passwordResetService.sendOtp(phoneNumber);
      res.status(201).json(result);
    } catch (error) {
      logger.error('Error in sendOtp controller', { error });
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async verifyOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { token, receivedOtp } = req.body;
      const result = await passwordResetService.verifyOtp(token, receivedOtp);
      res.status(200).json(result);
    } catch (error) {
      logger.error('Error in verifyOtp controller', { error });
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { token, newPassword } = req.body;
      const result = await passwordResetService.changePassword(token, newPassword);
      res.status(200).json(result);
    } catch (error) {
      logger.error('Error in changePassword controller', { error });
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

export const passwordResetController = new PasswordResetController();
