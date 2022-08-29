import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type ParkingDocument = Parking & Document;

@Schema()
export class Parking {

    @Prop()
    visitorEmail?: string;

    @Prop()
    parkingNumber: number;

    @Prop()
    enabled: boolean;
}


export const ParkingSchema = SchemaFactory.createForClass(Parking);
