import { forwardRef, Module } from "@nestjs/common";
import { VisitorInviteService } from "./visitor-invite.service";
import { MongooseModule } from "@nestjs/mongoose";
import { CqrsModule } from "@nestjs/cqrs";

import { AuthModule } from "@vms/auth";
import { ParkingModule } from "@vms/parking";
import { MailModule } from "@vms/mail";

import { Invite, InviteSchema } from "./schema/invite.schema";
import { VisitorInviteResolver } from "./visitor-invite.resolver";
import { CreateInviteCommandHandler } from "./commands/handlers/createInviteCommand.handler";
import { CancelInviteCommandHandler } from "./commands/handlers/cancelInviteCommand.handler";
import { GetInvitesQueryHandler } from "./queries/handlers/getInvites.handler";
import { GetInviteQueryHandler } from "./queries/handlers/getInvite.handler";
import { GetInviteByNameQueryHandler } from "./queries/handlers/getInviteByNameForSearch.handler";
import { getNumberOfVisitors } from "./queries/handlers/getNumberOfVisitors.handler";
import { GetInvitesInRangeQueryHandler } from "./queries/handlers/getInvitesInRange.handler";

@Module({
    imports: [
        CqrsModule,
        AuthModule,
        forwardRef(() => ParkingModule),
        MailModule,
        MongooseModule.forFeature([
            { name: Invite.name, schema: InviteSchema },
        ]),
    ],
    providers: [
        VisitorInviteService,
        VisitorInviteResolver,
        CreateInviteCommandHandler,
        CancelInviteCommandHandler,
        GetInvitesQueryHandler,
        GetInviteQueryHandler,
        GetInvitesInRangeQueryHandler,
        getNumberOfVisitors,
        GetInviteByNameQueryHandler
    ],
    exports: [VisitorInviteService],
})
export class VisitorInviteModule {}
