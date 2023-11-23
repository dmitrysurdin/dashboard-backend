import { IsEmail, IsString } from 'class-validator';

export class UserLoginDto {
	@IsEmail({}, { message: 'Email is wrong' })
	email: string;
	@IsString({ message: 'Password is wrong' })
	password: string;
}
