import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Resident {
    @Field((type) => [String])
    visitors: string[];
}
