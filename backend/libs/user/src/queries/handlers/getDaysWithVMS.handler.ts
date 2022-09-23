import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { GetDaysWithVMSQuery } from "../impl/getDaysWithVMS.query";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "../../schema/user.schema";

@QueryHandler(GetDaysWithVMSQuery)
export class GetDaysWithVMSQueryHandler implements IQueryHandler {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) {}

    async execute(query: GetDaysWithVMSQuery): Promise<number> {
        const { email } = query;
        const user = await this.userModel.findOne({ email: email });
        const today = new Date();
        const startDate =  new Date(user.signUpDate);
        return (today.getTime()-startDate.getTime())/(1000*3600*24);
    }
}
