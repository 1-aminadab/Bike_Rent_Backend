import { Request, Response } from 'express';
import { authService } from '../service/auth.service';
import { AuthenticatedRequest } from '../../domain/interface/auth.interface';
import { logger } from '../../logger';

class AuthController {
  async register(req: Request, res: Response) {
    logger.info('Register request received', { body: req.body });
    try {
      const user = await authService.register(req.body);
      logger.info('User registered successfully');
      res.status(200).json(user);
    } catch (error) {
      logger.error(`Register failed: ${error.message}`);
      res.status(error.status || 500).json({ message: error.message });
    }
  }

  async login(req: Request, res: Response) {
    logger.info('Login request received', { body: req.body });
    try {
      const data = await authService.login(req.body, res);
      logger.info('User logged in successfully');
      res.status(200).json(data);
    } catch (error) {
      logger.error(`Login failed: ${error.message}`);
      res.status(error.status || 500).json({ message: error.message });
    }
  }

  async logout(req: AuthenticatedRequest, res: Response) {
    logger.info('Logout request received', { userId: req.user._id });
    try {
      const userId = req.user._id;
      await authService.logout(userId, res);
      logger.info('User logged out successfully', { userId });
      res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
      logger.error(`Logout failed: ${error.message}`);
      res.status(error.status || 500).json({ message: error.message });
    }
  }

  async refreshTokens(req: Request, res: Response) {
    logger.info('Refresh tokens request received');
    try {
      const result = await authService.refreshToken(req);
      logger.info('Tokens refreshed successfully');
      return res.status(200).json(result);
    } catch (error) {
      logger.error(`Token refresh failed: ${error.message}`);
      return res.status(error.status || 500).json({ message: error.message });
    }
  }
}

export const authController = new AuthController();
