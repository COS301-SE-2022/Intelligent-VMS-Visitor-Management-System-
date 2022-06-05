import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { GetInvitesInRangeByEmailQuery } from "../impl/getInvitesInRangeByEmail.query";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Invite, InviteDocument } from "../../schema/invite.schema";

@QueryHandler(GetInvitesInRangeByEmailQuery)
export class GetInvitesInRangeQueryHandler implements IQueryHandler {
    constructor(@InjectModel(Invite.name) private inviteModel: Model<InviteDocument>) {}

    async execute(query: GetInvitesInRangeByEmailQuery) {
        const { dateStart, dateEnd, email } = query;
        const invites = await this.inviteModel.find({ $and: [{inviteDate: {$gte: dateStart}}, {inviteDate: {$lte: dateEnd}}] });
        return invites;
    }
}
