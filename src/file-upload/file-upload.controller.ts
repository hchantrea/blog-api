import { FileView } from './../lib/views/file.view';
import { extname, join } from 'path';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { RolesGuard } from './../lib/guards/roles.guard';
import { JwtAuthGuard } from './../lib/guards/jwt.auth.guard';
import { Role } from './../lib/enum/role.enum';
import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  HttpException,
  HttpStatus,
  UploadedFile,
  Get,
  Param,
  Res,
} from '@nestjs/common';
import { Roles } from './../lib/decorator/roles.decorator';
import { Observable, of } from 'rxjs';
import { ApiTags, ApiBearerAuth, ApiParam } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Upload File')
@Controller('uploads')
export class FileUploadController {
  @Roles(Role.Admin, Role.Editor)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './files',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const extention = extname(file.originalname);
          const filename = `${uniqueSuffix}${extention}`;
          if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return callback(
              new HttpException('File not allow', HttpStatus.BAD_REQUEST),
              filename,
            );
          }
          callback(null, filename);
        },
      }),
      limits: { fileSize: 25000000 },
    }),
  )
  fileUpload(@UploadedFile() file: Express.Multer.File) {
    return new FileView(file.destination, file.filename);
  }

  @ApiParam({ name: 'filename', required: true, type: 'string' })
  @Get(':filename')
  findProfileImage(
    @Param('filename') fileName,
    @Res() res,
  ): Observable<Object> {
    return of(
      res.sendFile(join(process.cwd(), 'files/' + fileName), (err) => {
        if (err) {
          res.status(404).send({ status: 404, error: 'File not found' });
        }
      }),
    );
  }
}
