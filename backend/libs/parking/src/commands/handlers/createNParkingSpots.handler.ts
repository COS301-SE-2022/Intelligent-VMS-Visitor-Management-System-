import { CreateNParkingSpotsCommand } from "../impl/createNParkingSpots.command";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Parking, ParkingDocument } from "../../schema/parking.schema";


@CommandHandler(CreateNParkingSpotsCommand)
export class CreateNParkingSpotsHandler implements ICommandHandler<CreateNParkingSpotsCommand> {
  constructor(
      @InjectModel(Parking.name) private parkingModel: Model<ParkingDocument>,
  ) {}

  async execute(command: CreateNParkingSpotsCommand) {
    const { numSpots } = command;
    return await this.parkingModel.insertMany({})
  }
}
