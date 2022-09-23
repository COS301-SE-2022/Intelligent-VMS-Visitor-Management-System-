import { Module, forwardRef } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CqrsModule } from "@nestjs/cqrs";
import { ConfigModule } from "@nestjs/config";
import { HttpModule } from "@nestjs/axios";

import { AuthModule } from "@vms/auth";

import { User, UserSchema } from "./schema/user.schema";
import { UserService } from "./user.service";
import { UserResolver } from "./user.resolver";
import { UserController } from "./user.controller";
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
import { RestrictionsModule } from "@vms/restrictions";
import { GetNumInvitesQueryHandler } from "./queries/handlers/getNumInvites.handler";
import { GetNumSleepoversQueryHandler } from "./queries/handlers/getNumSleepovers.handler";
import { GetCurfewTimeQueryHandler } from "./queries/handlers/getCurfewTime.handler";
import { UpdateXPCommandHandler } from "./commands/handlers/updateXP.handler";
import { GetNumThemesQueryHandler } from "./queries/handlers/getNumThemes.handler";

@Module({
    imports: [
        forwardRef(() => {return AuthModule}),
        forwardRef(() => {return RewardsModule}),
        forwardRef(() => {return VisitorInviteModule}),
        RestrictionsModule,
        ConfigModule,
        CqrsModule,
        HttpModule.register({
            maxRedirects: 5,
        }),
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
        GetCurfewTimeQueryHandler,
        GetNumInvitesQueryHandler,
        GetNumSleepoversQueryHandler,
        UpdateXPCommandHandler,
        GetNumThemesQueryHandler,

    ],
    controllers: [UserController],
    exports: [UserService],
})
export class UserModule {}
