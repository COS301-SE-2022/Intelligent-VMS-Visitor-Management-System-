import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { GetActiveInvitesInDateRangeQuery } from "../impl/getActiveInvitesInDateRange.query";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Invite, InviteDocument } from "../../schema/invite.schema";

@QueryHandler(GetActiveInvitesInDateRangeQuery)
export class GetActiveInvitesInDateRangeQueryHandler implements IQueryHandler {
    constructor(@InjectModel(Invite.name) private inviteModel: Model<InviteDocument>) {}

    async execute(query: GetActiveInvitesInDateRangeQuery) {
        const { dateStart, dateEnd } = query;
        const invites = await this.inviteModel.find({ $and: [{inviteDate: {$gte: dateStart}}, {inviteDate: {$lte: dateEnd}}, {inviteState: { $ne: "inActive" }}] });
        return invites;
    }
}
