import { ApolloError } from "apollo-server-errors";

export class InvalidSignIn extends ApolloError {
    constructor(message: string) {
        super(message, "INVALID_SIGN_IN");

        Object.defineProperty(this, "invalid sign in", { value: "MyError" });
    }
}
