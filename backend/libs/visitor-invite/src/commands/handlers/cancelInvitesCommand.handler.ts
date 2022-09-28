import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CancelInvitesCommand } from "../impl/cancelInvites.command";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Invite, InviteDocument } from "../../schema/invite.schema";

@CommandHandler(CancelInvitesCommand)
export class CancelInvitesCommandHandler implements ICommandHandler {
    constructor(
        @InjectModel(Invite.name) private inviteModel: Model<InviteDocument>,
    ) {}

    async execute(command: CancelInvitesCommand): Promise<any> {
        const today = (new Date()).toLocaleDateString().replace(/\//g, '-');
        return await this.inviteModel.updateMany({$and: [ {inviteState: "inActive"} , {inviteDate: today} ] }, [{$set: { inviteState: "cancelled"}}]);
    }
}
