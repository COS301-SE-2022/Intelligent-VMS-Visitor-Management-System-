export class CreateGroupInviteCommand {
    constructor(
        public readonly date,
        public readonly numInvites,
        public readonly numVisitors
    ) {}
}
