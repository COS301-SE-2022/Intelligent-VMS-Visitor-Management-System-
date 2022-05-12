import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { GetInviteQuery } from "../impl/getInvite.query";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Invite, InviteDocument } from "../../schema/invite.schema";

@QueryHandler(GetInviteQuery)
export class GetInviteQueryHandler implements IQueryHandler {
    constructor(@InjectModel(Invite.name) private inviteModel: Model<InviteDocument>) {}

    async execute(query: GetInviteQuery) {
        const { inviteID } = query; 
        const invite = await this.inviteModel.findOne({ inviteID: inviteID });
        return invite;
    }
}
