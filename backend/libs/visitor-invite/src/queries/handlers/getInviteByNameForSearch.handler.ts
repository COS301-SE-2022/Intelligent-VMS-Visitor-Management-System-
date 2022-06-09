import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { GetInvitesByNameForSearchQuery } from "../impl/getInviteByNameForSearch.query";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Invite, InviteDocument } from "../../schema/invite.schema";

@QueryHandler(GetInvitesByNameForSearchQuery)
export class GetInvitesByNameForSearchQueryHandler implements IQueryHandler {
    constructor(@InjectModel(Invite.name) private inviteModel: Model<InviteDocument>) {}

    async execute(query: GetInvitesByNameForSearchQuery) {
        //return await this.inviteModel.aggregate(([{ $search: { "autocomplete": { "path": "visitorName", "query": name} } ]));
        const { name } = query;
        return await this.inviteModel.aggregate([
          {
            $search: {
              "compound": {
                "must": [{
                  "text": {
                    "query": name,
                    "path": "visitorName"
                  }
                }],
                "mustNot": [{
                  "text": {
                    "query": "signedOut",
                    "path": "inviteState"
                  }
                }]
              }
            },
          },
        ]);
    }
}
