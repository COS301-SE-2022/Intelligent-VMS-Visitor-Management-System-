import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "../../schema/user.schema";
import { GetNumThemesQuery } from "../impl/getNumThemes.query";

@QueryHandler(GetNumThemesQuery)
export class GetNumThemesQueryHandler implements IQueryHandler {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) {}

    async execute(query: GetNumThemesQuery): Promise<number> {
        const { email } = query;
        const user = await this.userModel.findOne({ email: email });
        return user.numThemes;
    }
}
