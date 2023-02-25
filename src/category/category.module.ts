import { UserModule } from './../user/user.module';
import { JwtStrategy } from './../lib/strategies/jwt.strategy';
import { Category } from './../lib/entitys/category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Category]), UserModule],
  providers: [CategoryService, JwtStrategy],
  controllers: [CategoryController],
  exports: [CategoryService],
})
export class CategoryModule {}
