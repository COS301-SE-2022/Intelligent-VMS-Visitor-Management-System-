import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "../../schema/user.schema";
import { UpdatePrivilegesCommand } from "../impl/updatePrivileges.command";

@CommandHandler(UpdatePrivilegesCommand)
export class UpdatePrivilegesCommandHandler implements ICommandHandler {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) {}

    async execute(command: UpdatePrivilegesCommand) {
        const { sleepovers,themes,invites,curfew,email } = command;
        var num = curfew*100;

        return this.userModel.updateOne({ email: email },[{$set:{curfewTime: {$mod: [{$add:["$curfewTime",num]},2400] },numSleepovers:{$add:["$numSleepovers",sleepovers]},numInvites:{$add:["$numInvites",invites]},numThemes:{$add:["$numThemes",themes]}}}]);
    }
}