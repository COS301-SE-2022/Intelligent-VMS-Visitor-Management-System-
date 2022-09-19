import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "../../schema/user.schema";
import { UpdateMaxCurfewTimeCommand } from "../impl/updateMaxCurfewTime.command";

@CommandHandler(UpdateMaxCurfewTimeCommand)
export class UpdateMaxCurfewTimeCommandHandler implements ICommandHandler {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) {}

    async execute(command: UpdateMaxCurfewTimeCommand) {
        const { difference } = command;
        return await this.userModel.updateMany({},{$inc:{"curfewTime":difference}});
    }
}
