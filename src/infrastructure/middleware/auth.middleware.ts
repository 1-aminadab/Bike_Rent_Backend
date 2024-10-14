/* eslint-disable consistent-return */
import { NextFunction, Request, Response } from 'express';
import { AuthenticatedRequest } from '../../domain/interface/auth.interface';
import { TokenManager } from '../utils/token-manager';

export const authenticateJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token =  req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access Denied' });
  }
  try {
    const decoded = TokenManager.verifyAccessToken(token);
    console.log(decoded.data,'decoded.........auth,');
    req.user = decoded.data;
    
    next()
  } catch (error) {
    console.log(error);
    
    return res.status(403).json({ message: 'Invalid token' });
  }
};

export const authorizeRoles = (...roles: string[]) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  // const {data} = req.user
  
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Access forbidden: Insufficient rights' });
  }
  next();
}