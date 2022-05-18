import { ApolloError } from "apollo-server-errors";

export class ParkingAlreadyFree extends ApolloError {
    constructor(message: string) {
        super(message, "PARKING_ALREADY_FREE");

        Object.defineProperty(this, "parking_already_free", { value: "MyError" });
    }
}
