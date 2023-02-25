import { RolesGuard } from './lib/guards/roles.guard';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { CategoryModule } from './category/category.module';
import { PostModule } from './post/post.module';
import { MulterModule } from '@nestjs/platform-express';
import { FileUploadModule } from './file-upload/file-upload.module';
import { SubscriberModule } from './subscriber/subscriber.module';
import { MailModule } from './mail/mail.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ScheduleTriggerModule } from './schedule-trigger/schedule.module';

@Module({
  imports: [
    MailModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.TYPEORM_HOST,
      username: process.env.TYPEORM_USERNAME,
      password: process.env.TYPEORM_PASSWORD,
      database: process.env.TYPEORM_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
    }),
    ScheduleModule.forRoot(),
    MulterModule.register({ dest: './files' }),
    UserModule,
    AuthModule,
    CategoryModule,
    PostModule,
    FileUploadModule,
    SubscriberModule,
    ScheduleTriggerModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    }
  ],
})
export class AppModule {}
