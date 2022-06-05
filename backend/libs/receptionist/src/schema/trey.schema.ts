import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type TrayDocument = Tray & Document;

@Schema()
export class Tray {
    @Prop()
    inviteID: string;

    @Prop()
    trayID: number;
}

export const TraySchema = SchemaFactory.createForClass(Tray);
