import { IsEmail, IsNotEmpty } from 'class-validator';
import { Role } from '../enum/role.enum';
import { ApiProperty } from '@nestjs/swagger';

export class UserCreate {
  @ApiProperty()
  @IsNotEmpty({ message: 'firstName is required' })
  firstName: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'lastName is required' })
  lastName: string;

  @ApiProperty()
  @IsEmail({}, { message: 'email incorrect' })
  @IsNotEmpty({ message: 'email is required' })
  email: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'password is required' })
  password: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'roles is required' })
  roles: Role[];

  @ApiProperty()
  profile?: string;
}
