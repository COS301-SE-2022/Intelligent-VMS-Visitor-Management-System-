import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type RewardsDocument = Reward & Document;

@Schema()
export class Reward {
    @Prop()
    xp: number;

    @Prop()
    type: string;

    @Prop()
    desc: string;
}

export const RewardsSchema = SchemaFactory.createForClass(Reward);
