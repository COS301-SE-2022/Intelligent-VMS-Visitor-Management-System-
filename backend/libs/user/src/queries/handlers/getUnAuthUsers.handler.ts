import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { GetUnAuthUsersQuery } from "../impl/getUnAuthUsers.query";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "../../schema/user.schema";

@QueryHandler(GetUnAuthUsersQuery)
export class GetUnAuthUsersQueryHandler implements IQueryHandler {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) {}

    async execute(query: GetUnAuthUsersQuery) {
        const { permission } = query; 
        if(permission === -1) { // Admin query
            return await this.userModel.find({ $or: [{permission: -1}, { permission: -2 }]});
        } else { // Receptionist Query
            return await this.userModel.find({ permission: -2 });
        }
    }
}
