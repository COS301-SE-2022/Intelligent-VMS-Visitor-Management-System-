import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Parking, ParkingDocument } from "../../schema/parking.schema";
import { EnableParkingCommand } from "../impl/enableParking.command";


@CommandHandler(EnableParkingCommand)
export class EnableParkingCommandHandler implements ICommandHandler<EnableParkingCommand> {
  constructor(
      @InjectModel(Parking.name) private parkingModel: Model<ParkingDocument>,
  ) {}

  async execute(command: EnableParkingCommand): Promise<Parking> {
    const { parkingNumber } = command;

    //TODO (Larisa) change find one
    
    return await this.parkingModel.findOneAndUpdate({parkingNumber: parkingNumber}, {enabled: true});
  }
}