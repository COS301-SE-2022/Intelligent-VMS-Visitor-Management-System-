import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { GqlExecutionContext } from "@nestjs/graphql";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    getRequest(context: ExecutionContext) {
        const ctx = GqlExecutionContext.create(context);
        return ctx.getContext().req;
    }

    canActivate(context: ExecutionContext): boolean {
        const gqlCtx = GqlExecutionContext.create(context);
        const ctx = gqlCtx.getContext();

        const roles = this.reflector.get<string[]>(
            "roles",
            context.getHandler(),
        );

        // If the route does not have any roles just let the request through
        if (!roles) {
            return true;
        }

        const { user } = ctx.req;
        console.log(user);

        return this._matchRoles(user.permission, roles);
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
