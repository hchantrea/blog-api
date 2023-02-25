import { JwtStrategy } from './../lib/strategies/jwt.strategy';
import { UserModule } from './../user/user.module';
import { Module } from '@nestjs/common';
import { FileUploadController } from './file-upload.controller';

@Module({
  imports: [
    UserModule
  ],
  controllers: [FileUploadController],
  providers: [
    JwtStrategy
  ]
})
export class FileUploadModule {}
