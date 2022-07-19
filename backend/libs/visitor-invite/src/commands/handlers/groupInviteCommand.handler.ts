import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { GroupInvite, GroupInviteDocument } from "../../schema/groupInvite.schema";
import { CreateGroupInviteCommand } from "../impl/createGroupInvite.command";

@CommandHandler(CreateGroupInviteCommand)
export class CreateGroupInviteCommandHandler implements ICommandHandler {
    constructor(
        @InjectModel(GroupInvite.name) private inviteModel: Model<GroupInviteDocument>,
    ) {}

    async execute(command: CreateGroupInviteCommand): Promise<any> {
        const { date, numInvites, numVisitors } = command;
        return this.inviteModel.create({date: date, numInvites: numInvites, numVisitors: numVisitors});
    }
}
