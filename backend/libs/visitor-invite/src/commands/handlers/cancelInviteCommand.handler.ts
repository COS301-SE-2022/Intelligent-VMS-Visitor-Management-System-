import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CancelInviteCommand } from "../impl/cancelInvite.command";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Invite, InviteDocument } from "../../schema/invite.schema";

@CommandHandler(CancelInviteCommand)
export class CancelInviteCommandHandler implements ICommandHandler {
    constructor(
        @InjectModel(Invite.name) private inviteModel: Model<InviteDocument>,
    ) {}

    async execute(command: CancelInviteCommand): Promise<any> {
        const { inviteID } = command;
        return await this.inviteModel.updateOne({ inviteID: inviteID }, [{$set: { inviteState: "cancelled"}}]);
    }
}
