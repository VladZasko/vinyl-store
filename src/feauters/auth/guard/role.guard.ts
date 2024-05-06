import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthRepository } from '../repository/auth.repository';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    protected authRepository: AuthRepository,
  ) {}

  matchRoles(roles: string[], userRole: string) {
    return roles.some((role) => role === userRole);
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      true;
    }
    const request = context.switchToHttp().getRequest();
    const findUser = await this.authRepository.findUserById(
      request.user.userId,
    );
    return this.matchRoles(roles, findUser.accountData.role);
  }
}
