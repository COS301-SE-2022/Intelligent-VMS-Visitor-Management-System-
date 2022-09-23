import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { GetNumInvitesQuery } from "../impl/getNumInvites.query";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "../../schema/user.schema";

@QueryHandler(GetNumInvitesQuery)
export class GetNumInvitesQueryHandler implements IQueryHandler {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) {}

    async execute(query: GetNumInvitesQuery): Promise<number> {
        const { email } = query;
        const user = await this.userModel.findOne({ email: email });
        return user.numInvites;
    }
}
