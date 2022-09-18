import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "../../schema/user.schema";
import { UpdateNumInvitesCommand } from "../impl/updateNumInvites.command";

@CommandHandler(UpdateNumInvitesCommand)
export class UpdateNumInvitesCommandHandler implements ICommandHandler {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) {}

    async execute(command: UpdateNumInvitesCommand) {
        const { difference } = command;
        return await this.userModel.updateMany({},{$inc:{"numInvites":difference}});
    }
}
