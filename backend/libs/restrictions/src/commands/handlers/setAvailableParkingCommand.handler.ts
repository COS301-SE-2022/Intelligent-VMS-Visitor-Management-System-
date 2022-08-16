// import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
// import { Model } from "mongoose";
// import { InjectModel } from "@nestjs/mongoose";
// import { Restriction, RestrictionDocument } from "../../schema/restriction.schema";
// import { SetAvailableParkingCommand} from "../impl/setAvailableParking.command.handler";

// @CommandHandler(SetAvailableParkingCommand)
// export class SetAvailableParkingCommandHandler implements ICommandHandler {
//     constructor(
//         @InjectModel(Restriction.name) private restrictionModel: Model<RestrictionDocument>,
//     ) {
//     }

//     async execute(command: SetAvailableParkingCommand) {
//         const { numAvailableParking } = command;
//         return await this.restrictionModel.findOneAndUpdate({ name: "numAvailableParking" }, { value: numAvailableParking })
//     }
// }
