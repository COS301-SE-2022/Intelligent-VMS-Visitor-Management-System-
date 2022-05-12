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

  async execute(command: AssignParkingCommand) {

    //db stuff for assigning parking
    const { visitorEmail, parkingNumber } = command;

    //TODO (Larisa) change find one
    return await this.parkingModel.findOneAndUpdate({parkingNumber: parkingNumber}, {visitorEmail: visitorEmail},function (err, docs) {
      if (err){
          console.log(err)
      }
      else{
          console.log("Parking assigned : ", docs);
      }
    });
  }
}