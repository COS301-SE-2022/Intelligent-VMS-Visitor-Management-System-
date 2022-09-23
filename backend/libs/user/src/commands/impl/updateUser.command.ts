export class UpdateUserCommand {
    constructor(
        public readonly email: string,
        public readonly badges: string,
        public readonly xp: number) {}
}