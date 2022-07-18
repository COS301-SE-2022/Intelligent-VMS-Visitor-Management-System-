import { forwardRef, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { ParkingModule } from '@vms/parking';
import { VisitorInviteModule } from '@vms/visitor-invite';
import { Invite, InviteSchema } from '@vms/visitor-invite/schema/invite.schema';
import { SignInService } from '../sign-in/sign-in.service';
import { SignOutService } from '../sign-out/sign-out.service';
import { SignInInviteCommandHandler, SignOutInviteCommandHandler } from './commands/handler';
import { generateTrayCommandHandler } from './commands/handler/Tray/generateTray.handler';
import { getTrayFromInviteQueryHandler } from './queries/handlers/getTrayFromInvite.handler';
import { getTrayListQueryHandler } from './queries/handlers/getTrayList.handler';
import { getTrayListQuery } from './queries/impl/getTrayList.query';
import { removeTrayByInviteIDCommand } from './commands/impl/Tray/removeTrayByInviteID.command';
import { ReceptionistResolver } from './receptionist.resolver';
import { ReceptionistService } from './receptionist.service';
import { Tray,TraySchema } from './schema/tray.schema';
import {RemoveTrayByInviteIDCommandHandler} from './commands/handler/Tray/removeTrayByInviteID.handler';
import { BulkSignInCommandHandler } from './commands/handler/bulkSignInCommand.handler';

@Module({
  imports: [
    CqrsModule,
    VisitorInviteModule,
    ParkingModule,
    MongooseModule.forFeature([
      { name: Invite.name, schema: InviteSchema },
      { name: Tray.name, schema: TraySchema },
    ]),
  
  ],
  providers: [
    ReceptionistService,
    SignInService,
    SignOutService,
    ReceptionistResolver,
    SignInInviteCommandHandler,
    SignOutInviteCommandHandler,
    BulkSignInCommandHandler,
    getTrayFromInviteQueryHandler,
    getTrayListQueryHandler,
    generateTrayCommandHandler,
    removeTrayByInviteIDCommand,
    RemoveTrayByInviteIDCommandHandler,
    VisitorInviteModule,],
  exports: [ReceptionistService],
})
export class ReceptionistModule { }