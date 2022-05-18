import { GetReservedParkingQuery} from "../impl/getReservedParking.query";
import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ParkingReservation, ParkingReservationDocument } from "../../schema/reservation.schema";


@QueryHandler(GetReservedParkingQuery)
export class GetReservedParkingQueryHandler implements IQueryHandler {
  constructor(
      @InjectModel(ParkingReservation.name) private parkingReservationModel: Model<ParkingReservationDocument>,
  ) {}

  async execute(query: GetReservedParkingQuery):Promise<ParkingReservation[]> {
    
    return await this.parkingReservationModel.find();
  }
}
