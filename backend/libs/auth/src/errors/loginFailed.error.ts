import { ApolloError } from "apollo-server-errors";

export class LoginFailed extends ApolloError {
    constructor(message: string) {
        super(message, "LOGIN_FAIL");

        Object.defineProperty(this, "login_fail", { value: "MyError" });
    }
}
