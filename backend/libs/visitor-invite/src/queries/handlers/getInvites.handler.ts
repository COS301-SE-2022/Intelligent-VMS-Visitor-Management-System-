import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { GetInvitesQuery } from "../impl/getInvites.query";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Invite, InviteDocument } from "../../schema/invite.schema";

@QueryHandler(GetInvitesQuery)
export class GetInvitesQueryHandler implements IQueryHandler {
    constructor(@InjectModel(Invite.name) private inviteModel: Model<InviteDocument>) {}

    async execute(query: GetInvitesQuery) {
        const { email } = query;
        const invites = await this.inviteModel.find({ userEmail: email });
        return invites;
    }
}
