import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class ParkingReservation {
    @Field((type) => String)
    invitationID: string;

    @Field((type) => String)
    parkingNumber: number;

}

