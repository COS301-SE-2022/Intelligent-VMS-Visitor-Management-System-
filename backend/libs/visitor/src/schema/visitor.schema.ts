import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type VisitorDocument = Visitor & Document;

@Schema()
export class Visitor {
    @Prop()
    name: string;

    @Prop()
    visitorID: string;

    @Prop()
    email: string;
}

export const VisitorSchema = SchemaFactory.createForClass(Visitor);
