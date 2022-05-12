import { Module } from '@nestjs/common';
import { ParkingService } from './parking.service';
import { MongooseModule } from "@nestjs/mongoose";
import { CqrsModule } from "@nestjs/cqrs";
import { ParkingResolver } from "./parking.resolver";
import { AuthModule } from "@vms/auth";
import { Parking, ParkingSchema } from "./schema/parking.schema";
import { ReserveParkingCommandHandler } from "./commands/handlers/reserveParkingCommand.handler";
import { FreeParkingCommandHandler } from "./commands/handlers/freeParkingCommand.handler";
import { AssignParkingCommandHandler } from "./commands/handlers/assignParkingCommand.handler";
import { getAvailableParkingQueryHandler } from './queries/handlers/getAvailableParkingQuery.handler';

@Module({
  imports: [
    CqrsModule,
    AuthModule,
    MongooseModule.forFeature([
      { name: Parking.name, schema: ParkingSchema },
    ]),
  ],
  providers: [
    ParkingService,
    ParkingResolver,
    ReserveParkingCommandHandler,
    FreeParkingCommandHandler,
    AssignParkingCommandHandler,
    getAvailableParkingQueryHandler],

  exports: [ParkingService],
})
export class ParkingModule {}
