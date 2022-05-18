import { UnreserveParkingCommand } from "../impl/unreserveParking.command";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ParkingReservation, ParkingReservationDocument } from "../../schema/reservation.schema";


@CommandHandler(UnreserveParkingCommand)
export class UnreserveParkingCommandHandler implements ICommandHandler<UnreserveParkingCommand> {
  constructor(
      @InjectModel(ParkingReservation.name) private parkingReservationModel: Model<ParkingReservationDocument>,
  ) {}

  //db stuff for reserving parking
  async execute(command: UnreserveParkingCommand) {
    const { parkingNumber } = command;

    await this.parkingReservationModel.deleteOne( { parkingNumber: parkingNumber} );
  }
}
