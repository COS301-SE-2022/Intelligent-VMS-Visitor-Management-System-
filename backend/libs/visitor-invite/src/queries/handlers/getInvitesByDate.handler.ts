import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { GetInvitesByDateQuery } from "../impl/getInvitesByDate.query";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Invite, InviteDocument } from "../../schema/invite.schema";

@QueryHandler(GetInvitesByDateQuery)
export class GetInvitesByDateQueryHandler implements IQueryHandler {
    constructor(@InjectModel(Invite.name) private inviteModel: Model<InviteDocument>) {}

    async execute(query: GetInvitesByDateQuery) {
        const { date } = query;
        const invites = await this.inviteModel.find({$and: [{$or: [{inviteDate: date},{inviteState: "extended"}]}, {inviteID: {$exists: true}}]});
        return invites;
    }
}
