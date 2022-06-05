import { removeTrayByInviteIDCommand } from "../../impl/Tray/removeTrayByInviteID.command";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Tray, TrayDocument } from "../../../schema/tray.schema";


@CommandHandler(removeTrayByInviteIDCommand)
export class RemoveParkingCommandHandler implements ICommandHandler<removeTrayByInviteIDCommand> {
  constructor(
      @InjectModel(Tray.name) private trayModel: Model<TrayDocument>) {}

  async execute(command: removeTrayByInviteIDCommand) {
    const { inviteID } = command;
        await this.trayModel.deleteOne({inviteID:inviteID});
  }
}