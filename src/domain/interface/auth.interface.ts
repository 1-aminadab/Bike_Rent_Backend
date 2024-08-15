import { Request } from 'express';
import { IUser } from './user.interface';

export interface IAuthService {
    hashPassword(password: string): Promise<string>;
    comparePassword(password: string, hash: string): Promise<boolean>;
    hashPassword(password: string): Promise<string>;
    comparePassword(password: string, hash: string): Promise<boolean>;
    generateAccessToken(user: IUser): string;
    generateRefreshToken(user: IUser): string;
    verifyAccessToken(token: string): any;
    verifyAccessToken(token: string): any;
};

export interface AuthenticatedRequest extends Request {
    user?: Partial<IUser>
 }
