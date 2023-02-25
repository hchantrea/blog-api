import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EmailConfirm {
  @ApiProperty()
  @IsNotEmpty({ message: 'email is required' })
  email: string;
}
