import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "../../schema/user.schema";
import { GetUsersByTypeQuery } from "../impl/getUsersByType.query";

@QueryHandler(GetUsersByTypeQuery)
export class GetUsersByTypeQueryHandler implements IQueryHandler {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) {}

    async execute(query: GetUsersByTypeQuery) {
        const { permission } = query;
        const users = await this.userModel.find({ permission: permission });
        return users;
    }
}

