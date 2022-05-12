import { getAvailableParkingQuery} from "../impl/getAvailableParking.query";
import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Parking, ParkingDocument } from "../../schema/parking.schema";


@QueryHandler(getAvailableParkingQuery)
export class getAvailableParkingQueryHandler implements IQueryHandler {
  constructor(
      @InjectModel(Parking.name) private parkingModel: Model<ParkingDocument>,
  ) {}

  async execute(query: getAvailableParkingQuery):Promise<number> {
    const parkingArr = await this.parkingModel.find();
    return parkingArr.length;
  }
}
