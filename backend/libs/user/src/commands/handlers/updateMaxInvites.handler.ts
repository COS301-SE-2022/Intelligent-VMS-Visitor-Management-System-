import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "../../schema/user.schema";
import { UpdateMaxInvitesCommand } from "../impl/updateMaxInvites.command";

@CommandHandler(UpdateMaxInvitesCommand)
export class UpdateMaxInvitesCommandHandler implements ICommandHandler {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) {}

    async execute(command: UpdateMaxInvitesCommand) {
        const { difference } = command;
        return await this.userModel.updateMany({$ne:{permission:1}},{$inc:{"numInvites":difference}});
    }
}
