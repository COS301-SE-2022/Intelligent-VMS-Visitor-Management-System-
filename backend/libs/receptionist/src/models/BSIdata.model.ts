 import { Field, Int, ObjectType } from "@nestjs/graphql";

 @ObjectType()
 export class BSIdata {
     @Field((type) => Int)
     signInCount: number;

     @Field((type) => Int)
     createCount: number;
 }

