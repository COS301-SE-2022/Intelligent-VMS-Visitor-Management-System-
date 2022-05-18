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
  async execute(command: AddParkingCommand): Promise<Parking> {

    //TODO (Larisa) change find one
    const spaces = await this.parkingModel.find();

    const parkingSpace = new Parking();
  
    parkingSpace.parkingNumber=spaces.length+1;
    parkingSpace.reservationInviteID="";
    parkingSpace.visitorEmail="";

    return await this.parkingModel.create(parkingSpace);
  }
}