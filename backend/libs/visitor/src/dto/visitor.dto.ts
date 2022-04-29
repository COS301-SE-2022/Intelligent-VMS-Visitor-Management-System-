import { ObjectType, Field, InputType } from "@nestjs/graphql";

@ObjectType("Visitor")
@InputType("VisitorInputType")
export class VisitorType {
    @Field()
    id: number;

    @Field()
    name: string;

    @Field()
    password: string;
}
