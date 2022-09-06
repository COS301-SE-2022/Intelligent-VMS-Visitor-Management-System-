import { Module,forwardRef } from '@nestjs/common';
import { MongooseModule } from "@nestjs/mongoose";
import { CqrsModule } from "@nestjs/cqrs";

import { AuthModule } from "@vms/auth";

import { Restriction, RestrictionSchema } from "./schema/restriction.schema";
import { RestrictionsService } from './restrictions.service';
import { RestrictionResolver } from './restrictions.resolver';
import { SetNumInvitesCommandHandler } from "./commands/handlers/setNumInvitesCommand.handler";
import { GetNumInvitesQueryHandler } from "./queries/handlers/getNumInvitesQuery.handler";
import { SetCurfewTimeHandler } from "./commands/handlers/setCurfewTime.handler";
import { GetCurfewTimeQueryHandler } from "./queries/handlers/getCurfewTimeQuery.handler";
import { VisitorInviteModule } from '@vms/visitor-invite';

@Module({
    imports: [
        AuthModule,
        CqrsModule,
        forwardRef(() => {return VisitorInviteModule}),
        MongooseModule.forFeature([{ name: Restriction.name, schema: RestrictionSchema }]),
    ],
  providers: [RestrictionsService, 
              RestrictionResolver, 
              SetNumInvitesCommandHandler, 
              GetNumInvitesQueryHandler, 
              SetCurfewTimeHandler,
              GetCurfewTimeQueryHandler],
  exports: [RestrictionsService],
})
export class RestrictionsModule {}
