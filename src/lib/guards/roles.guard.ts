import { UserService } from './../../user/user.service';
import { ROLES_KEY } from './../decorator/roles.decorator';
import { Role } from './../enum/role.enum';
import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    if (request.user) {
      const user = await this.userService.findUerByEmail(request.user.username);
      return requiredRoles.some((role) => user.roles?.includes(role));
    }
    return true;
  }
}
