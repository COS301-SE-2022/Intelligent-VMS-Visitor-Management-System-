import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Invite, InviteDocument } from "../../schema/invite.schema";
import { GetNumberOfVisitsOfResidentQuery } from "../impl/getNumberOfVisitsOfResident.query";

@QueryHandler(GetNumberOfVisitsOfResidentQuery)
export class GetTotalNumberOfVisitsOfResidentQueryHandler implements IQueryHandler {
    constructor(
        @InjectModel(Invite.name) private inviteModel: Model<InviteDocument>,
    ) {}

    async execute(query: GetNumberOfVisitsOfResidentQuery) {
        const { email } = query;
        const numVisits = await this.inviteModel.find({"$and":[{userEmail: email},{"inviteState":"signedOut"}]}).count();
        return numVisits;
    }
}
