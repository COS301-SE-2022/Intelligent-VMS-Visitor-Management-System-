export class CreateGroupInviteCommand {
    constructor(
        public readonly date: string,
        public readonly numInvites: number,
        public readonly numVisitors: number
    ) {}
}
