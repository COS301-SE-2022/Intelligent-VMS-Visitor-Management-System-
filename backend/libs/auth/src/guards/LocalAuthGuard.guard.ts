import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import {ExecutionContextHost} from "@nestjs/core/helpers/execution-context-host";
import {GqlExecutionContext} from "@nestjs/graphql";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class LocalAuthGuard extends AuthGuard("local") {
    constructor() {
        super();
    }

    canActivate(context: ExecutionContext) {
        const ctx = GqlExecutionContext.create(context);
        const { req } = ctx.getContext();

        return super.canActivate(new ExecutionContextHost([req]));
    }

    handleRequest(err: any, user: any) {
        if (err) {
            throw err;
        }

        return user;
    }
}
