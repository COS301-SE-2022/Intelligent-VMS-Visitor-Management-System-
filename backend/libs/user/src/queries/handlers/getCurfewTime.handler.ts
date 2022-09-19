import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { GetCurfewTimeQuery } from "../impl/getCurfewTime.query";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "../../schema/user.schema";

@QueryHandler(GetCurfewTimeQuery)
export class GetCurfewTimeQueryHandler implements IQueryHandler {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) {}

    async execute(query: GetCurfewTimeQuery): Promise<number> {
        const { email } = query;
        const user = await this.userModel.findOne({ email: email });
        return user.curfewTime;
    }
}
