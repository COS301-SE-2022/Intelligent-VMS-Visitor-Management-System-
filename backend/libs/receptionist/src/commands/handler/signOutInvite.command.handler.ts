import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Invite, InviteDocument } from "../../../../visitor-invite/src/schema/invite.schema";
import { SignOutInviteCommand } from "../impl";

@CommandHandler(SignOutInviteCommand)
export class SignOutInviteCommandHandler implements ICommandHandler<SignOutInviteCommand> {
    constructor(
        @InjectModel(Invite.name) private inviteModel: Model<InviteDocument>,
    ) { }

    async execute(command: SignOutInviteCommand): Promise<Invite> {
        const { inviteId, signOutDate } = command;
        return await this.inviteModel.findOneAndUpdate({ inviteID: inviteId }, { inviteState: "signedOut", signOutDate });
    }
}

