import { Injectable } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { GetUserQuery } from "./queries/impl/getUser.query";

@Injectable()
export class UserService {
    constructor(private queryBus: QueryBus) {}

    async findOne(email: string) {
        return this.queryBus.execute(new GetUserQuery(email));
    }
}
