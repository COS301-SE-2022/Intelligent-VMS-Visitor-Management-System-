 import { Field, Int, ObjectType } from "@nestjs/graphql";

 @ObjectType()
 export class BSIdata {
     @Field((type) => {return Int})
     signInCount: number;

     @Field((type) => {return Int})
     createCount: number;
 }

