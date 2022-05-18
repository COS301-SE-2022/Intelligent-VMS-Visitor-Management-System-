import { getFreeParkingQuery} from "../impl/getFreeParking.query";
import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Parking, ParkingDocument } from "../../schema/parking.schema";
import { ParkingModule } from "@vms/parking/parking.module";


@QueryHandler(getFreeParkingQuery)
export class getFreeParkingQueryHandler implements IQueryHandler {
  constructor(
      @InjectModel(Parking.name) private parkingModel: Model<ParkingDocument>,
  ) {}

  async execute(query: getFreeParkingQuery): Promise<ParkingModule[]> {
    //db stuff for getting free parking

    return await this.parkingModel.find({reservationInviteID:""});
  }
}
