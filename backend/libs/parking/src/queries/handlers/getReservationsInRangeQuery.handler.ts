import { InjectModel } from "@nestjs/mongoose";
import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { Model } from "mongoose";
import { ParkingReservation, ParkingReservationDocument } from "../../schema/reservation.schema";
import { GetReservationInRangeQuery } from "../impl/getReservationsInRange.query";

@QueryHandler(GetReservationInRangeQuery)
export class GetReservationsInRangeQueryHandler implements IQueryHandler {
  constructor(
      @InjectModel(ParkingReservation.name) private parkingReservationModel: Model<ParkingReservationDocument>,
  ) {}

  async execute(query: GetReservationInRangeQuery):Promise<ParkingReservation[]> {
    const { startDate, endDate } = query;
    const data = await this.parkingReservationModel.aggregate([
        {$lookup: { from: "invites", localField: "invitationID", foreignField: "inviteID", as: "inviteData"}},
    ]);

    return data.filter((dataVal) => {
        return dataVal.inviteData.length > 0 && (dataVal.inviteData[0]?.inviteDate >= startDate && dataVal.inviteData[0]?.inviteDate <= endDate);
    });
  }
}
