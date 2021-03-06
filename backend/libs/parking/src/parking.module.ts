import { forwardRef, Module } from '@nestjs/common';
import { ParkingService } from './parking.service';
import { MongooseModule } from "@nestjs/mongoose";
import { CqrsModule } from "@nestjs/cqrs";
import { ParkingResolver } from "./parking.resolver";
import { AuthModule } from "@vms/auth";
import { Parking, ParkingSchema } from "./schema/parking.schema";
import { ParkingReservation, ParkingReservationSchema } from "./schema/reservation.schema";
import { ReserveParkingCommandHandler } from "./commands/handlers/reserveParkingCommand.handler";
import { UnreserveParkingCommandHandler } from "./commands/handlers/unreserveParkingCommand.handler";
import { AddParkingCommandHandler } from "./commands/handlers/addParkingCommand.handler";
import { RemoveParkingCommandHandler } from "./commands/handlers/removeParkingCommand.handler";
import { FreeParkingCommandHandler } from "./commands/handlers/freeParkingCommand.handler";
import { AssignParkingCommandHandler } from "./commands/handlers/assignParkingCommand.handler";
import { getTotalAvailableParkingQueryHandler } from './queries/handlers/getTotalAvailableParkingQuery.handler';
import { GetFreeParkingQueryHandler } from './queries/handlers/getFreeParkingQuery.handler';
import { CreateNParkingSpotsCommandHandler } from './commands/handlers/createNParkingSpots.handler';
import { GetReservationsQueryHandler } from './queries/handlers/getReservationsQuery.handler';
import { GetInviteReservationQueryHandler } from './queries/handlers/getInviteReservationQuery.handler';
import { GetParkingReservationsQueryHandler } from './queries/handlers/getParkingReservationsQuery.handler';
import { GetReservationsInRangeQueryHandler } from "./queries/handlers/getReservationsInRangeQuery.handler";
import { GetNumberOfReservationsQueryHandler } from "./queries/handlers/getNumberOfReservationsQuery.handler";

import { VisitorInviteModule} from '@vms/visitor-invite';
import { getAvailableParkingQueryHandler } from './queries/handlers/getAvailableParkingQuery.handler';

@Module({
  imports: [
    CqrsModule,
    AuthModule,
    forwardRef(() => {return VisitorInviteModule}),
    MongooseModule.forFeature([
      { name: Parking.name, schema: ParkingSchema },
    ]),
    MongooseModule.forFeature([
      { name: ParkingReservation.name, schema: ParkingReservationSchema },
    ]),
  ],
  providers: [
    ParkingService,
    ParkingResolver,
    ReserveParkingCommandHandler,
    FreeParkingCommandHandler,
    AssignParkingCommandHandler,
    UnreserveParkingCommandHandler,
    AddParkingCommandHandler,
    GetNumberOfReservationsQueryHandler,
    RemoveParkingCommandHandler,
    getTotalAvailableParkingQueryHandler,
    getAvailableParkingQueryHandler,
    GetFreeParkingQueryHandler,
    CreateNParkingSpotsCommandHandler,
    GetReservationsQueryHandler,
    GetInviteReservationQueryHandler,
    GetParkingReservationsQueryHandler,
    GetReservationsInRangeQueryHandler
  ],

  exports: [ParkingService],
})
export class ParkingModule {}
