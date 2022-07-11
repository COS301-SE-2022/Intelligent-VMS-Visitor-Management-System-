import { GetParkingQuery} from "../impl/getParking.query";
import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Parking, ParkingDocument } from "../../schema/parking.schema";


@QueryHandler(GetParkingQuery)
export class GetParkingQueryHandler implements IQueryHandler {
  constructor(
      @InjectModel(Parking.name) private parkingModel: Model<ParkingDocument>,
  ) {}

  //db stuff for getting avail parking
  async execute(query: GetParkingQuery):Promise<Parking> {
    const { parkingNumber } = query;
    const parking = await this.parkingModel.findById({parkingNumber: parkingNumber});
    return parking;
  }
}
