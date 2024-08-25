/* eslint-disable consistent-return */
import { NextFunction, Response } from 'express';
import { AuthenticatedRequest } from '../../domain/interface/auth.interface';
import { TokenManager } from '../utils/token-manager';

export const authenticateJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({ message: 'Access Denied' });
  }
  try {
    const decoded = TokenManager.verifyAccessToken(token);
    req.user = decoded;
    next()
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

export const authorizeRoles = (...roles: string[]) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Access forbidden: Insufficient rights' });
  }
  next();
};
