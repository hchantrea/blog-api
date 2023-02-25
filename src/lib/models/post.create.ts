import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PostCreate {
  @ApiProperty()
  @IsNotEmpty({ message: 'title is required' })
  title: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'description is required' })
  description: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'category id is required' })
  categoryId: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'author id is required' })
  authorName: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'content is required' })
  content: string;

  @ApiProperty()
  thumbnail: string;

  @ApiProperty()
  status?: boolean;
}

export class PostUpdate {
  @ApiProperty()
  title?: string;

  @ApiProperty()
  description?: string;

  @ApiProperty()
  categoryId?: number;

  @ApiProperty()
  authorName?: string;

  @ApiProperty()
  content?: string;

  @ApiProperty()
  thumbnail?: string;

  @ApiProperty()
  status?: boolean;
}
