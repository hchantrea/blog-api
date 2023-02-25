import { CategoryModule } from './../category/category.module';
import { JwtStrategy } from './../lib/strategies/jwt.strategy';
import { UserModule } from './../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { Post } from './../lib/entitys/post.entity';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), UserModule, CategoryModule],
  controllers: [PostController],
  providers: [PostService, JwtStrategy],
})
export class PostModule {}
