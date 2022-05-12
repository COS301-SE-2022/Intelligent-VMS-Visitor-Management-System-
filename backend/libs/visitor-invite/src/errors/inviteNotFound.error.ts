import { ApolloError } from "apollo-server-errors";

export class InviteNotFound extends ApolloError {
    constructor(message: string) {
        super(message, "INVITE_NOT_FOUND");

        Object.defineProperty(this, "invite_not_found", { value: "MyError" });
    }
}
