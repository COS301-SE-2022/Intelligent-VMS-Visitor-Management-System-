import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "../../schema/user.schema";
import { DeauthorizeUserAccountCommand } from "../impl/deauthorizeUserAccount.command";

@CommandHandler(DeauthorizeUserAccountCommand)
export class DeauthorizeUserAccountCommandHandler implements ICommandHandler {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) {}

    async execute(command: DeauthorizeUserAccountCommand) {
        const { email } = command;
        return this.userModel.updateOne({ email: email }, [ {$set: { permission: { $switch: { branches: [ { case: { $eq: ["$permission", 1]}, then: -1 }, { case: { $eq: ["$permission", 2]}, then: -2 }] } } }} ], { multi: false } );
    }
}
