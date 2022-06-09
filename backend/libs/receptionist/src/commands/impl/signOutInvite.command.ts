export class SignOutInviteCommand {
    constructor(public readonly inviteId: string,
                public readonly signOutTime: Date, 
                public readonly trayNumber: number) { }
}
