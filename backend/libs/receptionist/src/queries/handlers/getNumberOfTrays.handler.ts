import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { getNumberOfTraysQuery } from "../impl/getNumberOfTrays.query";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Tray, TrayDocument } from "../../schema/tray.schema";

@QueryHandler(getNumberOfTraysQuery)
export class getNumberOfTraysQueryHandler implements IQueryHandler {
    constructor(
        @InjectModel(Tray.name) private trayModel: Model<TrayDocument>,
    ) {}

    async execute(query: getNumberOfTraysQuery) {
        const trays = await this.trayModel.find();
        return trays.length;
    }
}
