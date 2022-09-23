import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Visitor {
    @Field((type) => {return String})
    _id: string;

    @Field((type) => {return String})
    visitorName: string;

    @Field((type) => {return String})
    idNumber?: string;

    @Field((type) => {return String})
    idDocType?: string;

    @Field((type) => {return Number})
    numInvites?: number;

    @Field((type) => {return [String]})
    visits?: string[];

    @Field((type) => {return Number})
    prob?: number;
}
