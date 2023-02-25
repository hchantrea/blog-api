import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserLogin {
  @ApiProperty()
  @IsNotEmpty({ message: 'username is required' })
  username: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'password is required' })
  password: string;
}
