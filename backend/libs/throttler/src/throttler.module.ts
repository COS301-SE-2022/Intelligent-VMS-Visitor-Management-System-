import { Module } from '@nestjs/common';
import { ThrottlerService } from './throttler.service';

@Module({
  providers: [ThrottlerService],
  exports: [ThrottlerService],
})
export class ThrottlerModule {}
