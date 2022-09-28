import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type ParkingReservationDocument = ParkingReservation & Document;

@Schema()
export class ParkingReservation {
    @Prop()
    invitationID: string;

    @Prop()
    parkingNumber: number;

    @Prop()
    reservationDate: string;

    @Prop()
    activated: boolean;
}


export const ParkingReservationSchema = SchemaFactory.createForClass(ParkingReservation);