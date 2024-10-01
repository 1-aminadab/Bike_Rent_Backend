import jwt from 'jsonwebtoken';
import { IUser } from '../../domain/interface/user.interface';

export class TokenManager {
    private static accessTokenSecret = process.env.JWT_ACCESS_SECRET || 'accessSecret';

    private static refreshTokenSecret = process.env.JWT_REFRESH_SECRET || 'refreshSecret';

    static generateAccessToken<T>(data: T, expiredIn?:string): string {
      return jwt.sign({ data }, this.accessTokenSecret, { expiresIn: expiredIn || '15m' });
    }

    static generateRefreshToken(user: IUser): string {
      return jwt.sign({ userId: user._id, role: user.role }, this.refreshTokenSecret, { expiresIn: '5d' });
    }

    static verifyAccessToken(token: string): any {
      return jwt.verify(token, this.accessTokenSecret);
    }

    static verifyRefreshToken(token: string): any {
      return jwt.verify(token, this.refreshTokenSecret);
    }
}
