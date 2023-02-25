import { MailModule } from './../mail/mail.module';
import { JwtStrategy } from './../lib/strategies/jwt.strategy';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../lib/entitys/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), 
    MailModule
  ],
  controllers: [UserController],
  providers: [
    UserService, 
    JwtStrategy
  ],
  exports: [UserService]
})
export class UserModule {}
