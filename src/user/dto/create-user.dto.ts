import { IsBoolean, IsString } from 'class-validator'; // Importing IsString from class-validator

export class CreateUserDto {
    @IsString()
    email: string; // The email of the user
    @IsString()
    name: string; // The username of the user
    @IsString()
    password: string; // The password of the user
}
