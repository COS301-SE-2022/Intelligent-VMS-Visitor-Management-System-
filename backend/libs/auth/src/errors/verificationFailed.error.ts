import { ApolloError } from "apollo-server-errors";

export class VerificationFailed extends ApolloError {
    constructor(message: string) {
        super(message, "SIGNUP_FAIL");

        Object.defineProperty(this, "verification_failed", { value: "MyError" });
    }
}
