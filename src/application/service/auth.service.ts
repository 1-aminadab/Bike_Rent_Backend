import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { UserModel } from '../../infrastructure/models/user.model';
import { IUser, IUserService } from '../../domain/interface/user.interface';
import { LoginDto, UserDto } from '../dtos/user.dto';
import { TokenManager } from '../../infrastructure/utils/token-manager';
import { logger } from '../../logger';

class AuthService implements IUserService {
  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  private async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  public async findUser(phoneNumber: string): Promise<IUser | null> {
    return UserModel.findOne({ phoneNumber });
  }

  public async register(userDto: UserDto): Promise<IUser> {
    const userExist = await this.findUser(userDto.phoneNumber);
    if (userExist) throw new Error('User already exists');

    const hashedPassword = await this.hashPassword(userDto.password);
    const newUser = new UserModel({ ...userDto, password: hashedPassword });
    await newUser.save();
    return newUser;
  }

  public async login(credentials: LoginDto, res: Response): Promise<string> {
    const user = await UserModel.findOne({ phoneNumber: credentials.phoneNumber });
    if (!user) throw new Error('Invalid credentials');

    const isPasswordValid = await this.comparePassword(credentials.password, user.password);
    if (!isPasswordValid) throw new Error('Invalid credentials');

    const accessToken = TokenManager.generateAccessToken(user);
    const refreshToken = TokenManager.generateRefreshToken(user);
    user.refreshToken = refreshToken;
    await user.save();

    this.setCookies(res, accessToken, refreshToken);
    return 'Login successful';
  }

  public async logout(userId: string, res: Response): Promise<void> {
    await UserModel.updateOne({ _id: userId }, { refreshToken: null });
    this.clearCookies(res);
  }

  public async refreshToken(req: Request, res: Response): Promise<void> {
    const { refreshToken } = req.cookies;
    if (!refreshToken) throw new Error('No refresh token provided');

    const user = await UserModel.findOne({ refreshToken });
    if (!user) throw new Error('Invalid refresh token');

    const validToken = TokenManager.verifyRefreshToken(refreshToken);
    if (!validToken) throw new Error('Invalid refresh token');

    const newAccessToken = TokenManager.generateAccessToken(user);
    const newRefreshToken = TokenManager.generateRefreshToken(user);

    user.refreshToken = newRefreshToken;
    await user.save();

    this.setCookies(res, newAccessToken, newRefreshToken);
  }

  private setCookies(res: Response, accessToken: string, refreshToken: string): void {
    res.cookie('accessToken', accessToken, { httpOnly: true, secure: true, sameSite: 'strict' });
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'strict' });
  }

  private clearCookies(res: Response): void {
    res.cookie('accessToken', '', {
      httpOnly: true, secure: true, sameSite: 'strict', expires: new Date(0)
    });
    res.cookie('refreshToken', '', {
      httpOnly: true, secure: true, sameSite: 'strict', expires: new Date(0)
    });
  }
}

export const authService = new AuthService();
