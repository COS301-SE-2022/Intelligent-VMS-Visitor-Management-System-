 import { Field, Int, ObjectType } from "@nestjs/graphql";

 @ObjectType()
 export class BSIdata {
     @Field((type) => {return [String]})
     signInData: string[];

     @Field((type) => {return [String]})
     createData: string[];
 }

