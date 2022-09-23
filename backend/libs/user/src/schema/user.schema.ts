import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type UserDocument = User & Document;

@Schema()
export class User {
    @Prop()
    email: string;

    @Prop()
    password: string;

    @Prop()
    permission: number;

    @Prop()
    idNumber: string;

    @Prop()
    idDocType: string;

    @Prop()
    name: string;

    @Prop()
    signUpDate: string;

    @Prop()
    xp: number;

    @Prop()
    badges: string;

    @Prop()
    numInvites: number;

    @Prop()
    numThemes: number;

    @Prop()
    curfewTime: number;

    @Prop()
    numSleepovers: number;

    @Prop()
    suggestions: number;

    @Prop()
    pinNumber: string;

    @Prop()
    file: string;

}

export const UserSchema = SchemaFactory.createForClass(User);
