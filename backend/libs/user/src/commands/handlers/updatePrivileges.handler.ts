import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "../../schema/user.schema";
import { UpdatePrivilegesCommand } from "../impl/updatePrivileges.command";

@CommandHandler(UpdatePrivilegesCommand)
export class UpdatePrivilegesCommandHandler implements ICommandHandler {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) {}

    async execute(command: UpdatePrivilegesCommand) {
        const { sleepovers,themes,invites,email } = command;
        return this.userModel.updateOne({ email: email },{ $inc: [{"numSleepovers":sleepovers},{"numThemes":themes},{"numInvites":invites}]});
    }
}
