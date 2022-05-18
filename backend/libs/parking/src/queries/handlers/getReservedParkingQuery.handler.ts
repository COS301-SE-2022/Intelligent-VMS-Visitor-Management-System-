import { GetReservedParkingQuery} from "../impl/getReservedParking.query";
import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ParkingReservation, ParkingReservationDocument } from "../../schema/reservation.schema";


@QueryHandler(GetReservedParkingQuery)
export class GetAvailableParkingQueryHandler implements IQueryHandler {
  constructor(
      @InjectModel(ParkingReservation.name) private parkingModel: Model<ParkingReservationDocument>,
  ) {}

  //db stuff for getting reserved parking
  async execute(query: GetReservedParkingQuery):Promise<ParkingReservation[]> {
    
    return await this.parkingModel.find();
  }
}
