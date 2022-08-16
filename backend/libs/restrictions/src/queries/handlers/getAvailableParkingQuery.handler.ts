import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

import { Restriction, RestrictionDocument } from "../../schema/restriction.schema";
//import { GetNumInvitesQuery } from "../impl/getNumInvites.query";
import {GetAvailableParkingQuery} from "../impl/getAvailableParking.query";

@QueryHandler(GetAvailableParkingQuery)
export class GetAvailableParkingQueryHandler implements IQueryHandler {
    constructor(@InjectModel(Restriction.name) private restrictionModel: Model<RestrictionDocument>) {}

    async execute(query: GetAvailableParkingQuery) {
        return await this.restrictionModel.findOne({ name: "numAvailableParking" });
    }
}
