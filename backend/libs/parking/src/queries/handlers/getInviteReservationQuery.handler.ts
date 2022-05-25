import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ParkingReservation, ParkingReservationDocument } from "../../schema/reservation.schema";
import { GetInviteReservationQuery } from "../impl/getInviteReservation.query";


@QueryHandler(GetInviteReservationQuery)
export class GetInviteReservationQueryHandler implements IQueryHandler {
  constructor(
      @InjectModel(ParkingReservation.name) private parkingReservationModel: Model<ParkingReservationDocument>,
  ) {}


  async execute(query: GetInviteReservationQuery):Promise<ParkingReservation> {
    const { invitationID } = query;

    return await this.parkingReservationModel.findOne({invitationID: invitationID});
  }
}
