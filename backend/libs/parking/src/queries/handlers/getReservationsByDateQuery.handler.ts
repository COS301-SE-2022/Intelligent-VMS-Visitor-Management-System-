import { InjectModel } from "@nestjs/mongoose";
import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { Model } from "mongoose";
import { ParkingReservation, ParkingReservationDocument } from "../../schema/reservation.schema";
import { GetReservationsByDateQuery } from "../impl/getReservationsByDate.query";

@QueryHandler(GetReservationsByDateQuery)
export class GetReservationsByDateQueryHandler implements IQueryHandler {
  constructor(
      @InjectModel(ParkingReservation.name) private parkingReservationModel: Model<ParkingReservationDocument>,
  ) {}

  async execute(query: GetReservationsByDateQuery):Promise<ParkingReservation[]> {
    const { date } = query;
    const reservations = await this.parkingReservationModel.find({ reservationDate: date });
    return reservations;
  }
}
