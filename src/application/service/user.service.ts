import { Request, Response } from 'express';
import { UserModel } from '../../infrastructure/models/user.model';
import { IUser, IUserService } from '../../domain/interface/user.interface';
import { LoginDto, UserDto } from '../dtos/user.dto';
import { authService } from './auth.service';

export class UserService implements IUserService {
  async register(userDto: UserDto): Promise<IUser> {
    const hashedPassword = await authService.hashPassword(userDto.password);
    const newUser = new UserModel({ ...userDto, password: hashedPassword });
    await newUser.save();
    return newUser;
  }

  async login(credentials: LoginDto, res: Response): Promise<string> {
    const user = await UserModel.findOne({ email: credentials.email });
    if (!user) throw new Error('Invalid credentials');

    const isPasswordValid = await authService.comparePassword(credentials.password, user.password);
    if (!isPasswordValid) throw new Error('Invalid credentials');

    const accessToken = authService.generateAccessToken(user);
    const refreshToken = authService.generateRefreshToken(user);
    user.refreshToken = refreshToken;
    await user.save();

    res.cookie('accessToken', accessToken, { httpOnly: true, secure: true, sameSite: 'strict' });
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'strict' });

    return 'Login successful';
  }

  async logout(userId: string, res: Response): Promise<void> {
    await UserModel.updateOne({ _id: userId }, { refreshToken: null });

    res.cookie('accessToken', '', {
      httpOnly: true, secure: true, sameSite: 'strict', expires: new Date(0)
    });
    res.cookie('refreshToken', '', {
      httpOnly: true, secure: true, sameSite: 'strict', expires: new Date(0)
    });
  }

  async refreshToken(req: Request, res:Response): Promise<void> {
    const { refreshToken } = req.cookies;
    if (!refreshToken) throw new Error('No refresh token provided');

    const user = await UserModel.findOne({ refreshToken });
    if (!user) throw new Error('Invalid refresh token');

    const validToken = authService.verifyRefreshToken(refreshToken);
    if (!validToken) throw new Error('Invalid refresh token');

    const newAccessToken = authService.generateAccessToken(user);
    const newRefreshToken = authService.generateRefreshToken(user);

    user.refreshToken = newRefreshToken;
    await user.save();

    res.cookie('accessToken', newAccessToken, { httpOnly: true, secure: true, sameSite: 'strict' });
    res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'strict' });
  }
}
