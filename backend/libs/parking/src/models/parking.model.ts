import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Parking {
    @Field((type) => {return String})
    visitorEmail?: string;

    @Field((type) => {return String})
    parkingNumber: number;

    @Field((type) => {return Boolean})
    enabled: boolean;
}

