import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { GroupParking, GroupParkingDocument } from "../../schema/groupParking.schema";
import { ParkingReservation, ParkingReservationDocument } from "../../schema/reservation.schema";
import { GroupParkingCommand } from "../impl/groupParking.command";

@CommandHandler(GroupParkingCommand)
export class GroupParkingCommandHandler implements ICommandHandler<GroupParkingCommand> {
  constructor(
      @InjectModel(GroupParking.name) private groupParkingModel: Model<GroupParkingDocument>,
      @InjectModel(ParkingReservation.name) private reservationModel: Model<ParkingReservationDocument>
  ) {}

  async execute(command: GroupParkingCommand) {
    const { date } = command;
    
    const numReservations = await this.reservationModel.countDocuments({
        reservationDate: date
    });

    await this.groupParkingModel.create({ _id: date, numParking: numReservations });      
  }
}

