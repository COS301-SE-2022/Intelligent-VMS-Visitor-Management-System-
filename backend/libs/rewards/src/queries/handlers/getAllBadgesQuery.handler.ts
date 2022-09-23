import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

import { Badge, BadgeDocument } from "../../schema/badge.schema";
import { GetAllBadgesQuery } from "../impl/getAllBadges.query";

@QueryHandler(GetAllBadgesQuery)
export class GetAllBadgesQueryHandler implements IQueryHandler {
    constructor(@InjectModel(Badge.name) private badgeModel: Model<BadgeDocument>) {}

    async execute(query: GetAllBadgesQuery) {
        return await this.badgeModel.find({});
    }
}
