/* eslint-disable no-return-await */
// application/services/auth.service.ts
import bcrypt from 'bcryptjs';
import { IAuthService } from '../../domain/interface/auth.interface';
import { IUser } from '../../domain/interface/user.interface';
import { TokenManager } from '../../infrastructure/utils/token-manager';

export class AuthService implements IAuthService {
  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  generateAccessToken(user: IUser): string {
    return TokenManager.generateAccessToken(user);
  }

  generateRefreshToken(user: IUser): string {
    return TokenManager.generateRefreshToken(user);
  }

  verifyAccessToken(token: string): any {
    return TokenManager.verifyAccessToken(token);
  }

  verifyRefreshToken(token: string): any {
    return TokenManager.verifyRefreshToken(token);
  }
}
export const authService = new AuthService();
