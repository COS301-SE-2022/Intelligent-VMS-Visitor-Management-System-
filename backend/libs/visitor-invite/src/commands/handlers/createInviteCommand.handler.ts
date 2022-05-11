import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateInviteCommand } from "../impl/createInvite.command";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Invite, InviteDocument } from "../../schema/invite.schema";

@CommandHandler(CreateInviteCommand)
export class CreateInviteCommandHandler implements ICommandHandler {
    constructor(
        @InjectModel(Invite.name) private inviteModel: Model<InviteDocument>,
    ) {}

    async execute(command: CreateInviteCommand): Promise<Invite> {
        const { userEmail, visitorEmail, IDDocType, IDNumber, inviteID } = command;
        const invite = new Invite();
        invite.userEmail = userEmail;
        invite.visitorEmail = visitorEmail;
        invite.idDocType = IDDocType;
        invite.idNumber = IDNumber;
        invite.inviteID = inviteID;
        return await this.inviteModel.create(invite);
    
    }
}
