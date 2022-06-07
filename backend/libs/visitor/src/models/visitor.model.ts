import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Visitor {
    @Field((type) => {return Int})
    id: number;

    @Field((type) => {return String})
    name: string;

    @Field((type) => {return String})
    email: string;
}
