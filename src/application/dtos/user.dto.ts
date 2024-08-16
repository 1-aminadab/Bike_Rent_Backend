/* eslint-disable max-classes-per-file */
// src/application/dtos/user.dto.ts

import {
  IsEmail, IsNotEmpty, IsString, MinLength, IsPhoneNumber, IsEnum
} from 'class-validator';
import { UserRole } from '../../domain/enums/user.enum';

export class UserDto {
    @IsNotEmpty()
    @IsString()
    firstName: string;

    @IsNotEmpty()
    @IsString()
    lastName: string;

    @IsNotEmpty()
    @IsPhoneNumber(null) // Add country code here as per your requirement, e.g., 'US' for the United States
    phoneNumber: string;

    @IsNotEmpty()
    @IsString()
    nationalIdNumber: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @IsEnum(UserRole)
    role: UserRole;
}

export class LoginDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MinLength(6)
    password: string;
}
