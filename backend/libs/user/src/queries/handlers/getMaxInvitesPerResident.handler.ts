import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { GetMaxInvitesPerResidentQuery } from "../impl/getMaxInvitesPerResident.query";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "../../schema/user.schema";

@QueryHandler(GetMaxInvitesPerResidentQuery)
export class GetMaxInvitesPerResidentQueryHandler implements IQueryHandler {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) {}

    async execute(query: GetMaxInvitesPerResidentQuery): Promise<number> {
        const user = await this.userModel.findOne({ permission: 0 });
        return user.numInvites;
    }
}
