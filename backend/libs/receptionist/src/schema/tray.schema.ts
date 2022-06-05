import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type TrayDocument = Tray & Document;

@Schema()
export class Tray {
    @Prop()
    inviteID: string;

    @Prop()
    trayID: number;

    @Prop()
    containsResidentID: boolean;

    @Prop()
    containsVisitorID: boolean;
//TO-DO (daniel) expand tray so that 1 resident can have more than one invite / have those ID's put into
//a single tray
}

export const TraySchema = SchemaFactory.createForClass(Tray);
