export class UpdatePrivilegesCommand {
    constructor(
        public readonly email: string,
        public readonly sleepovers: number,
        public readonly themes: number,
        public readonly invites: number) {}
}