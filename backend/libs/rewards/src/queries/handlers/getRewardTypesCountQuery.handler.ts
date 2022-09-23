import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

import { Reward, RewardsDocument } from "../../schema/reward.schema";
import { GetRewardTypesCountQuery } from "../impl/getRewardTypesCount.query";

@QueryHandler(GetRewardTypesCountQuery)
export class GetRewardTypesCountQueryHandler implements IQueryHandler {
    constructor(@InjectModel(Reward.name) private rewardModel: Model<RewardsDocument>) {}

    async execute(query: GetRewardTypesCountQuery) {
        const project = await this.rewardModel.aggregate([{"$group": {"_id": "$type", "count":{"$sum": 1}}}]);
        return project;
    }
}
