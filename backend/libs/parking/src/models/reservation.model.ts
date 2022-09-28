import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class ParkingReservation {
    @Field((type) => {return String})
    invitationID: string;

    @Field((type) => {return String})
    parkingNumber: number;

    @Field((type) => {return String})
    reservationDate: string;

    @Field((type) => {return Boolean})
    activated: boolean;
}

