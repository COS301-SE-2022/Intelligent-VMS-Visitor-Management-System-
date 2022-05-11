import { FreeParkingCommand } from "../impl/freeParking.command";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Parking, ParkingDocument } from "../../schema/parking.schema";


@CommandHandler(FreeParkingCommand)
export class FreeParkingCommandHandler implements ICommandHandler<FreeParkingCommand> {
  constructor(
      @InjectModel(Parking.name) private parkingModel: Model<ParkingDocument>,
  ) {}

  async execute(command: FreeParkingCommand) {
      //db stuff for freeing up parking
    const { parkingNumber } = command;

    return await this.parkingModel.findByIdAndUpdate(parkingNumber, {visitorEmail: ""});
  }
}