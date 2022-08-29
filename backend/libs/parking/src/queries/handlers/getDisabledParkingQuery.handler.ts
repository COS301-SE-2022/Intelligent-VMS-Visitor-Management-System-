import {getDisabledParkingQuery } from "../impl/getDisabledParking.query";
import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Parking, ParkingDocument } from "../../schema/parking.schema";
import { ParkingModule } from "@vms/parking/parking.module";


@QueryHandler(getDisabledParkingQuery)
export class getDisabledParkingQueryHandler implements IQueryHandler {
  constructor(
      @InjectModel(Parking.name) private parkingModel: Model<ParkingDocument>,
  ) {}

  //db stuff for getting disabled parking
  async execute(query: getDisabledParkingQuery):Promise<ParkingModule[]> {
    return this.parkingModel.find({enabled: false});
  }
}
