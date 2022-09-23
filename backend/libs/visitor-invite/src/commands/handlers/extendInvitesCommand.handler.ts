import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ExtendInvitesCommand } from "../impl/extendInvites.command";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Invite, InviteDocument } from "../../schema/invite.schema";

@CommandHandler(ExtendInvitesCommand)
export class ExtendInvitesCommandHandler implements ICommandHandler {
    constructor(
        @InjectModel(Invite.name) private inviteModel: Model<InviteDocument>,
    ) {}

    async execute(command: ExtendInvitesCommand): Promise<any> {
        const today = (new Date()).toLocaleDateString().replace(/\//g, '-');
        return await this.inviteModel.updateMany({$and: [ {inviteState: "signedIn"} , {inviteDate: today} ] }, [{$set: { inviteState: "extended"}}]);
    }
}
