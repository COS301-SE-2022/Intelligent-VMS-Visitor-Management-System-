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
        const { email, password, permission, name, idDocType, idNumber, date } = command;
        let id = new mongoose.mongo.ObjectId();
        await this.userModel.create({ email: email, 
                                      password: password, 
                                      permission: permission, 
                                      name: name, 
                                      idDocType: idDocType, 
                                      idNumber: idNumber, 
                                      signUpTime: date, 
                                      xp: 20, 
                                      badges: "1000000", 
                                      suggestions: 0, 
                                      numSleepovers:0, 
                                      numInvites:0, 
                                      numThemes:0, 
                                      curfewTime:0});
        
                                      // await this.userModel.updateOne({"email":"larisabotha@icloud.com"},[
        //     {
        //         "$set":{
        //             "password":"$2b$04$vOHfNyd.6DE/Ko4hDIOnK.8yhiL.EDiMjuw993uq98IxnTSAm773a",
        //             "permission":-1,
        //             "name":"Larisa Botha", 
        //             "idDocType": "RSA-ID", 
        //             "idNumber": "0012120178087", 
        //             "xp": 20, 
        //             "signUpTime": "2022/09/21", 
        //             "badges": "1000000", 
        //             "suggestions": 0, 
        //             "numSleepovers":0, 
        //             "numInvites":0, 
        //             "numThemes":0,
        //             "curfewTime":{"$mod":[{"$subtract":[{"$max":"$curfewTime"},200]},2400]}
        //         }
        //     },
        //     {
        //         upsert: true
        //     }
        // ])
    }
}
