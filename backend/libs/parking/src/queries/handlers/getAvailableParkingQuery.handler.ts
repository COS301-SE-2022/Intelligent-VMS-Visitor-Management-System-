import { GetAvailableParkingQuery} from "../impl/getAvailableParking.query";
import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Parking, ParkingDocument } from "../../schema/parking.schema";


@QueryHandler(GetAvailableParkingQuery)
export class GetAvailableParkingQueryHandler implements IQueryHandler {
  constructor(
      @InjectModel(Parking.name) private parkingModel: Model<ParkingDocument>,
  ) {}

  //db stuff for getting avail parking
  async execute(query: GetAvailableParkingQuery):Promise<number> {
    const parkingArr = await this.parkingModel.find();
    return parkingArr.length;
  }
}
