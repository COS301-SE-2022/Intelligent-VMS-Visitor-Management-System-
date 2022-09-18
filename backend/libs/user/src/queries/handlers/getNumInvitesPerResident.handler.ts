import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { GetNumInvitesPerResidentQuery } from "../impl/getNumInvitesPerResident.query";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "../../schema/user.schema";

@QueryHandler(GetNumInvitesPerResidentQuery)
export class GetNumInvitesPerResidentQueryHandler implements IQueryHandler {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) {}

    async execute(query: GetNumInvitesPerResidentQuery): Promise<number> {
        const user = await this.userModel.findOne({ email: "ADMIN" });
        return user.numInvites;
    }
}
