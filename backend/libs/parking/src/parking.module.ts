import { Module } from '@nestjs/common';
import { ParkingService } from './parking.service';
import { MongooseModule } from "@nestjs/mongoose";
import { Parking, ParkingSchema } from "./schema/parking.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Parking.name, schema: ParkingSchema },
    ]),
  ],
  providers: [ParkingService],
  exports: [ParkingService],
})
export class ParkingModule {}
