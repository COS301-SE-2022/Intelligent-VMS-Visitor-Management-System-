import { AssignParkingCommand } from "../impl/assignParking.command";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Parking, ParkingDocument } from "../../schema/parking.schema";


@CommandHandler(AssignParkingCommand)
export class FreeParkingCommandHandler implements ICommandHandler<AssignParkingCommand> {
  constructor(
      @InjectModel(Parking.name) private parkingModel: Model<ParkingDocument>,
  ) {}

  async execute(command: AssignParkingCommand) {
      //db stuff for freeing up parking
    const { parkingNumber } = command;

    /*let parkingSpace = await this.parkingModel.findById(parkingNumber);
    return await this.parkingModel.findById(parkingNumber, {visitorEmail: parkingSpace.reserverEmail})*/
  }
}