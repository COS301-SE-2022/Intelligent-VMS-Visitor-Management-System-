import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { GetNumberVisitorQuery } from "../impl/getNumberOfVisitors.query";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Invite, InviteDocument } from "../../schema/invite.schema";

@QueryHandler(GetNumberVisitorQuery)
export class getNumberOfVisitors implements IQueryHandler {
    constructor(
        @InjectModel(Invite.name) private inviteModel: Model<InviteDocument>,
    ) {}

    async execute(query: GetNumberVisitorQuery) {
        const numInvites = await this.inviteModel.count();
        return numInvites;
    }
}