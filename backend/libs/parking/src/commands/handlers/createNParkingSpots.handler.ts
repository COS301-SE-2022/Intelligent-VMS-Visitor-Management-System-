import { CreateNParkingSpotsCommand } from "../impl/createNParkingSpots.command";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Parking, ParkingDocument } from "../../schema/parking.schema";


@CommandHandler(CreateNParkingSpotsCommand)
export class CreateNParkingSpotsCommandHandler implements ICommandHandler<CreateNParkingSpotsCommand> {
  constructor(
      @InjectModel(Parking.name) private parkingModel: Model<ParkingDocument>,
  ) {}

  async execute(command: CreateNParkingSpotsCommand):Promise<Parking[]> {
    const { numSpots } = command;

    const parkings = [
    ];

    const spaces = await this.parkingModel.find();
    
    for(let i=0;i<numSpots;i++){
      parkings.push({ parkingNumber : spaces.length + i, visitorEmail: "", enabled: true });
    }
    
    return await this.parkingModel.insertMany(parkings);
  }
}
