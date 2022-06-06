import { GetReservationsQuery} from "../impl/getReservations.query";
import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ParkingReservation, ParkingReservationDocument } from "../../schema/reservation.schema";

@QueryHandler(GetReservationsQuery)
export class GetReservationsQueryHandler implements IQueryHandler {
  constructor(
      @InjectModel(ParkingReservation.name) private parkingReservationModel: Model<ParkingReservationDocument>,
  ) {}

  async execute(query: GetReservationsQuery):Promise<ParkingReservation[]> {
    return await this.parkingReservationModel.find();
  }
}
