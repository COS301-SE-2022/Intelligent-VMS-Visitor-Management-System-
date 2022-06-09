import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Invite, InviteDocument, InviteState } from "../../../../visitor-invite/src/schema/invite.schema";
import { SignInInviteCommand } from "../impl/signInInvite.command";


@CommandHandler(SignInInviteCommand)
export class SignInInviteCommandHandler implements ICommandHandler<SignInInviteCommand> {
    constructor(
        @InjectModel(Invite.name) private inviteModel: Model<InviteDocument>,
    ) {}

    async execute(command: SignInInviteCommand): Promise<Invite> {
        const { inviteID, notes, signInTime } = command;
        return await this.inviteModel.findOneAndUpdate({ inviteID: inviteID }, {inviteState: "signedIn", notes: notes, signInTime: signInTime});
    }
}
