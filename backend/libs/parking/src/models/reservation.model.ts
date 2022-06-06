import { Field, ObjectType } from "@nestjs/graphql";
import { Invite } from "@vms/visitor-invite/models/invite.model";

@ObjectType()
export class ParkingReservation {
    @Field((type) => String)
    invitationID: string;

    @Field((type) => String)
    parkingNumber: number;

    @Field((type) => [Invite])
    inviteData?: Invite;
}

