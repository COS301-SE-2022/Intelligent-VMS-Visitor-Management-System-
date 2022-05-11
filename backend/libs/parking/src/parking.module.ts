import { Module } from '@nestjs/common';
import { ParkingService } from './parking.service';

@Module({
  providers: [ParkingService],
  exports: [ParkingService],
})
export class ParkingModule {}
