import { Module } from '@nestjs/common';
import { SignInService } from '../sign-in/sign-in.service';
import { SignOutService } from '../sign-out/sign-out.service';
import { ReceptionistService } from './receptionist.service';

@Module({
  providers: [ReceptionistService,SignInService,SignOutService],
  exports: [ReceptionistService],
})
export class ReceptionistModule {}
