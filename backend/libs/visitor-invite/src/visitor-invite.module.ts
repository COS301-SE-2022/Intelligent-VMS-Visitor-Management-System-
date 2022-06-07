import { forwardRef, Module } from "@nestjs/common";
import { VisitorInviteService } from "./visitor-invite.service";
import { MongooseModule } from "@nestjs/mongoose";
import { CqrsModule } from "@nestjs/cqrs";

import { AuthModule } from "@vms/auth";
import { ParkingModule } from "@vms/parking";
import { MailModule } from "@vms/mail";
import { RestrictionsModule } from "@vms/restrictions";

import { Invite, InviteSchema } from "./schema/invite.schema";
import { VisitorInviteResolver } from "./visitor-invite.resolver";
import { CreateInviteCommandHandler } from "./commands/handlers/createInviteCommand.handler";
import { CancelInviteCommandHandler } from "./commands/handlers/cancelInviteCommand.handler";

import { GetInvitesQueryHandler } from "./queries/handlers/getInvites.handler";
import { GetInvitesByDateQueryHandler } from "./queries/handlers/getInvitesByDate.handler";
import { GetInviteQueryHandler } from "./queries/handlers/getInvite.handler";
import { getNumberOfVisitors } from "./queries/handlers/getNumberOfVisitors.handler";
import { GetInvitesInRangeQueryHandler } from "./queries/handlers/getInvitesInRange.handler";
import { GetInvitesByNameQueryHandler } from "./queries/handlers/getInvitesByName.handler";
import { GetInvitesInRangeByEmailQueryHandler } from "./queries/handlers/getInvitesInRangeByEmail.handler";
import { GetTotalNumberOfInvitesOfResidentQueryHandler } from "./queries/handlers/getTotalNumberOfInvitesOfResident.handler";
import { GetTotalNumberOfInvitesVisitorQueryHandler } from "./queries/handlers/getTotalNumberOfInvitesVisitor.handler";

@Module({
    imports: [
        CqrsModule,
        AuthModule,
        forwardRef(() => {return ParkingModule}),
        MailModule,
        RestrictionsModule,
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
        GetInvitesByDateQueryHandler,
        GetInvitesInRangeQueryHandler,
        GetInvitesByNameQueryHandler,
        GetInvitesInRangeByEmailQueryHandler,
        GetTotalNumberOfInvitesOfResidentQueryHandler,
        GetTotalNumberOfInvitesVisitorQueryHandler,
        getNumberOfVisitors
    ],
    exports: [VisitorInviteService],
})
export class VisitorInviteModule {}
