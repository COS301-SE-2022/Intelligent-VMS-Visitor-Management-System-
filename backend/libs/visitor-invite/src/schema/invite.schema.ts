import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type InviteDocument = Invite & Document;

enum State{
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

    // TODO (Kyle): notes will vary in length is there a more efficient way to store it?
    @Prop()
    notes: string;

    //DEFAULT SHOULD BE INACTIVE
    @Prop()
    inviteState: State
}

export const InviteSchema = SchemaFactory.createForClass(Invite);
