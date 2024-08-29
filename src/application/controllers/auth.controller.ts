// application/controllers/auth.controller.ts
import { Request, Response } from 'express';
import { authService } from '../service/auth.service';
import { AuthenticatedRequest } from '../../domain/interface/auth.interface';

class AuthController {
  async register(req: Request, res: Response) {
    console.log(req.body,'in controler....');
    try {
      const user = await authService.register(req.body);
      return res.status(201).json(user);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  };

  async login(req: Request, res: Response) {
    try {
      const message = await authService.login(req.body, res);
      return res.status(200).json({ message });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  };

  async logout(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user._id;
      await authService.logout(userId, res);
      return res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  };

  async refreshTokens(req: Request, res: Response) {
    try {
      await authService.refreshToken(req, res);
      return res.status(200).json({ message: 'Tokens refreshed' });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
}

export const authController = new AuthController();
