import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Invite, InviteDocument } from "../../schema/invite.schema";
import { GetMostUsedInviteDataQuery } from "../impl/getMostUsedInviteData.query";

@QueryHandler(GetMostUsedInviteDataQuery)
export class GetMostUsedInviteDataQueryHandler implements IQueryHandler {
    constructor(
        @InjectModel(Invite.name) private inviteModel: Model<InviteDocument>,
    ) {}

    async execute(query: GetMostUsedInviteDataQuery) {
        const { email } = query;
        return await this.inviteModel.aggregate(
            [
  {
    '$match': {
      'visitorEmail': email
    }
  }, {
    '$group': {
      '_id': '$idDocType', 
      'count': {
        '$count': {}
      }, 
      'visitorEmail': {
        '$first': '$visitorEmail'
      }, 
      'idNumber': {
        '$first': '$idNumber'
      }, 
      'visitorName': {
        '$first': '$visitorName'
      }
    }
  }, {
    '$sort': {
      'count': -1
    }
  }
]
        );
    }
}

