import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

import { Invite, InviteDocument } from "../../schema/invite.schema";
import { GetInviteForSignInDataQuery } from "../impl/getInviteForSignInData.query";

@QueryHandler(GetInviteForSignInDataQuery)
export class GetInviteForSignInDataQueryHandler implements IQueryHandler {
    constructor(@InjectModel(Invite.name) private inviteModel: Model<InviteDocument>) {}

    async execute(query: GetInviteForSignInDataQuery) {
        const { idNumber, inviteDate } = query; 
        const invite = await this.inviteModel.findOne({ idNumber: idNumber, inviteDate: inviteDate, inviteState: "inActive"});
        return invite;
    }
}

