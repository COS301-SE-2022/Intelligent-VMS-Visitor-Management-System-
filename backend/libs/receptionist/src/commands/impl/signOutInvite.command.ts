export class SignOutInviteCommand {
    constructor(public readonly inviteId: string,
        public readonly signOutTime: Date) { }
}
