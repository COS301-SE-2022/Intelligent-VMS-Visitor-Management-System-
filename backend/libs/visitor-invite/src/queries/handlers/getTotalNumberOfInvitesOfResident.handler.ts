import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Invite, InviteDocument } from "../../schema/invite.schema";
import { GetNumberOfInvitesOfResidentQuery } from "../impl/getNumberOfInvitesOfResident.query";

//Query class to count the total number of invites that have been sent for admin analytics
@QueryHandler(GetNumberOfInvitesOfResidentQuery)
export class GetTotalNumberOfInvitesOfResidentQueryHandler implements IQueryHandler {
    constructor(
        @InjectModel(Invite.name) private inviteModel: Model<InviteDocument>,
    ) {}

    async execute(query: GetNumberOfInvitesOfResidentQuery) {
        const { email } = query;
        const numInvites = await this.inviteModel.find({userEmail: email}).count();
        return numInvites;
    }
}
