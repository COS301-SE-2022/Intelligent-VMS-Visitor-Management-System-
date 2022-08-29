import { Module, forwardRef } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CqrsModule } from "@nestjs/cqrs";

import { AuthModule } from "@vms/auth";

import { User, UserSchema } from "./schema/user.schema";
import { UserService } from "./user.service";
import { UserResolver } from "./user.resolver";
import { GetUserQueryHandler } from "./queries/handlers/getUser.handler";
import { SearchUserQueryHandler } from "./queries/handlers/searchUser.handler";
import { GetUnAuthUsersQueryHandler } from "./queries/handlers/getUnAuthUsers.handler";
import { GetUsersByTypeQueryHandler } from "./queries/handlers/getUsersByType.handler";

import { CreateUserCommandHandler } from "./commands/handlers/createUser.handler";
import { DeleteUserCommandHandler } from "./commands/handlers/deleteUser.handler";
import { AuthorizeUserCommandHandler } from "./commands/handlers/authorizeUser.handler";
import { DeauthorizeUserAccountCommandHandler } from "./commands/handlers/deauthorizeUserAccount.handler";

@Module({
    imports: [
        forwardRef(() => {return AuthModule}),
        CqrsModule,
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ],
    providers: [
        UserService, 
        UserResolver, 
        GetUserQueryHandler, 
        CreateUserCommandHandler, 
        DeleteUserCommandHandler,
        SearchUserQueryHandler,
        GetUsersByTypeQueryHandler,
        GetUnAuthUsersQueryHandler,
        AuthorizeUserCommandHandler,
        DeauthorizeUserAccountCommandHandler
    ],
    exports: [UserService],
})
export class UserModule {}
