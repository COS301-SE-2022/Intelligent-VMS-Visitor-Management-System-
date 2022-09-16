import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type BadgeDocument = Badge & Document;

@Schema()
export class Badge {
    @Prop()
    type: string;

    @Prop()
    levels: number;

    @Prop()
    title: string[];

    @Prop()
    xp?: number[];

    @Prop()
    desc: string[];
}

export const BadgesSchema = SchemaFactory.createForClass(Badge);
