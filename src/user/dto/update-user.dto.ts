import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsBoolean, IsNumber } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsBoolean()
    isVerified: boolean; // Indicates if the user is verified
}
