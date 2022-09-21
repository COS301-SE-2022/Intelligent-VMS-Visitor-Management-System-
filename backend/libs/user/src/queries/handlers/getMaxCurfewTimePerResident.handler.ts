import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { GetMaxCurfewTimePerResidentQuery } from "../impl/getMaxCurfewTimePerResident.query";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "../../schema/user.schema";

@QueryHandler(GetMaxCurfewTimePerResidentQuery)
export class GetMaxCurfewTimePerResidentQueryHandler implements IQueryHandler {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) {}

    async execute(query: GetMaxCurfewTimePerResidentQuery): Promise<number> {
        const user = await this.userModel.findOne({ permission: 0 });
        return user.curfewTime;
    }
}
