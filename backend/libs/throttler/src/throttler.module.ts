import { Module } from '@nestjs/common';
import { RateLimitStorageService } from './throttler.service';

@Module({
  providers: [RateLimitStorageService],
  exports: [RateLimitStorageService],
})
export class ThrottlerModule {}
