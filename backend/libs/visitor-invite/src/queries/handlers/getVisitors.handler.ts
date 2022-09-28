import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Invite, InviteDocument } from "../../schema/invite.schema";
import { GetVisitorsQuery } from "../impl/getVisitors.query";

@QueryHandler(GetVisitorsQuery)
export class GetVisitorsQueryHandler implements IQueryHandler {
    constructor(
        @InjectModel(Invite.name) private inviteModel: Model<InviteDocument>,
    ) {}

    async execute(query: GetVisitorsQuery) {
        const { email } = query;
        return await this.inviteModel.aggregate([
          {
            '$match': {
              'userEmail': email
            }
          }, {
            '$group': {
              '_id': '$visitorEmail', 
              'visitorName': {
                '$first': '$visitorName'
              }, 
              'numInvites': {
                '$count': {}
              }
            }
          }
        ]);
    }
}
