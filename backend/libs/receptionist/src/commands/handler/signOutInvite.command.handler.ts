import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Invite, InviteDocument } from "../../../../visitor-invite/src/schema/invite.schema";
import { SignOutInviteCommand } from "../impl";
import { TrayDocument } from "@vms/receptionist/schema/tray.schema";

@CommandHandler(SignOutInviteCommand)
export class SignOutInviteCommandHandler implements ICommandHandler<SignOutInviteCommand> {
    constructor(
        @InjectModel(Invite.name) private inviteModel: Model<InviteDocument>,
        @InjectModel(Invite.name) private trayModel: Model<TrayDocument>,
    ) { }

    async execute(command: SignOutInviteCommand): Promise<Invite> {
        const { inviteId, signOutTime,trayNumber } = command;
        await this.trayModel.findOneAndUpdate({ inviteID: inviteId }, { containsVisitorID: false, containsResidentID: false });

        return await this.inviteModel.findOneAndUpdate({ inviteID: inviteId }, { inviteState: "signedOut", signOutTime: signOutTime });

        
    }
}

