import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Invite {
    @Field((type) => {return String})
    userEmail: string;

    @Field((type) => {return String})
    visitorEmail: string;

    @Field((type) => {return String})
    visitorName: string;

    @Field((type) => {return String})
    idDocType: string;

    @Field((type) => {return String})
    idNumber: string;

    @Field((type) => {return String})
    inviteID: string;

    @Field((type) => {return String})
    inviteDate: string;

    @Field((type) => {return Boolean})
    requiresParking: boolean;

    //Graphql doesnt like enums
    @Field((type) => {return String})
    inviteState: string

    @Field((type) => {return String})
    notes?: string

    @Field((type)=> String)
    signOutTime?: Date

    @Field((type)=> String)
    signInTime?: String

    @Field((type)=> Number)
    trayNumber?: number

}
