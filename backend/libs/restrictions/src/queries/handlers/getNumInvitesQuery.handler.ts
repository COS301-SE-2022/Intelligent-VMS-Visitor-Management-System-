import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

import { Restriction, RestrictionDocument } from "../../schema/restriction.schema";
import { GetNumInvitesQuery } from "../impl/getNumInvites.query";

@QueryHandler(GetNumInvitesQuery)
export class GetNumInvitesQueryHandler implements IQueryHandler {
    constructor(@InjectModel(Restriction.name) private restrictionModel: Model<RestrictionDocument>) {}

    async execute(query: GetNumInvitesQuery) {
        return await this.restrictionModel.findOne({ name: "numInvites" });
    }
}
