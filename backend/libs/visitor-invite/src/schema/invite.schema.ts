import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type InviteDocument = Invite & Document;

export enum InviteState{
    signedIn,
    inActive,
    signedOut,
}

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
    notes?: string;

    //TODO (Kyle) DEFAULT SHOULD BE INACTIVE
    @Prop()
    inviteState: string

    @Prop()
    visitorName: string;
    
    @Prop()
    signOutDate: string;

    @Prop()
    signInDate: string;

    @Prop()
    creationDate: string;
}

export const InviteSchema = SchemaFactory.createForClass(Invite);
