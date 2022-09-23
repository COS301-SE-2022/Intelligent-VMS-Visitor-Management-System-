import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "../../schema/user.schema";
import { IncreaseSuggestionsCommand } from "../impl/increaseSuggestions.command";

@CommandHandler(IncreaseSuggestionsCommand)
export class IncreaseSuggestionsCommandHandler implements ICommandHandler {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) {}

    async execute(command: IncreaseSuggestionsCommand) {
        const { email } = command;
        return await this.userModel.updateOne({"email":email},{$inc:{"suggestions":1}});
    }
}
