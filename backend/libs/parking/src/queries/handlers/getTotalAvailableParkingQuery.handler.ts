import { getTotalAvailableParkingQuery} from "../impl/getTotalAvailableParking.query";
import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Parking, ParkingDocument } from "../../schema/parking.schema";


@QueryHandler(getTotalAvailableParkingQuery)
export class getTotalAvailableParkingQueryHandler implements IQueryHandler {
  constructor(
      @InjectModel(Parking.name) private parkingModel: Model<ParkingDocument>,
  ) {}

  //db stuff for getting avail parking
  async execute(query: getTotalAvailableParkingQuery):Promise<number> {
    const parking = await this.parkingModel.countDocuments({enabled: true});
    return parking;
  }
}
