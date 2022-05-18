export class UnreserveParkingCommand {

    //what the command needs to execute, subset of db entries?
    constructor(
        readonly invitatationID: string
    ) {}
  }