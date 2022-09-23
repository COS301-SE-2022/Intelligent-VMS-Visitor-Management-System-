import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { GetNumSleepoversQuery } from "../impl/getNumSleepovers.query";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "../../schema/user.schema";

@QueryHandler(GetNumSleepoversQuery)
export class GetNumSleepoversQueryHandler implements IQueryHandler {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) {}

    async execute(query: GetNumSleepoversQuery): Promise<number> {
        const { email } = query;
        const user = await this.userModel.findOne({ email: email });
        return user.numSleepovers;
    }
}
