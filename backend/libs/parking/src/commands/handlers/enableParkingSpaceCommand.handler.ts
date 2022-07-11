import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Parking, ParkingDocument } from "../../schema/parking.schema";
import { EnableParkingSpaceCommand } from "../impl/enableParkingSpace.command";


@CommandHandler(EnableParkingSpaceCommand)
export class EnableParkingCommandHandler implements ICommandHandler<EnableParkingSpaceCommand> {
  constructor(
      @InjectModel(Parking.name) private parkingModel: Model<ParkingDocument>,
  ) {}

  async execute(command: EnableParkingSpaceCommand): Promise<Parking> {
    const { parkingNumber } = command;

    //TODO (Larisa) change find one
    return await this.parkingModel.findOneAndUpdate({parkingNumber: parkingNumber}, {enabled: true});
  }
}