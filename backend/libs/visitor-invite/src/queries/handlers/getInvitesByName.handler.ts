import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { GetInvitesByNameQuery } from "../impl/getInvitesByName.query";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Invite, InviteDocument } from "../../schema/invite.schema";

@QueryHandler(GetInvitesByNameQuery)
export class GetInvitesByNameQueryHandler implements IQueryHandler {
    constructor(@InjectModel(Invite.name) private inviteModel: Model<InviteDocument>) {}

    async execute(query: GetInvitesByNameQuery) {
        const { name } = query;
        return await this.inviteModel.aggregate(([{ $search: { "autocomplete": { "path": "visitorName", "query": name} } }, { $limit: 20 }, {$group: { _id: "$visitorEmail", visitorEmail: {$first: "$visitorEmail"}, visitorName: { $first: "$visitorName" }}}])); 
    }
}
