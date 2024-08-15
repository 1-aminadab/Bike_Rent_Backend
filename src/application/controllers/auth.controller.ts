// application/controllers/auth.controller.ts
import { Request, Response } from 'express';
import { UserService } from '../service/user.service';
import { AuthenticatedRequest } from '../../domain/interface/auth.interface';

const userService = new UserService();

export const register = async (req: Request, res: Response) => {
  try {
    const user = await userService.register(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const message = await userService.login(req.body, res);
    res.status(200).json({ message });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const logout = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user._id; // Assuming `req.user` is populated by middleware
    await userService.logout(userId, res);
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const refreshTokens = async (req: Request, res: Response) => {
  try {
    await userService.refreshToken(req, res);
    res.status(200).json({ message: 'Tokens refreshed' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
