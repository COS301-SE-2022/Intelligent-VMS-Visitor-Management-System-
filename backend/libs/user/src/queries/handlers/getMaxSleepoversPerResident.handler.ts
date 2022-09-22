import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { GetMaxSleepoversPerResidentQuery } from "../impl/getMaxSleepoversPerResident.query";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "../../schema/user.schema";

@QueryHandler(GetMaxSleepoversPerResidentQuery)
export class GetMaxSleepoversPerResidentQueryHandler implements IQueryHandler {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) {}

    async execute(query: GetMaxSleepoversPerResidentQuery): Promise<number> {
        const user = await this.userModel.findOne({ permission: 0 });
        return user.numSleepovers;
    }
}
