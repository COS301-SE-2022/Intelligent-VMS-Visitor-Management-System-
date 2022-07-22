import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { generateTrayCommand } from "../../impl/Tray/generateTray.command";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Tray, TrayDocument } from "../../../schema/tray.schema";

@CommandHandler(generateTrayCommand)
export class generateTrayCommandHandler implements ICommandHandler {
    constructor(
        @InjectModel(Tray.name) private trayModel: Model<TrayDocument>,
    ) {}

    async execute(command: generateTrayCommand):Promise<Tray> {
        
        
        
    }
}