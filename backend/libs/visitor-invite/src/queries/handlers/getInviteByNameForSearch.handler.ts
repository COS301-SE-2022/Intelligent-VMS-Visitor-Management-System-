import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { GetInviteByNameQuery } from "../impl/getInviteByNameForSearch.query";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Invite, InviteDocument } from "../../schema/invite.schema";

@QueryHandler(GetInviteByNameQuery)
export class GetInviteByNameForSearchQueryHandler implements IQueryHandler {
    constructor(@InjectModel(Invite.name) private inviteModel: Model<InviteDocument>) {}

    async execute(query: GetInviteByNameQuery) {
        const { name } = query; 
        const invite = await this.inviteModel.findOne({ name: name });
        return invite;
    }
}
