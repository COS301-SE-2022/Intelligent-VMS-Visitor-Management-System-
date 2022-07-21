import { GetFreeParkingQuery} from "../impl/getFreeParking.query";
import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Parking, ParkingDocument } from "../../schema/parking.schema";
import { ParkingModule } from "@vms/parking/parking.module";


@QueryHandler(GetFreeParkingQuery)
export class GetFreeParkingQueryHandler implements IQueryHandler {
  constructor(
      @InjectModel(Parking.name) private parkingModel: Model<ParkingDocument>,
  ) {}

  //db stuff for getting free parking
  async execute(query: GetFreeParkingQuery): Promise<ParkingModule[]> {
    return this.parkingModel.find({visitorEmail:"", enabled: true});
  }
}
