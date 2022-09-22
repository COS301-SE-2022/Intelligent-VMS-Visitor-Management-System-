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
import { VisitorInviteModule } from "@vms/visitor-invite";
import { RewardsModule } from "@vms/rewards";
import { UpdateUserCommandHandler } from "./commands/handlers/updateUser.handler";
import { GetDaysWithVMSQueryHandler } from "./queries/handlers/getDaysWithVMS.handler";
import { IncreaseSuggestionsCommandHandler } from "./commands/handlers/increaseSuggestions.handler";
import { GetNumSuggestionsQueryHandler } from "./queries/handlers/getNumSuggestions.handler";
import { UpdatePrivilegesCommandHandler } from "./commands/handlers/updatePrivileges.handler";

@Module({
    imports: [
        forwardRef(() => {return AuthModule}),
        forwardRef(() => {return RewardsModule}),
        forwardRef(() => {return VisitorInviteModule}),
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
        GetNumSuggestionsQueryHandler,
        GetDaysWithVMSQueryHandler,
        UpdateUserCommandHandler,
        UpdatePrivilegesCommandHandler,
        AuthorizeUserCommandHandler,
        DeauthorizeUserAccountCommandHandler,
        IncreaseSuggestionsCommandHandler,
    ],
    exports: [UserService],
})
export class UserModule {}
