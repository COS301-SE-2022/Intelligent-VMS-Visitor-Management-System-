import { RemoveParkingCommand } from "../impl/removeParking.command";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Parking, ParkingDocument } from "../../schema/parking.schema";


@CommandHandler(RemoveParkingCommand)
export class RemoveParkingCommandHandler implements ICommandHandler<RemoveParkingCommand> {
  constructor(
      @InjectModel(Parking.name) private parkingModel: Model<ParkingDocument>,
  ) {}

  //db stuff for adding parking
  async execute(command: RemoveParkingCommand) {

    //TODO (Larisa) change find one

    //return await this.parkingModel.re(parkingSpace);
  }
}