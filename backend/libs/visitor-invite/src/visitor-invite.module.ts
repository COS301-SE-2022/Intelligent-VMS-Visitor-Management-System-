import { forwardRef, Module, CacheModule } from "@nestjs/common";
import { VisitorInviteService } from "./visitor-invite.service";
import { MongooseModule } from "@nestjs/mongoose";
import { CqrsModule } from "@nestjs/cqrs";
import { HttpModule } from "@nestjs/axios";

import { AuthModule } from "@vms/auth";
import { ParkingModule } from "@vms/parking";
import { MailModule } from "@vms/mail";
import { RestrictionsModule } from "@vms/restrictions";

import { Invite, InviteSchema } from "./schema/invite.schema";
import { GroupInvite, GroupInviteSchema } from "./schema/groupInvite.schema";

import { VisitorInviteResolver } from "./visitor-invite.resolver";

import { CreateInviteCommandHandler } from "./commands/handlers/createInviteCommand.handler";
import { CancelInviteCommandHandler } from "./commands/handlers/cancelInviteCommand.handler";
import { CreateGroupInviteCommandHandler } from "./commands/handlers/groupInviteCommand.handler";

import { GetInvitesQueryHandler } from "./queries/handlers/getInvites.handler";
import { GetInvitesByDateQueryHandler } from "./queries/handlers/getInvitesByDate.handler";
import { GetInviteQueryHandler } from "./queries/handlers/getInvite.handler";
import { GetInvitesByNameForSearchQueryHandler } from "./queries/handlers/getInviteByNameForSearch.handler";
import { getNumberOfVisitors } from "./queries/handlers/getNumberOfVisitors.handler";
import { GetInvitesInRangeQueryHandler } from "./queries/handlers/getInvitesInRange.handler";
import { GetInvitesByNameQueryHandler } from "./queries/handlers/getInvitesByName.handler";
import { GetInvitesInRangeByEmailQueryHandler } from "./queries/handlers/getInvitesInRangeByEmail.handler";
import { GetTotalNumberOfInvitesOfResidentQueryHandler } from "./queries/handlers/getTotalNumberOfInvitesOfResident.handler";
import { GetTotalNumberOfInvitesVisitorQueryHandler } from "./queries/handlers/getTotalNumberOfInvitesVisitor.handler";
import { GetNumberOfOpenInvitesQueryHandler } from "./queries/handlers/getNumberOfOpenInvites.handler";

@Module({
    imports: [
        CacheModule.register(),
        CqrsModule,
        HttpModule.register({
            maxRedirects: 5,
        }),
        AuthModule,
        forwardRef(() => {return ParkingModule}),
        MailModule,
        RestrictionsModule,
        MongooseModule.forFeature([
            { name: Invite.name, schema: InviteSchema },
            { name: GroupInvite.name, schema: GroupInviteSchema },
        ]),
    ],
    providers: [
        VisitorInviteService,
        VisitorInviteResolver,
        CreateInviteCommandHandler,
        CancelInviteCommandHandler,
        GetInvitesQueryHandler,
        GetInviteQueryHandler,
        GetInvitesByDateQueryHandler,
        GetInvitesInRangeQueryHandler,
        getNumberOfVisitors,
        GetInvitesByNameQueryHandler,
        GetInvitesByNameForSearchQueryHandler,
        GetInvitesInRangeByEmailQueryHandler,
        GetTotalNumberOfInvitesOfResidentQueryHandler,
        GetTotalNumberOfInvitesVisitorQueryHandler,
        CreateGroupInviteCommandHandler,
        GetNumberOfOpenInvitesQueryHandler,
        getNumberOfVisitors,
    ],
    exports: [VisitorInviteService],
})
export class VisitorInviteModule {}
