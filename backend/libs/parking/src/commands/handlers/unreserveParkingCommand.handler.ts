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

  //db stuff for reserving parking
  async execute(command: UnreserveParkingCommand):Promise<Parking> {
    const { parkingNumber } = command;

    //TODO (Larisa) change find one

    //set the reservation invite ID to null as it is no longer reserved
    return await this.parkingModel.findOneAndUpdate({parkingNumber:parkingNumber}, {reservationInviteID: ""});


  }
}
