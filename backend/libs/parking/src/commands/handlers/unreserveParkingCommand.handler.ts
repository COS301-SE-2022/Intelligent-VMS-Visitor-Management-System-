import { UnreserveParkingCommand } from "../impl/unreserveParking.command";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Parking, ParkingDocument } from "../../schema/parking.schema";


@CommandHandler(UnreserveParkingCommand)
export class UnreserveParkingCommandHandler implements ICommandHandler<UnreserveParkingCommand> {
  constructor(
      @InjectModel(Parking.name) private parkingModel: Model<ParkingDocument>,
  ) {}

  async execute(command: UnreserveParkingCommand):Promise<Parking> {
    //db stuff for reserving parking

    //what does this do? break up command into its components?
    const { parkingNumber } = command;
    return await this.parkingModel.findOneAndUpdate({parkingNumber:parkingNumber}, {reservationInviteID: ""});


  }
}
