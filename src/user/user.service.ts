import { ResetPassword } from '../lib/models/reset-password';
import { MailService } from './../mail/mail.service';
import { EmailConfirm } from './../lib/models/email-confirm';
import { UserUpdate } from './../lib/models/user-update';
import { UserView } from './../lib/views/user.view';
import { PaginationDto } from './../lib/models/pagination-dto';
import { Order } from './../lib/enum/order.enum';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../lib/entitys/user.entity';
import * as bcrypt from 'bcrypt';
import { UserCreate } from './../lib/models/user-create';
import { Repository } from 'typeorm';
import { ChangePassword } from '../lib/models/change-password';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private mailService: MailService,
  ) {}

  async signUp(userCreate: UserCreate) {
    const userEmail = await this.findEmail(userCreate.email);

    if (userEmail) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'email already exist',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const hash = await this.hashData(userCreate.password);
    userCreate.password = hash;

    const user = await this.userRepo.save(this.userRepo.create(userCreate));
    return user;
  }

  async getAll(
    offset?: number,
    limit?: number,
  ): Promise<PaginationDto<UserView>> {
    const users = await this.userRepo.find({
      order: {
        id: Order.ASC,
      },
      skip: offset,
      take: limit,
    });

    const totalCount = await this.userRepo.count();
    const view = users.map((data) => new UserView(data));

    return new PaginationDto(
      view,
      Number(limit),
      offset === undefined ? 0 : Number(offset),
      totalCount,
    );
  }

  async getTotal() {
    const total = await this.userRepo.count();
    return {
      total: total,
    };
  }

  async getOne(id: number) {
    const user = await this.userRepo.findOneBy({ id: id });
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }
    return user;
  }

  async getByEmail(email: string) {
    const user = await this.findUerByEmail(email);
    if (!user) {
      throw new NotFoundException(`User ${email} not found`);
    }
    return user;
  }

  async update(id: number, userUpdate: UserUpdate) {
    const userTobeUpdate = await this.userRepo.findOneBy({ id: id });
    if (!userTobeUpdate) {
      throw new NotFoundException(`User ${id} not found`);
    }

    if (userUpdate.email) {
      if (userTobeUpdate.email === userUpdate.email) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'email already exist',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      userTobeUpdate.email = userUpdate.email;
    }

    if (userUpdate.firstName) {
      userTobeUpdate.firstName = userUpdate.firstName;
    }

    if (userUpdate.lastName) {
      userTobeUpdate.lastName = userUpdate.lastName;
    }

    if (userUpdate.profile) {
      userTobeUpdate.profile = userUpdate.profile;
    }

    if (userTobeUpdate.roles) {
      userTobeUpdate.roles = userUpdate.roles;
    }

    userTobeUpdate.updatedAt = new Date();
    return this.userRepo.save(userTobeUpdate);
  }

  async updateCode(id: number, code: string, password?: string) {
    const userTobeUpdate = await this.userRepo.findOneBy({ id: id });

    if (!userTobeUpdate) {
      throw new NotFoundException(`User ${id} not found`);
    }

    if (userTobeUpdate.password) {
      userTobeUpdate.password = password;
    }

    userTobeUpdate.code = code;
    userTobeUpdate.updatedAt = new Date();

    return this.userRepo.save(userTobeUpdate);
  }

  async delete(id: number) {
    const user = await this.userRepo.findOneBy({ id: id });

    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }

    return this.userRepo.delete({ id: id });
  }

  async sendCode(userEmail: EmailConfirm) {
    const user = await this.findUerByEmail(userEmail.email);

    if (!user) {
      throw new NotFoundException(`Email not found`);
    }

    const code = Math.floor(100000 + Math.random() * 900000);
    const fullName = this.fullName(user.firstName, user.lastName);

    await this.updateCode(user.id, code.toString());
    await this.mailService.sendResetPasswordMailTemplate(
      fullName,
      user.email,
      code,
    );

    setTimeout(async () => {
      await this.updateCode(user.id, null);
    }, 300000);
    return { message: 'succeed' };
  }

  async resetPassword(resetPassword: ResetPassword) {
    const user = await this.findUerByCode(resetPassword.code);

    if (!user || user.code !== resetPassword.code) {
      throw new BadRequestException('Invalid code');
    }

    const hash = await this.hashData(resetPassword.password);
    await this.updateCode(user.id, null, hash);
    return { message: 'succeed' };
  }

  async changePassword(id: number, changePassword: ChangePassword) {
    const user = await this.userRepo.findOneBy({ id: id });
    const passwordMatchers = await bcrypt.compare(
      changePassword.currentPassword,
      user.password,
    );

    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }
    if (!passwordMatchers) {
      throw new BadRequestException('Current password is invalid');
    }

    const hash = await this.hashData(changePassword.newPassword);
    user.updatedAt = new Date();
    user.password = hash;
    return this.userRepo.save(user);
  }

  async findUerByEmail(email: string): Promise<User | undefined> {
    return this.userRepo.findOneBy({ email: email });
  }

  async findUerByCode(code: string): Promise<User | undefined> {
    return this.userRepo.findOneBy({ code: code });
  }

  private hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  private findEmail(email: string) {
    return this.userRepo.findOneBy({ email: email });
  }

  private fullName(firstName: string, lastName: string) {
    return (
      firstName.charAt(0).toUpperCase() +
      firstName.slice(1) +
      ' ' +
      lastName.charAt(0).toUpperCase() +
      lastName.slice(1)
    );
  }
}
