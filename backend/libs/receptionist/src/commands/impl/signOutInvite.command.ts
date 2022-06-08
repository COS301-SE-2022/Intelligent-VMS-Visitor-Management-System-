export class SignOutInviteCommand {
    constructor(public readonly inviteId: string,
        public readonly signOutDate: Date, public readonly trayNumber: number) { }
}
