import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CategoryCreate {
  @ApiProperty()
  @IsNotEmpty({ message: 'name is required' })
  name: string;
}

export class CategoryUpdate {
  @ApiProperty()
  name?: string;

  @ApiProperty()
  status?: boolean;
}
