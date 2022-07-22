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
        const{ inviteID, containsResidentID, containsVisitorID} = command;
        let trayID = 0;
        let tries = 0;
        while((tries++!==100)){
            trayID = trayIDGenerator();
            const doesTrayExist = await this.trayModel.findOne({trayID});
            if(doesTrayExist&& doesTrayExist.containsResidentID && doesTrayExist.containsVisitorID){
                continue;

            }
            break;

        }

        return await this.trayModel.create({trayID:trayID, inviteID: inviteID, containsResidentID: containsResidentID, containsVisitorID:containsVisitorID});
        
    

        
        
    }
}