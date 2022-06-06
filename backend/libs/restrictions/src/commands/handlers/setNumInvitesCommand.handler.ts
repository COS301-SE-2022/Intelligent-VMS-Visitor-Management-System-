import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Restriction, RestrictionDocument } from "../../schema/restriction.schema";
import { SetNumInvitesCommand } from "../impl/setNumInvites.command";

@CommandHandler(SetNumInvitesCommand)
export class SetNumInvitesCommandHandler implements ICommandHandler {
    constructor(
        @InjectModel(Restriction.name) private restrictionModel: Model<RestrictionDocument>,
    ) {
    }

    async execute(command: SetNumInvitesCommand) {
        const { numInvites } = command;
        return await this.restrictionModel.findOneAndUpdate({ name: "numInvites" }, { value: numInvites })
    }
}
