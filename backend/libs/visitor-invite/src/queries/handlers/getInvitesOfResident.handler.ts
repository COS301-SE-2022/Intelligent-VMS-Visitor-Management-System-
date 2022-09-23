import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Invite, InviteDocument } from "../../schema/invite.schema";
import { GetInvitesOfResidentQuery } from "../impl/getInvitesOfResident.query";

//Query class to count the total number of invites that have been sent for admin analytics
@QueryHandler(GetInvitesOfResidentQuery)
export class GetInvitesOfResidentQueryHandler implements IQueryHandler {
    constructor(
        @InjectModel(Invite.name) private inviteModel: Model<InviteDocument>,
    ) {}

    async execute(query: GetInvitesOfResidentQuery) {
        const { email } = query;
        const invites = await this.inviteModel.find({userEmail: email});
        return invites;
    }
}
