import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type GroupParkingDocument = GroupParking & Document;

@Schema()
export class GroupParking {
    @Prop()
    _id: string;

    @Prop()
    numParking: number;

}

export const GroupParkingSchema = SchemaFactory.createForClass(GroupParking);
