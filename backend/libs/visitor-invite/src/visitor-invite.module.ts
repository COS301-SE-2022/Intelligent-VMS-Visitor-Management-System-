import { forwardRef, Module, CacheModule } from "@nestjs/common";
import { VisitorInviteService } from "./visitor-invite.service";
import { MongooseModule } from "@nestjs/mongoose";
import { CqrsModule } from "@nestjs/cqrs";
import { HttpModule } from "@nestjs/axios";

import { UserModule } from "@vms/user";
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
import { GetVisitorsQueryHandler } from "./queries/handlers/getVisitors.handler";
import { GetVisitorVisitsQueryHandler } from "./queries/handlers/getVisitorVisits.handler";
import { GetMostUsedInviteDataQueryHandler } from "./queries/handlers/getMostUsedInviteData.handler";
import { GetInvitesForUsersQueryHandler } from "./queries/handlers/getInvitesForUsers.handler";
import { ExtendInvitesCommandHandler } from "./commands/handlers/extendInvitesCommand.handler";
import { GetInviteForSignInDataQueryHandler } from "./queries/handlers/getInviteForSignInData.handler";
import { GetTotalNumberOfCancellationsOfResidentQueryHandler } from "./queries/handlers/getTotalNumberOfCancellationsOfResident.handler";
import { GetTotalNumberOfVisitsOfResidentQueryHandler } from "./queries/handlers/getTotalNumberOfVisitsOfResident.handler";
import { GetInvitesOfResidentQueryHandler } from "./queries/handlers/getInvitesOfResident.handler";

@Module({
    imports: [
        CacheModule.register(),
        CqrsModule,
        HttpModule.register({
            maxRedirects: 5,
        }),
        forwardRef(() => {return UserModule}),
        forwardRef(() => {return AuthModule}),
        forwardRef(() => {return ParkingModule}),
        MailModule,
        forwardRef(() => {return RestrictionsModule}),
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
        ExtendInvitesCommandHandler,
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
        GetTotalNumberOfCancellationsOfResidentQueryHandler,
        GetTotalNumberOfVisitsOfResidentQueryHandler,
        CreateGroupInviteCommandHandler,
        GetNumberOfOpenInvitesQueryHandler,
        GetInvitesForUsersQueryHandler,
        GetVisitorsQueryHandler,
        GetMostUsedInviteDataQueryHandler,
        GetVisitorVisitsQueryHandler,
        getNumberOfVisitors,
        GetInviteForSignInDataQueryHandler,
        GetInvitesOfResidentQueryHandler,
    ],
    exports: [VisitorInviteService],
})
export class VisitorInviteModule {}
