import { Module } from '@nestjs/common';
import { VisitorInviteService } from './visitor-invite.service';

@Module({
  providers: [VisitorInviteService],
  exports: [VisitorInviteService],
})
export class VisitorInviteModule {}
