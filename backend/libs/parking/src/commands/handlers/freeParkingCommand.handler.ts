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

  //db stuff for freeing up parking
  async execute(command: FreeParkingCommand): Promise<Parking> {
    const { parkingNumber } = command;

    //TODO (Larisa) change find one

    //set visitorEmail = "" since no visitor is occupying the space anymore
    return await this.parkingModel.findOneAndUpdate({parkingNumber: parkingNumber}, {visitorEmail: ""});
  }
}