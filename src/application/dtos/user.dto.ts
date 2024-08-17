/* eslint-disable max-classes-per-file */
// src/application/dtos/user.dto.ts

import {
  IsEmail, IsNotEmpty, IsString, MinLength, IsPhoneNumber, IsEnum,
  IsOptional
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
    @IsPhoneNumber(null)
    phoneNumber: string;

    @IsNotEmpty()
    @IsString()
    nationalIdNumber: string;

    @IsEmail()
    @IsOptional()
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
    phoneNumber: string;

    @IsNotEmpty()
    @MinLength(6)
    password: string;
}
