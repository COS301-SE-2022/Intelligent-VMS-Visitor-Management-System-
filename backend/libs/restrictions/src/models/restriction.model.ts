import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Restriction {
    @Field((type) => String)
    name: string;

    @Field((type) => Int)
    value: number;
}
