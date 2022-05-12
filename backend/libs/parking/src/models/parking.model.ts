import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Parking {
    @Field((type) => String)
    reservationInviteID?: string;

    @Field((type) => String)
    visitorEmail?: string;

    @Field((type) => String)
    parkingNumber: number;

}

