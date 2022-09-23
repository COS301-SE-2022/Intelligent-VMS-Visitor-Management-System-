import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

import { Reward, RewardsDocument } from "../../schema/reward.schema";
import { GetAllRewardsQuery } from "../impl/getAllRewards.query";

@QueryHandler(GetAllRewardsQuery)
export class GetAllRewardsQueryHandler implements IQueryHandler {
    constructor(@InjectModel(Reward.name) private rewardModel: Model<RewardsDocument>) {}

    async execute(query: GetAllRewardsQuery) {
        return await this.rewardModel.find({});
    }
}
