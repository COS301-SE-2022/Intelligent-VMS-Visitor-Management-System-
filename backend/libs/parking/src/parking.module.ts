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
import { GetAvailableParkingQueryHandler } from './queries/handlers/getAvailableParkingQuery.handler';
import { GetFreeParkingQueryHandler } from './queries/handlers/getFreeParkingQuery.handler';
import { VisitorInviteModule} from '@vms/visitor-invite';
import { CreateNParkingSpotsCommandHandler } from './commands/handlers/createNParkingSpots.handler';
import { GetReservationsQueryHandler } from './queries/handlers/getReservationsQuery.handler';
import { GetInviteReservationQueryHandler } from './queries/handlers/getInviteReservationQuery.handler';
import { GetParkingReservationsQueryHandler } from './queries/handlers/getParkingReservationsQuery.handler';

@Module({
  imports: [
    CqrsModule,
    AuthModule,
    forwardRef(() => VisitorInviteModule),
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
    RemoveParkingCommandHandler,
    GetAvailableParkingQueryHandler,
    GetFreeParkingQueryHandler,
    CreateNParkingSpotsCommandHandler,
    GetReservationsQueryHandler,
    GetInviteReservationQueryHandler,
    GetParkingReservationsQueryHandler],

  exports: [ParkingService],
})
export class ParkingModule {}
