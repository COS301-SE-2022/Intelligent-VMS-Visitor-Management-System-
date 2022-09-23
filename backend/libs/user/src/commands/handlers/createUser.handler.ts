import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import mongoose, { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "../../schema/user.schema";
import { CreateUserCommand } from "../impl/createUser.command";

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler implements ICommandHandler {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) {}

    async execute(command: CreateUserCommand) {
        const { email, password, permission, name, idDocType, idNumber, badges, numSleepovers, numThemes, numInvites, curfewTime, date, file, pinNumber } = command;
        await this.userModel.create({ email: email, 
                                      password: password, 
                                      permission: permission, 
                                      name: name, 
                                      idDocType: idDocType, 
                                      idNumber: idNumber, 
                                      signUpDate: date, 
                                      xp: 20, 
                                      badges: badges, 
                                      suggestions: 0, 
                                      numSleepovers:numSleepovers, 
                                      numInvites:numInvites, 
                                      numThemes:numThemes, 
                                      curfewTime:curfewTime,
                                      file: file,
                                      pinNumber: pinNumber});
        
    }
}
