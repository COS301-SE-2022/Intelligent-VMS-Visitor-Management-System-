import { Module, forwardRef } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CqrsModule } from "@nestjs/cqrs";

import { AuthModule } from "@vms/auth";

import { User, UserSchema } from "./schema/user.schema";
import { UserService } from "./user.service";
import { UserResolver } from "./user.resolver";
import { GetUserQueryHandler } from "./queries/handlers/getUser.handler";

@Module({
    imports: [
        forwardRef(() => AuthModule),
        CqrsModule,
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ],
    providers: [UserService, UserResolver, GetUserQueryHandler],
    exports: [UserService],
})
export class UserModule {}
