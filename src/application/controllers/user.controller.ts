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
    console.log();
    
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
      
      // Remove password and refreshToken fields from each user object
      const sanitizedUsers = users.map(user => {
        const { password, refreshToken, ...userWithoutSensitiveInfo } = user.toObject();
        return userWithoutSensitiveInfo;
      });
  
      res.status(200).json(sanitizedUsers);
    } catch (error) {
      logger.error('Error in getAllUsers controller', { error });
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getSubAdmins(req: Request, res: Response): Promise<void> {
    try {
      const subAdmins = await userService.getSubAdmins();
      res.status(200).json(subAdmins);
    } catch (error) {
      logger.error('Error in getSubAdmins controller', { error });
      res.status(500).json({ message: 'Internal server error' });
    }
 
  }

  async getAdmins(req: Request, res: Response): Promise<void> {
    try {
      const admins = await userService.getAdmins();
      res.status(200).json(admins);
    } catch (error) {
      logger.error('Error in getAdmins controller', { error });
      res.status(500).json({ message: 'Internal server error' });
    }
  }

   // Update SubAdmin
   async updateSubAdmin(req: Request, res: Response): Promise<void> {
    try {
      const subAdmin = await userService.updateSubAdmin(req.params.id, req.body);
      if (!subAdmin) {
        res.status(404).json({ message: 'Sub-admin not found' });
      } else {
        res.status(200).json(subAdmin);
      }
    } catch (error) {
      logger.error('Error in updateSubAdmin controller', { error });
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Update Admin
  async updateAdmin(req: Request, res: Response): Promise<void> {
    try {
      const admin = await userService.updateAdmin(req.params.id, req.body);
      if (!admin) {
        res.status(404).json({ message: 'Admin not found' });
      } else {
        res.status(200).json(admin);
      }
    } catch (error) {
      logger.error('Error in updateAdmin controller', { error });
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Delete SubAdmin
  async deleteSubAdmin(req: Request, res: Response): Promise<void> {
    try {
      const subAdmin = await userService.deleteSubAdmin(req.params.id);
      if (!subAdmin) {
        res.status(404).json({ message: 'Sub-admin not found' });
      } else {
        res.status(200).json({ message: 'Sub-admin deleted successfully' });
      }
    } catch (error) {
      logger.error('Error in deleteSubAdmin controller', { error });
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Delete Admin
  async deleteAdmin(req: Request, res: Response): Promise<void> {
    try {
      const admin = await userService.deleteAdmin(req.params.id);
      if (!admin) {
        res.status(404).json({ message: 'Admin not found' });
      } else {
        res.status(200).json({ message: 'Admin deleted successfully' });
      }
    } catch (error) {
      logger.error('Error in deleteAdmin controller', { error });
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

export const userController = new UserController();
