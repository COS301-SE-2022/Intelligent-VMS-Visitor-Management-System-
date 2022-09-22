import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class HttpRolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.get<string[]>(
            "roles",
            context.getHandler(),
        );

        if (!requiredRoles) {
          return true;
        }
        const { user } = context.switchToHttp().getRequest();
        return this._matchRoles(user.permission, requiredRoles);
    }

    _matchRoles(permission: number, roles: string[]): boolean {
        const permissionText =
            permission === 0
                ? "admin"
                : permission === 1
                ? "receptionist"
                : permission === 2
                ? "resident"
                : "unknown";

        if (permissionText !== "unknown") {
            return roles.includes(permissionText);
        }

        return false;
    }
}
