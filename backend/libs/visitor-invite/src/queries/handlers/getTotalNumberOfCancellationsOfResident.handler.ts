import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Invite, InviteDocument } from "../../schema/invite.schema";
import { GetNumberOfCancellationsOfResidentQuery } from "../impl/getNumberOfCancellationsOfResident.query";

@QueryHandler(GetNumberOfCancellationsOfResidentQuery)
export class GetTotalNumberOfCancellationsOfResidentQueryHandler implements IQueryHandler {
    constructor(
        @InjectModel(Invite.name) private inviteModel: Model<InviteDocument>,
    ) {}

    async execute(query: GetNumberOfCancellationsOfResidentQuery) {
        const { email } = query;
        const numCancellations = await this.inviteModel.find({"$and":[{userEmail: email},{"inviteState":"cancelled"}]}).count();
        return numCancellations;
    }
}
