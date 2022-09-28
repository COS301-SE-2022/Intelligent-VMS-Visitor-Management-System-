import { ReserveParkingCommand } from "../impl/reserveParking.command";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ParkingReservation, ParkingReservationDocument } from "../../schema/reservation.schema";

@CommandHandler(ReserveParkingCommand)
export class ReserveParkingCommandHandler implements ICommandHandler<ReserveParkingCommand> {
  constructor(
      @InjectModel(ParkingReservation.name) private parkingReservationModel: Model<ParkingReservationDocument>,
  ) {}

  //db stuff for reserving parking
  async execute(command: ReserveParkingCommand):Promise<ParkingReservation> {
    const { invitationID, parkingNumber, reservationDate } = command;

    const parkingReservation = new ParkingReservation();
    parkingReservation.invitationID = invitationID;
    parkingReservation.parkingNumber = parkingNumber;
    parkingReservation.reservationDate = reservationDate;
    parkingReservation.activated = false;

    return await this.parkingReservationModel.create(parkingReservation);

  }
}
