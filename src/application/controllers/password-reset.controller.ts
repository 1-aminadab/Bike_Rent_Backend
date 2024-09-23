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

  async verifyRegistrationOtp(req: Request, res: Response): Promise<Response<SuccessResponse<any> | ErrorResponse>> {
    try {
      // const authHeader = req.headers['authorization'];
      // const token = authHeader && authHeader.split(' ')[1];
      const {phoneNumber,verificationId}= req.body
      const { receivedOtp } = req.params;
      console.log(phoneNumber,verificationId,receivedOtp)
      // if (!token || !receivedOtp) {
      //   return res.status(400).json({ errors: [{ msg: 'Token and OTP are required' }] });
      // }

      const result = await passwordResetService.verifyRegistrationOtp(verificationId, receivedOtp,phoneNumber);
      return res.status(200).json({ data: result });
    } catch (error) {
      logger.error('Error in verifyOtp controller', { error });
      return res.status(500).json({ errors: [{ msg: 'Internal server error' }] });
    }
  }
  async verifyOtp(req: Request, res: Response): Promise<Response<SuccessResponse<any> | ErrorResponse>> {
    try {
      // const authHeader = req.headers['authorization'];
      // const token = authHeader && authHeader.split(' ')[1];
      const {phoneNumber,verificationId}= req.body
      const { receivedOtp } = req.params;
      console.log(phoneNumber,verificationId,receivedOtp)
      // if (!token || !receivedOtp) {
      //   return res.status(400).json({ errors: [{ msg: 'Token and OTP are required' }] });
      // }

      const result = await passwordResetService.verifyOtp(verificationId, receivedOtp,phoneNumber);
      return res.status(200).json({ data: result });
    } catch (error) {
      logger.error('Error in verifyOtp controller', { error });
      return res.status(500).json({ errors: [{ msg: 'Internal server error' }] });
    }
  }

  async changePassword(req: Request, res: Response): Promise<Response<SuccessResponse<any> | ErrorResponse>> {
    try {
      const authHeader = req.headers['authorization'];
      console.log(authHeader,'auth h')
      const token = authHeader && authHeader.split(' ')[1];
      console.log(token,'toke')
      const { newPassword , currentPassword} = req.body;
      if (!token || !newPassword) {
        return res.status(400).json({ errors: [{ msg: 'Token and new password are required' }] });
      }

      const result = await passwordResetService.changePassword(token,currentPassword, newPassword);
      return res.status(200).json({ data: result });
    } catch (error) {
      logger.error('Error in changePassword controller', { error });
      return res.status(500).json({ errors: [{ msg: 'Internal server error' }] });
    }
  }

  async changePasswordByAdmin(req: Request, res: Response): Promise<Response<SuccessResponse<any> | ErrorResponse>> {
    try {

      // const authHeader = req.headers['authorization'];
      // const token = authHeader && authHeader.split(' ')[1];
      // const {phoneNumber } = req.params;
      const { newPassword,phoneNumber } = req.body;
      if ( !newPassword) {
        return res.status(400).json({ errors: [{ msg: ' new password are required' }] });
      }

      const result = await passwordResetService.changePasswordByAdmin(phoneNumber, newPassword);
      return res.status(200).json({ data: result });
    } catch (error) {
      logger.error('Error in changePassword controller', { error });
      return res.status(500).json({ errors: [{ msg: 'Internal server error' }] });
    }
  }

  async forgetPassword(req:Request, res:Response):Promise<any>{
    try {
      const {phoneNumber}= req.body;
      console.log(phoneNumber);
      
      if(!phoneNumber){
        return res.status(400).json({ errors: [{ msg: 'phone number is required' }] });
      }
     const result = await passwordResetService.forgetPassword(phoneNumber)
      return res.status(200).json({data:result})
      
    } catch (error) {
      logger.error('Error in forget password controller', { error });
      return res.status(500).json({ errors: [{ msg: 'Internal server error' }] });

    }

  }

}

export const passwordResetController = new PasswordResetController();
