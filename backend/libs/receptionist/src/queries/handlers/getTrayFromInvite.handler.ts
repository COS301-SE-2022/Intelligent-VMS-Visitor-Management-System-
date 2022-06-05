import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { getTrayFromInviteQuery } from "../impl/getTrayFromInvite.query";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Tray, TrayDocument } from "../../schema/tray.schema";

@QueryHandler(getTrayFromInviteQuery)
export class getTrayFromInviteQueryHandler implements IQueryHandler {
    constructor(
        @InjectModel(Tray.name) private trayModel: Model<TrayDocument>,
    ) {}

    async execute(query: getTrayFromInviteQuery) {
        const { inviteID } = query;
        const tray = await this.trayModel.findOne({inviteID:inviteID});
        return tray;
    }
}
