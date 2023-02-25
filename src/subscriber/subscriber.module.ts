import { Subscriber } from './../lib/entitys/subscriber.entity';
import { CategoryModule } from './../category/category.module';
import { UserModule } from './../user/user.module';
import { JwtStrategy } from './../lib/strategies/jwt.strategy';
import { Module } from '@nestjs/common';
import { SubscriberService } from './subscriber.service';
import { SubscriberController } from './subscriber.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Subscriber]),
    UserModule,
    CategoryModule
  ],
  controllers: [SubscriberController],
  providers: [
    SubscriberService,
    JwtStrategy
  ]
})
export class SubscriberModule {}
