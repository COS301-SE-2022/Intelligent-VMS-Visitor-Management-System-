import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Invite, InviteDocument } from "../../schema/invite.schema";
import { GetNumberOfOpenInvitesQuery } from "../impl/getNumberOfOpenInvites.query";

//Query class to count the total number of invites that have been sent for admin analytics
@QueryHandler(GetNumberOfOpenInvitesQuery)
export class GetNumberOfOpenInvitesQueryHandler implements IQueryHandler {
    constructor(
        @InjectModel(Invite.name) private inviteModel: Model<InviteDocument>,
    ) {}

    async execute(query: GetNumberOfOpenInvitesQuery) {
        const { email, date } = query;
        const numInvites = await this.inviteModel.find({ userEmail: email, inviteDate: { $gte: date}, inviteState: "inActive" }).count();
        return numInvites;
    }
}
