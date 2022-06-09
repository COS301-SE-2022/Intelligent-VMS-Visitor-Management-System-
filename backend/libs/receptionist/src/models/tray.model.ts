//need clarification on this one

 import { Field, Int, ObjectType } from "@nestjs/graphql";

 @ObjectType()
 export class Tray {
     @Field((type) => Int)
     trayID: number;

     @Field((type) => String)
     inviteID: string;

     @Field((type) => Boolean)
     containsResidentID: Boolean;

     @Field((type) => Boolean)
     containsVisitorID: Boolean;
 }

