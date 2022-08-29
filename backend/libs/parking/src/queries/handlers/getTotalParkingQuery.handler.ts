import {getTotalParkingQuery} from "../impl/getTotalParking.query";
import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Parking, ParkingDocument } from "../../schema/parking.schema";

@QueryHandler(getTotalParkingQuery)
export class getTotalParkingQueryHandler implements IQueryHandler {
  constructor(
      @InjectModel(Parking.name) private parkingModel: Model<ParkingDocument>,
  ) {}

  //db stuff for getting ALL parking spaces
  async execute(query: getTotalParkingQuery):Promise<number> {
    const parking = await this.parkingModel.countDocuments();
    return parking;
  }
}