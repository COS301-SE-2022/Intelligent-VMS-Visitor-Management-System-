import { AddParkingCommand } from "../impl/addParking.command";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Parking, ParkingDocument } from "../../schema/parking.schema";


@CommandHandler(AddParkingCommand)
export class AddParkingCommandHandler implements ICommandHandler<AddParkingCommand> {
  constructor(
      @InjectModel(Parking.name) private parkingModel: Model<ParkingDocument>,
  ) {}

  //db stuff for adding parking
  async execute(command: AddParkingCommand) {

    //TODO (Larisa) change find one

    const parkingSpace = new Parking();
    //TODO auto inc
    parkingSpace.parkingNumber=0;
    parkingSpace.reservationInviteID="";
    parkingSpace.visitorEmail="";

    return await this.parkingModel.create(parkingSpace);
  }
}