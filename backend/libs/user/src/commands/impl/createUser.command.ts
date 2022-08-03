export class CreateUserCommand {
    constructor(
        public readonly email: string,
        public readonly password: string,
        public readonly permission: number,
        public readonly idNumber: string,
        public readonly idDocType: string,
        public readonly name: string
    ) {
    }
}
