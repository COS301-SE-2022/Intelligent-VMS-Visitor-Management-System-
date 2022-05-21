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
    idDocType: string;

    @Prop()
    idNumber: string;

    @Prop()
    inviteDate: string;

    @Prop()
    inviteID: string;
}

export const InviteSchema = SchemaFactory.createForClass(Invite);
