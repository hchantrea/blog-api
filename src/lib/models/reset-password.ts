import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPassword {
  @ApiProperty()
  @IsNotEmpty({ message: 'code is required' })
  code: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'password is required' })
  password: string;
}
