//need clarification on this one

 import { Field, Int, ObjectType } from "@nestjs/graphql";

 @ObjectType()
 export class Tray {
     @Field((type) => {return Int})
     trayID: number;

     @Field((type) => {return String})
     inviteID: string;

     @Field((type) => {return Boolean})
     containsResidentID: boolean;

     @Field((type) => {return Boolean})
     containsVisitorID: boolean;
 }

