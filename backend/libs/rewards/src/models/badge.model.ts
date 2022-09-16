import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Badge {
    @Field((type) => {return String})
    type: string;

    @Field((type) => {return Int})
    levels: number;

    @Field((type) => {return [Int]},{nullable:true})
    xp?: number[];

    @Field((type) => {return [String]})
    desc: string[];

    @Field((type) => {return [String]})
    title: string[];
 
}
