import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Invite, InviteDocument } from "../../schema/invite.schema";
import { GetVisitorVisitsQuery } from "../impl/getVisitorVisits.query";

@QueryHandler(GetVisitorVisitsQuery)
export class GetVisitorVisitsQueryHandler implements IQueryHandler {
    constructor(
        @InjectModel(Invite.name) private inviteModel: Model<InviteDocument>,
    ) {}

    async execute(query: GetVisitorVisitsQuery) {
        const { email } = query;
        return await this.inviteModel.aggregate([
          {
            '$match': {
              'userEmail': email
            }
          },
          {
            '$group': {
                '_id': '$visitorEmail', 
                'visitorName': {
                    '$first': '$visitorName'
                }, 
                'idNumber': {
                  '$last': '$idNumber'
                }, 
                'idDocType': {
                  '$last': '$idDocType'
                }, 
                'numInvites': {
                '$count': {}
                },
                'visits': 
                {   
                    '$push': '$inviteDate'   
                }
            }
          }
        ]);
    }
}
