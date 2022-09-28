import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ParkingReservation, ParkingReservationDocument } from "../../schema/reservation.schema";
import { GetNumberOfReservationsQuery } from "../impl/getNumberOfReservations.query";

@QueryHandler(GetNumberOfReservationsQuery)
export class GetNumberOfReservationsQueryHandler implements IQueryHandler {
  constructor(
      @InjectModel(ParkingReservation.name) private parkingReservationModel: Model<ParkingReservationDocument>,
  ) {}

  async execute(query: GetNumberOfReservationsQuery): Promise<number> {
    const { date } = query;
    return await this.parkingReservationModel.find({ reservationDate: date }).count();
  }
}
