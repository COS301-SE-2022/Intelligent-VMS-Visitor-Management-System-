import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Parking, ParkingDocument } from "../../schema/parking.schema";
import { DisableParkingSpaceCommand } from "../impl/disableParkingSpace.command";


@CommandHandler(DisableParkingSpaceCommand)
export class DisableParkingSpaceCommandHandler implements ICommandHandler<DisableParkingSpaceCommand> {
  constructor(
      @InjectModel(Parking.name) private parkingModel: Model<ParkingDocument>,
  ) {}

  async execute(command: DisableParkingSpaceCommand): Promise<Parking> {
    const { parkingNumber } = command;

    //TODO (Larisa) change find one
    
    return await this.parkingModel.findOneAndUpdate({parkingNumber: parkingNumber}, {enabled: false});
  }
}