import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "../../schema/user.schema";
import { UpdateXPCommand } from "../impl/updateXP.command";

@CommandHandler(UpdateXPCommand)
export class UpdateXPCommandHandler implements ICommandHandler {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) {}

    async execute(command: UpdateXPCommand) {
        const { email, xp } = command;
        return this.userModel.updateOne({ email: email },{$dec:{"xp":xp}});
    }
}