import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type GroupInviteDocument = GroupInvite & Document;

@Schema()
export class GroupInvite {
    @Prop()
    _id: string;

    @Prop()
    numInvites: number;

    @Prop()
    numVisitors: number;

}

export const GroupInviteSchema = SchemaFactory.createForClass(GroupInvite);
