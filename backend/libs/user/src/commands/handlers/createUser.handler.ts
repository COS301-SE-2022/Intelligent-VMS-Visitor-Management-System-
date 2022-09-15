import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "../../schema/user.schema";
import { CreateUserCommand } from "../impl/createUser.command";

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler implements ICommandHandler {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) {}

    async execute(command: CreateUserCommand) {
        const { email, password, permission, name, idDocType, idNumber, date } = command;
        await this.userModel.create({ email: email, password: password, permission: permission, name: name, idDocType: idDocType, idNumber: idNumber, xp: 0, signUpTime: date});
    }
}
