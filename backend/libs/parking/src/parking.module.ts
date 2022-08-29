import { forwardRef, Module } from '@nestjs/common';
import { ParkingService } from './parking.service';
import { MongooseModule } from "@nestjs/mongoose";
import { CqrsModule } from "@nestjs/cqrs";
import { ParkingResolver } from "./parking.resolver";
import { AuthModule } from "@vms/auth";

import { Parking, ParkingSchema } from "./schema/parking.schema";
import { ParkingReservation, ParkingReservationSchema } from "./schema/reservation.schema";
import { GroupParking, GroupParkingSchema } from "./schema/groupParking.schema";


import { ReserveParkingCommandHandler } from "./commands/handlers/reserveParkingCommand.handler";
import { UnreserveParkingCommandHandler } from "./commands/handlers/unreserveParkingCommand.handler";
import { AddParkingCommandHandler } from "./commands/handlers/addParkingCommand.handler";
import { RemoveParkingCommandHandler } from "./commands/handlers/removeParkingCommand.handler";
import { FreeParkingCommandHandler } from "./commands/handlers/freeParkingCommand.handler";
import { AssignParkingCommandHandler } from "./commands/handlers/assignParkingCommand.handler";
import { GroupParkingCommandHandler } from './commands/handlers/groupParkingCommand.handler';
import { DisableParkingSpaceCommandHandler } from './commands/handlers/disableParkingSpaceCommand.handler';
import { EnableParkingCommandSpaceHandler } from './commands/handlers/enableParkingSpaceCommand.handler';

import { getTotalAvailableParkingQueryHandler } from './queries/handlers/getTotalAvailableParkingQuery.handler';
import { getTotalParkingQueryHandler } from './queries/handlers/getTotalParkingQuery.handler';
import { GetFreeParkingQueryHandler } from './queries/handlers/getFreeParkingQuery.handler';
import { CreateNParkingSpotsCommandHandler } from './commands/handlers/createNParkingSpots.handler';
import { GetReservationsQueryHandler } from './queries/handlers/getReservationsQuery.handler';
import { GetInviteReservationQueryHandler } from './queries/handlers/getInviteReservationQuery.handler';
import { GetParkingReservationsQueryHandler } from './queries/handlers/getParkingReservationsQuery.handler';
import { GetReservationsInRangeQueryHandler } from "./queries/handlers/getReservationsInRangeQuery.handler";
import { GetNumberOfReservationsQueryHandler } from "./queries/handlers/getNumberOfReservationsQuery.handler";
import { getAvailableParkingQueryHandler } from './queries/handlers/getAvailableParkingQuery.handler';
import { getDisabledParkingQueryHandler } from './queries/handlers/getDisabledParkingQuery.handler';

import { VisitorInviteModule} from '@vms/visitor-invite';

import { ActivateReservationCommandHandler } from './commands/handlers/activateReservationCommand.handler';


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
    MongooseModule.forFeature([
      { name: GroupParking.name, schema: GroupParkingSchema },
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
    ActivateReservationCommandHandler,
    GetNumberOfReservationsQueryHandler,
    RemoveParkingCommandHandler,
    getTotalAvailableParkingQueryHandler,
    getTotalParkingQueryHandler,
    getAvailableParkingQueryHandler,
    getDisabledParkingQueryHandler,
    DisableParkingSpaceCommandHandler,
    EnableParkingCommandSpaceHandler,
    GetFreeParkingQueryHandler,
    CreateNParkingSpotsCommandHandler,
    GroupParkingCommandHandler,
    GetReservationsQueryHandler,
    GetInviteReservationQueryHandler,
    GetParkingReservationsQueryHandler,
    GetReservationsInRangeQueryHandler
  ],

  exports: [ParkingService],
})
export class ParkingModule {}
