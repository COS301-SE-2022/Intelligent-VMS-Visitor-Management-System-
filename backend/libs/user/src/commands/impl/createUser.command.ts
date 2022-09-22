export class CreateUserCommand {
    constructor(
        public readonly email: string,
        public readonly password: string,
        public readonly permission: number,
        public readonly idNumber: string,
        public readonly idDocType: string,
        public readonly name: string,
        public readonly badges: string,
        public readonly numSleepovers: number,
        public readonly numThemes: number,
        public readonly numInvites: number,
        public readonly curfewTime: number,
        public readonly date: string
    ) {
    }
}
