import { Module } from "@nestjs/common";
import { VisitorInviteService } from "./visitor-invite.service";
import { MongooseModule } from "@nestjs/mongoose";
import { CqrsModule } from "@nestjs/cqrs";

import { AuthModule } from "@vms/auth";

import { Invite, InviteSchema } from "./schema/invite.schema";
import { VisitorInviteResolver } from "./visitor-invite.resolver";
import { CreateInviteCommandHandler } from "./commands/handlers/createInviteCommand.handler";
import { CancelInviteCommandHandler } from "./commands/handlers/cancelInviteCommand.handler";
import { GetInvitesQueryHandler } from "./queries/handlers/getInvites.handler";
import { GetInviteQueryHandler } from "./queries/handlers/getInvite.handler";
import { ReserveParkingCommandHandler } from "../../parking/src/commands/handlers/reserveParkingCommand.handler";
import { getAvailableParkingQueryHandler } from "../../parking/src/queries/handlers/getAvailableParkingQuery.handler";

@Module({
    imports: [
        CqrsModule,
        AuthModule,
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
        ReserveParkingCommandHandler,
        getAvailableParkingQueryHandler
    ],
    exports: [VisitorInviteService],
})
export class VisitorInviteModule {}
