import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

import {
    Restriction,
    RestrictionDocument,
} from "../../schema/restriction.schema";
import { GetMaxSleepoversQuery } from "../impl/getMaxSleepovers.query";

@QueryHandler(GetMaxSleepoversQuery)
export class GetMaxSleepoversQueryHandler implements IQueryHandler {
    constructor(
        @InjectModel(Restriction.name)
        private restrictionModel: Model<RestrictionDocument>,
    ) {}

    async execute(query: GetMaxSleepoversQuery) {
        return await this.restrictionModel.findOne({ name: "sleepovers" });
    }
}
