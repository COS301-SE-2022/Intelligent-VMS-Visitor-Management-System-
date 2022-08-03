import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { GetInvitesInRangeByEmailQuery } from "../impl/getInvitesInRangeByEmail.query";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Invite, InviteDocument } from "../../schema/invite.schema";

@QueryHandler(GetInvitesInRangeByEmailQuery)
export class GetInvitesInRangeByEmailQueryHandler implements IQueryHandler {
    constructor(@InjectModel(Invite.name) private inviteModel: Model<InviteDocument>) {}

    async execute(query: GetInvitesInRangeByEmailQuery) {
        const { dateStart, dateEnd, email } = query;
        return await this.inviteModel.find({ $and: [{ $and: [{inviteDate: {$gte: dateStart}},{inviteDate: {$lte: dateEnd}}]}, { userEmail: email }]})
    }
}
