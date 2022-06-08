import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { getTrayListQuery } from "../impl/getTrayList.query";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Tray, TrayDocument } from "../../schema/tray.schema";

@QueryHandler(getTrayListQuery)
export class getTrayFromInviteQueryHandler implements IQueryHandler {
    constructor(
        @InjectModel(Tray.name) private trayModel: Model<TrayDocument>,
    ) {}

    async execute() {
        const trayList = await this.trayModel.find();
        return trayList;
    }
}