import { ApolloError } from "apollo-server-errors";

export class NoInvites extends ApolloError {
    constructor(message: string) {
        super(message, "NO_INVITES");

        Object.defineProperty(this, "no_invites", { value: "No Invites Found" });
    }
}

