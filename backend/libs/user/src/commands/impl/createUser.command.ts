export class CreateUserCommand {
    constructor(
        public readonly email: string,
        public readonly password: string,
        public readonly permission: number,
        public readonly idNumber: string,
        public readonly idDocType: string,
        public readonly name: string,
        public readonly badges: string,
        public readonly numSleepovers: string,
        public readonly numThemes: string,
        public readonly numInvites: string,
        public readonly curfewTime: string,
        public readonly date: string
    ) {
    }
}
