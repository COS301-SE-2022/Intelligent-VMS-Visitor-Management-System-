import { AssignParkingCommand } from "../impl/assignParking.command";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Parking, ParkingDocument } from "../../schema/parking.schema";


@CommandHandler(AssignParkingCommand)
export class AssignParkingCommandHandler implements ICommandHandler<AssignParkingCommand> {
  constructor(
      @InjectModel(Parking.name) private parkingModel: Model<ParkingDocument>,
  ) {}

  //db stuff for assigning parking
  async execute(command: AssignParkingCommand):Promise<Parking> {
    const { visitorEmail, parkingNumber } = command;

    //TODO (Larisa) change find one

    //Set the visitor email field to indicate that visitor is occupying the space at the current time
    return await this.parkingModel.findOneAndUpdate({parkingNumber: parkingNumber}, {visitorEmail: visitorEmail});
  }
}