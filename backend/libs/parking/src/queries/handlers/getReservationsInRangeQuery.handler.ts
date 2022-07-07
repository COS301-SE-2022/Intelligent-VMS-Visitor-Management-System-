import { InjectModel } from "@nestjs/mongoose";
import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { Model } from "mongoose";
import { ParkingReservation, ParkingReservationDocument } from "../../schema/reservation.schema";
import { GetReservationsInRangeQuery } from "../impl/getReservationsInRange.query";

@QueryHandler(GetReservationsInRangeQuery)
export class GetReservationsInRangeQueryHandler implements IQueryHandler {
  constructor(
      @InjectModel(ParkingReservation.name) private parkingReservationModel: Model<ParkingReservationDocument>,
  ) {}

  async execute(query: GetReservationsInRangeQuery):Promise<ParkingReservation[]> {
    const { startDate, endDate } = query;
    const reservations = await this.parkingReservationModel.find({ $and: [{inviteDate: {$gte: startDate}}, {inviteDate: {$lte: endDate}}] });
    return reservations;
  }
}
