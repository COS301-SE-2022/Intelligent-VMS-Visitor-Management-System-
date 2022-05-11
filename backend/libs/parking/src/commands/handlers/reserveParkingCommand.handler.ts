import { ReserveParkingCommand } from "../impl/reserveParking.command";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Parking, ParkingDocument } from "../../schema/parking.schema";


@CommandHandler(ReserveParkingCommand)
export class ReserveParkingCommandHandler implements ICommandHandler<ReserveParkingCommand> {
  constructor(
      @InjectModel(Parking.name) private parkingModel: Model<ParkingDocument>,
  ) {}

  async execute(command: ReserveParkingCommand) {

    //what does this do
    const { reserverID, reservationDate, parkingNumber } = command;

    //let parkingSpace = new Parking();
    await this.parkingModel.findByIdAndUpdate();

    //do what is required to reserve parking
  }
}
