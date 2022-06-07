import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Invite {
    @Field((type) => String)
    userEmail: string;

    @Field((type) => String)
    visitorEmail: string;

    @Field((type) => String)
    visitorName: string;

    @Field((type) => String)
    idDocType: string;

    @Field((type) => String)
    idNumber: string;

    @Field((type) => String)
    inviteID: string;

    @Field((type) => String)
    inviteDate: string;

    @Field((type) => Boolean)
    requiresParking: boolean;

    //Graphql doesnt like enums
    @Field((type) => String)
    inviteState: string

    @Field((type) => String)
    notes?: string

    @Field((type)=> String)
    signOutTime?: Date

}
