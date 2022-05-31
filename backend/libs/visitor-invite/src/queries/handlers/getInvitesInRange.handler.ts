import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { GetInvitesInRangeQuery } from "../impl/getInvitesInRange.query";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Invite, InviteDocument } from "../../schema/invite.schema";

@QueryHandler(GetInvitesInRangeQuery)
export class GetInvitesInRangeQueryHandler implements IQueryHandler {
    constructor(@InjectModel(Invite.name) private inviteModel: Model<InviteDocument>) {}

    async execute(query: GetInvitesInRangeQuery) {
        const { dateStart, dateEnd } = query;
        const invites = await this.inviteModel.find({ $and: [{inviteDate: {$gte: dateStart}}, {inviteDate: {$lte: dateEnd}}] });
        return invites;
    }
}
