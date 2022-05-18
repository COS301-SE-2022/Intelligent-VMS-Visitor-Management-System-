import { ReserveParkingCommand } from "../impl/reserveParking.command";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Parking, ParkingDocument } from "../../schema/parking.schema";


@CommandHandler(ReserveParkingCommand)
export class ReserveParkingCommandHandler implements ICommandHandler<ReserveParkingCommand> {
  constructor(
      @InjectModel(Parking.name) private parkingModel: Model<ParkingDocument>,
  ) {}

  //db stuff for reserving parking
  async execute(command: ReserveParkingCommand) {
    
    //what does this do? break up command into its components?
    const { reservationInviteID, parkingNumber } = command;

    //set the reservation ID to the invitation that reserved this space, using the invite allows the parking system to retrieve date and visitor related data without redundently storing it
    return await this.parkingModel.findOneAndUpdate({parkingNumber:parkingNumber}, {reservationInviteID: reservationInviteID});

  }
}
