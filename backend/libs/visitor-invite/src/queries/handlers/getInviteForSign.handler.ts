import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

import { Invite, InviteDocument } from "../../schema/invite.schema";
import { GetInviteForSignQuery } from "../impl/getInviteForSign.query";

@QueryHandler(GetInviteForSignQuery)
export class GetInviteForSignHandler implements IQueryHandler {

    constructor(@InjectModel(Invite.name) private inviteModel: Model<InviteDocument>) {
    }

    formatDate(date: Date) {
        const d = new Date(date);
        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        const year = d.getFullYear();

        if (month.length < 2) {
            month = '0' + month;
        } 

        if (day.length < 2) {
            day = '0' + day;
        }

        return [year, month, day].join('-');
    }

    async execute(query: GetInviteForSignQuery) {
        const { idNumber } = query; 
        const invite = await this.inviteModel.findOne({ 
            $or: [
                {idNumber: idNumber, inviteState: "inActive", inviteDate: this.formatDate(new Date())},
                {idNumber: idNumber, inviteState: "signedIn", inviteDate: this.formatDate(new Date())},
                {idNumber: idNumber, inviteState: "extended"}
            ]
        });
        return invite;
    }
}

