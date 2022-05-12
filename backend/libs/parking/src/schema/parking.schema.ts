import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

// what is with this parking document?
export type ParkingDocument = Parking & Document;

/*
export interface ParkingDocument extends Document {
    readonly reservationEmail: string;
    readonly reservationDate: Date;
    readonly visitorEmail: string;
    readonly parkingID: string;
  }

*/
@Schema()
export class Parking {
    @Prop()
    reservationInviteID?: string;

    @Prop()
    visitorEmail?: string;

    @Prop()
    parkingNumber: number;
}

export const ParkingSchema = SchemaFactory.createForClass(Parking);