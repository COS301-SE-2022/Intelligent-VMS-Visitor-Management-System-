import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Invite, InviteDocument } from "../../schema/invite.schema";
import { GetNumberOfCancellationsOfResidentQuery } from "../impl/getNumberOfCancellationsOfResident.query";

//Query class to count the total number of invites that have been sent for admin analytics
@QueryHandler(GetNumberOfCancellationsOfResidentQuery)
export class GetTotalNumberOfCancellationOfResidentQueryHandler implements IQueryHandler {
    constructor(
        @InjectModel(Invite.name) private inviteModel: Model<InviteDocument>,
    ) {}

    async execute(query: GetNumberOfCancellationsOfResidentQuery) {
        const { email } = query;
        const numInvites = await this.inviteModel.find({"$and":[{userEmail: email},{"inviteState":"cancelled"}]}).count();
        return numInvites;
    }
}
