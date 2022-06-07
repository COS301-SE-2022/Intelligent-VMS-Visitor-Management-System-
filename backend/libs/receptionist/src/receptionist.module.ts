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
import { ReceptionistResolver } from './receptionist.resolver';
import { ReceptionistService } from './receptionist.service';
import { Tray,TraySchema } from './schema/tray.schema';

@Module({
  imports: [
    CqrsModule,
    VisitorInviteModule,
    ParkingModule,
    MongooseModule.forFeature([
      { name: Invite.name, schema: InviteSchema },
    ]),
    MongooseModule.forFeature([
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
    getTrayFromInviteQueryHandler,
    getTrayListQueryHandler,
    generateTrayCommandHandler,
    VisitorInviteModule,],
  exports: [ReceptionistService],
})
export class ReceptionistModule { }