import { ApolloError } from "apollo-server-errors";

export class InviteLimitReachedError extends ApolloError {
    constructor(message: string) {
        super(message, "INVITE_LIMIT_REACHED");

        Object.defineProperty(this, "invite_limit_reached", { value: "MyError" });
    }
}
