import { Field, ObjectType } from "@nestjs/graphql";
import { Invite } from "@vms/visitor-invite/models/invite.model";

@ObjectType()
export class ParkingReservation {
    @Field((type) => {return String})
    invitationID: string;

    @Field((type) => {return String})
    parkingNumber: number;

    @Field((type) => {return [Invite]})
    inviteData?: Invite;
}

