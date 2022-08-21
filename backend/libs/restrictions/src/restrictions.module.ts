import { Module } from '@nestjs/common';
import { MongooseModule } from "@nestjs/mongoose";
import { CqrsModule } from "@nestjs/cqrs";

import { AuthModule } from "@vms/auth";

import { Restriction, RestrictionSchema } from "./schema/restriction.schema";
import { RestrictionsService } from './restrictions.service';
import { RestrictionResolver } from './restrictions.resolver';
import { SetNumInvitesCommandHandler } from "./commands/handlers/setNumInvitesCommand.handler";
import { GetNumInvitesQueryHandler } from "./queries/handlers/getNumInvitesQuery.handler";

@Module({
    imports: [
        AuthModule,
        CqrsModule,
        MongooseModule.forFeature([{ name: Restriction.name, schema: RestrictionSchema }]),
    ],
  providers: [RestrictionsService, RestrictionResolver, SetNumInvitesCommandHandler, GetNumInvitesQueryHandler, SetCurfewTimeHandler, GetCurfewTimeHandler],
  exports: [RestrictionsService],
})
export class RestrictionsModule {}
