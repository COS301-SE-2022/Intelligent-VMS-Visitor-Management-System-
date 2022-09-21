import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "../../schema/user.schema";
import { UpdateMaxSleepoversCommand } from "../impl/updateMaxSleepovers.command";

@CommandHandler(UpdateMaxSleepoversCommand)
export class UpdateMaxSleepoversCommandHandler implements ICommandHandler {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) {}

    async execute(command: UpdateMaxSleepoversCommand) {
        const { difference } = command;
        return await this.userModel.updateMany({},{$inc:{"numSleepovers":difference}});
    }
}
