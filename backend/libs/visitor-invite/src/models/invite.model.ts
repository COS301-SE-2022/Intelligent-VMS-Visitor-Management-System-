import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Invite {
    @Field((type) => String)
    visitorEmail: string;

    @Field((type) => String)
    idDocType: string;

    @Field((type) => String)
    idNumber: string;

    @Field((type) => String)
    inviteID: string;

    @Field((type) => Date)
    visitDate: Date;

    @Field((type) => Boolean)
    requiresParking: boolean;
}
