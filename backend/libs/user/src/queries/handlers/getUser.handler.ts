import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { GetUserQuery } from "../impl/getUser.query";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "../../schema/user.schema";

@QueryHandler(GetUserQuery)
export class GetUserQueryHandler implements IQueryHandler {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) {}

    async execute(query: GetUserQuery) {
        const { email } = query;
        const user = await this.userModel.findOne({ email: email });
        return user;
    }
}
