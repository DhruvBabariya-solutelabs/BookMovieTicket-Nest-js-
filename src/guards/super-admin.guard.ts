import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { role } from 'src/util/constant.util';

export class SuperAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    if (!request.user) {
      throw new NotFoundException('User is not found please Login');
    }
    const userRole = request.user.role;
    if (userRole !== role.SUPER_ADMIN) {
      throw new ForbiddenException('you are not Super-Admin');
    }
    return true;
  }
}
