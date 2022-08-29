import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Invite, InviteDocument } from "../../schema/invite.schema";
import { GetInvitesForUsersQuery } from "../impl/getInvitesForUsers.query";

@QueryHandler(GetInvitesForUsersQuery)
export class GetInvitesForUsersQueryHandler implements IQueryHandler {
    constructor(@InjectModel(Invite.name) private inviteModel: Model<InviteDocument>) {}

    async execute(query: GetInvitesForUsersQuery) {
        const { users } = query;
        return this.inviteModel.aggregate([
          {
            '$match': {
              'userEmail': {
                '$in': users
              }
            }
          }, {
            '$group': {
              '_id': '$userEmail', 
              'numInvites': {
                '$sum': 1
              }, 
              'numVisitors': {
                '$sum': {
                  '$cond': [
                    {
                      '$eq': [
                        '$inviteState', 'signedOut'
                      ]
                    }, 1, 0
                  ]
                }
              },
              'firstDate': {
                '$max': '$inviteDate'
              },
            }
          }
        ]); 
    }
}
