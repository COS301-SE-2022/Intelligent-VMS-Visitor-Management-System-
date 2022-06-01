import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type InviteDocument = Invite & Document;

@Schema()
export class Invite {
    @Prop()
    userEmail: string;

    @Prop()
    visitorEmail: string;

    @Prop()
    visitDate: Date;

    @Prop()
    idDocType: string;

    @Prop()
    idNumber: string;

    @Prop()
    inviteDate: string;

    @Prop()
    inviteID: string;

    @Prop()
    notes: string;

    @Prop()
    visitorName: string;
}

export const InviteSchema = SchemaFactory.createForClass(Invite);
