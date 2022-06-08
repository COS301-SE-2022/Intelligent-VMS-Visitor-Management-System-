import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type RestrictionDocument = Restriction & Document;

@Schema()
export class Restriction {
    @Prop()
    name: string;

    @Prop()
    value: number;
}

export const RestrictionSchema = SchemaFactory.createForClass(Restriction);
