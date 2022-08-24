import { ActivateReservationCommand } from "../impl/activateReservation.command";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Parking, ParkingDocument } from "../../schema/parking.schema";


@CommandHandler(ActivateReservationCommand)
export class ActivateReservationCommandHandler implements ICommandHandler<ActivateReservationCommand> {
  constructor(
      @InjectModel(Parking.name) private parkingModel: Model<ParkingDocument>,
  ) {}

  //db stuff for freeing up parking
  async execute(command: ActivateReservationCommand): Promise<Parking> {
    const { id } = command;

    return await this.parkingModel.findOneAndUpdate({_id: id}, {activated: true});
  }
}