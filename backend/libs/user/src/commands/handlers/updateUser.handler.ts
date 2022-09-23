import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "../../schema/user.schema";
import { UpdateUserCommand } from "../impl/updateUser.command";

@CommandHandler(UpdateUserCommand)
export class UpdateUserCommandHandler implements ICommandHandler {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) {}

    async execute(command: UpdateUserCommand) {
        const { email,badges,xp } = command;
        return this.userModel.updateOne({ email: email },{ $inc: {"xp":xp}, $set: {"badges":badges}});
    }
}
