import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "../../schema/user.schema";
import { DeleteUserCommand } from "../impl/deleteUser.command";

@CommandHandler(DeleteUserCommand)
export class DeleteUserCommandHandler implements ICommandHandler {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) {}

    async execute(command: DeleteUserCommand) {
        const { email } = command;
        return await this.userModel.deleteOne({ email: email });
    }
}
