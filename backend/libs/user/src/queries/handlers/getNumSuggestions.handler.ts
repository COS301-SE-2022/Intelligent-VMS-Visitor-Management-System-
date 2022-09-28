import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { GetNumSuggestionsQuery } from "../impl/getNumSuggestions.query";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "../../schema/user.schema";

@QueryHandler(GetNumSuggestionsQuery)
export class GetNumSuggestionsQueryHandler implements IQueryHandler {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) {}

    async execute(query: GetNumSuggestionsQuery): Promise<number> {
        const { email } = query;
        const user = await this.userModel.findOne({ email: email });
        return user.suggestions;
    }
}
