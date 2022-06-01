import { forwardRef, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { VisitorInviteModule } from '@vms/visitor-invite';
import { SignInService } from '../sign-in/sign-in.service';
import { SignOutService } from '../sign-out/sign-out.service';
import { ReceptionistService } from './receptionist.service';

@Module({
  imports: [
    CqrsModule,
    forwardRef(() => VisitorInviteModule),
  ],
  providers: [ReceptionistService,SignInService,SignOutService],
  exports: [ReceptionistService],
})
export class ReceptionistModule {}
