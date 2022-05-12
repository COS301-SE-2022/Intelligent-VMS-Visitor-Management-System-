export class AssignParkingCommand {

    //what the command needs to execute, subset of db entries?
    constructor(
        readonly visitorEmail: string,
        readonly parkingNumber: number
    ) {}
  }