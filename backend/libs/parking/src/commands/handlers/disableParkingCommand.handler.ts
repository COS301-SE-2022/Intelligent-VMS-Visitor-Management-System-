import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Parking, ParkingDocument } from "../../schema/parking.schema";
import { DisableParkingCommand } from "../impl/disableParking.command";


@CommandHandler(DisableParkingCommand)
export class EnableParkingCommandHandler implements ICommandHandler<DisableParkingCommand> {
  constructor(
      @InjectModel(Parking.name) private parkingModel: Model<ParkingDocument>,
  ) {}

  async execute(command: DisableParkingCommand): Promise<Parking> {
    const { parkingNumber } = command;

    //TODO (Larisa) change find one
    
    return await this.parkingModel.findOneAndUpdate({parkingNumber: parkingNumber}, {enabled: false});
  }
}