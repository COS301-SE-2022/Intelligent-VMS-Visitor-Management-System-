import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type ParkingDocument = Parking & Document;

@Schema()
export class Parking {
    @Prop()
    reservationEmail: string;
    
    @Prop()
    reservationDate: Date;

    @Prop()
    visitorEmail: string;

    @Prop()
    parkingID: string;
}

export const ParkingSchema = SchemaFactory.createForClass(Parking);