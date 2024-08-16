// application/controllers/auth.controller.ts
import { Request, Response } from 'express';
import { AuthService } from '../service/auth.service';
import { AuthenticatedRequest } from '../../domain/interface/auth.interface';

const authService = new AuthService();

export const register = async (req: Request, res: Response) => {
  try {
    const user = await authService.register(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const message = await authService.login(req.body, res);
    res.status(200).json({ message });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const logout = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user._id; // Assuming `req.user` is populated by middleware
    await authService.logout(userId, res);
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const refreshTokens = async (req: Request, res: Response) => {
  try {
    await authService.refreshToken(req, res);
    res.status(200).json({ message: 'Tokens refreshed' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
