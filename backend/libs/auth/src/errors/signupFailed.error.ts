import { ApolloError } from "apollo-server-errors";

export class SignUpFailed extends ApolloError {
    constructor(message: string) {
        super(message, "SIGNUP_FAIL");

        Object.defineProperty(this, "signup_fail", { value: "MyError" });
    }
}
