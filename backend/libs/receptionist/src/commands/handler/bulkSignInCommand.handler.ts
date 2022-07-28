import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Invite, InviteDocument, InviteState } from "../../../../visitor-invite/src/schema/invite.schema";
import { BulkSignInCommand } from "../impl/bulkSignIn.command";


@CommandHandler(BulkSignInCommand)
export class BulkSignInCommandHandler implements ICommandHandler<BulkSignInCommand> {
    constructor(
        @InjectModel(Invite.name) private inviteModel: Model<InviteDocument>,
    ) {}

    async execute(command: BulkSignInCommand) {
        const { inviteIDs} = command;
        await this.inviteModel.updateMany({inviteID: {$in: inviteIDs}}, {inviteState: "signedOut", signInTime: "NA", signOutTime: "NA"});
    }
}
