import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ExtendInvitesCommand } from "../impl/extendInvite.command";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Invite, InviteDocument } from "../../schema/invite.schema";

@CommandHandler(ExtendInvitesCommand)
export class ExtendInviteCommandHandler implements ICommandHandler {
    constructor(
        @InjectModel(Invite.name) private inviteModel: Model<InviteDocument>,
    ) {}

    async execute(command: ExtendInvitesCommand): Promise<any> {
        return await this.inviteModel.updateMany({inviteState:"signedIn"},[{$set: { inviteState: "extended"}}]);
    }
}
