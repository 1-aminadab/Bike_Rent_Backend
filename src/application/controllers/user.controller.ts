import { Request, Response, NextFunction } from 'express';
import { userService } from '../service/user.service';
import { logger } from '../../logger';

class UserController {
  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const user = await userService.getUserById(req.params.id);
      if (!user) {
        res.status(404).json({ message: 'User not found' });
      } else {
        res.status(200).json(user);
      }
    } catch (error) {
      logger.error('Error in getUserById controller', { error });
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const user = await userService.updateUser(req.params.id, req.body);
      if (!user) {
        res.status(404).json({ message: 'User not found' });
      } else {
        res.status(200).json(user);
      }
    } catch (error) {
      logger.error('Error in updateUser controller', { error });
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const user = await userService.deleteUser(req.params.id);
      if (!user) {
        res.status(404).json({ message: 'User not found' });
      } else {
        res.status(200).json({ message: 'User deleted successfully' });
      }
    } catch (error) {
      logger.error('Error in deleteUser controller', { error });
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await userService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      logger.error('Error in getAllUsers controller', { error });
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

export const userController = new UserController();
