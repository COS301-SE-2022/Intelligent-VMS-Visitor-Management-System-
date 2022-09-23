import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Invite, InviteDocument } from "../../schema/invite.schema";
import { GetNumberOfSleepoversOfResidentQuery } from "../impl/getNumberOfSleepoversOfResident.query";

@QueryHandler(GetNumberOfSleepoversOfResidentQuery)
export class GetNumberOfSleepoversOfResidentQueryHandler implements IQueryHandler {
    constructor(
        @InjectModel(Invite.name) private inviteModel: Model<InviteDocument>,
    ) {}

    async execute(query: GetNumberOfSleepoversOfResidentQuery) {
        const { email } = query;
        //TODO(Larisa): HOW
        const numCancellations = await this.inviteModel.find({"$and":[{userEmail: email},{"inviteState":"cancelled"}]}).count();
        return numCancellations;
    }
}
