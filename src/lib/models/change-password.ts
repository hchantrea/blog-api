import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePassword {
  @ApiProperty()
  @IsNotEmpty({ message: 'Current password is required' })
  currentPassword: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'New password is required' })
  newPassword: string;
}
