import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ParkingReservation, ParkingReservationDocument } from "../../schema/reservation.schema";
import { GetParkingReservationsQuery } from "../impl/getParkingReservations.query";


@QueryHandler(GetParkingReservationsQuery)
export class GetParkingReservationsQueryHandler implements IQueryHandler {
  constructor(
      @InjectModel(ParkingReservation.name) private parkingReservationModel: Model<ParkingReservationDocument>,
  ) {}

  async execute(query: GetParkingReservationsQuery):Promise<ParkingReservation[]> {
    const { parkingNumber } = query;

    return await this.parkingReservationModel.find({parkingNumber: parkingNumber});
  }
}
