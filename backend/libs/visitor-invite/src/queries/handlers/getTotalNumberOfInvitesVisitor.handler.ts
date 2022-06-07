import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Invite, InviteDocument } from "../../schema/invite.schema";
import { GetTotalNumberOfInvitesVisitorQuery } from "../impl/getTotalNumberOfInvitesVisitor.query";

@QueryHandler(GetTotalNumberOfInvitesVisitorQuery)
export class GetTotalNumberOfInvitesVisitorQueryHandler implements IQueryHandler {
    constructor(
        @InjectModel(Invite.name) private inviteModel: Model<InviteDocument>,
    ) {}

    async execute(query: GetTotalNumberOfInvitesVisitorQuery) {
        const { email } = query;
        const numInvites = await this.inviteModel.find({visitorEmail: email}).count();
        return numInvites;
    }
}

