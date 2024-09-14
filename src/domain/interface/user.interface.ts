import { Document } from 'mongoose';
import { Request, Response } from 'express';
import { LoginDto, UserDto } from '../../application/dtos/user.dto';
import { UserRole } from '../enums/user.enum';

export interface IUser extends Document {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    nationalIdNumber: string;
    password: string;
    verified: boolean;
    role: UserRole;
    refreshToken: string;
    address: string;
    age: number;
    gender: string;
    status:boolean | string;
    email:string;
}

export interface IUserService {
    register(userDto: UserDto): Promise<IUser>;
    login(credentials: LoginDto, res:Response): Promise<string>;
    logout(userId: string, res:Response):void;
    refreshToken(req: Request, res:Response): Promise<void>;
}
