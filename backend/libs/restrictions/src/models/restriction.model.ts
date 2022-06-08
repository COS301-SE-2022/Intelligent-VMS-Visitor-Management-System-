import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Restriction {
    @Field((type) => {return String})
    name: string;

    @Field((type) => {return Int})
    value: number;
}
