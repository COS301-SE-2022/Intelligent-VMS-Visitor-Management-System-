import { ReserveParkingCommand } from "../impl/reserveParking.command";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Parking, ParkingDocument } from "../../schema/parking.schema";


@CommandHandler(ReserveParkingCommand)
export class ReserveParkingCommandHandler implements ICommandHandler<ReserveParkingCommand> {
  constructor(
      @InjectModel(Parking.name) private parkingModel: Model<ParkingDocument>,
  ) {}

  async execute(command: ReserveParkingCommand) {

    //what does this do?
    const { reserverEmail, reservationDate, parkingNumber } = command;

    const parkingSpace = new Parking();
    parkingSpace.parkingNumber=0;
    parkingSpace.reservationDate=new Date();
    parkingSpace.reserverEmail="larisa@gmail.com";

    await this.parkingModel.create(parkingSpace);
    return await this.parkingModel.findOneAndUpdate({parkingNumber: parkingNumber },{reserverEmail:reserverEmail,reservationDate:reservationDate},function (err, docs) {
      if (err){
          console.log(err)
      }
      else{
          console.log("Reservation made : ", docs);
      }
  });

    //do what is required to reserve parking db stuff!!
  }
}
