import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Restriction, RestrictionDocument } from "../../schema/restriction.schema";
import { SetMaxSleepoversCommand } from "../impl/setMaxSleepovers.command";

@CommandHandler(SetMaxSleepoversCommand)
export class SetMaxSleepoversCommandHandler implements ICommandHandler {
    constructor(
        @InjectModel(Restriction.name) private restrictionModel: Model<RestrictionDocument>,
    ) {
    }

    async execute(command: SetMaxSleepoversCommand) {
        const { sleepovers } = command;
        return await this.restrictionModel.findOneAndUpdate({ name: "sleepovers" }, { value: sleepovers })
    }
}
