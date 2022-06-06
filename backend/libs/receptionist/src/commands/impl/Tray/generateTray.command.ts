export class generateTrayCommand {
    constructor(
        public readonly trayID: number,
        public readonly inviteID: string,
        public readonly containsResidentID: boolean,
        public readonly containsVisitorID: boolean
        ) {}
}

