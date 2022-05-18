import { GetReservedParkingQuery} from "../impl/getReservedParking.query";
import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Parking, ParkingDocument } from "../../schema/parking.schema";


@QueryHandler(GetReservedParkingQuery)
export class GetAvailableParkingQueryHandler implements IQueryHandler {
  constructor(
      @InjectModel(Parking.name) private parkingModel: Model<ParkingDocument>,
  ) {}

  //db stuff for getting reserved parking
  async execute(query: GetReservedParkingQuery):Promise<Parking[]> {
    
    return await this.parkingModel.find( { reservationInviteID: { $ne: "" } } );
  }
}
