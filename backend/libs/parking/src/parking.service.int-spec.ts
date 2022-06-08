import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import mongoose from 'mongoose';
import {MongoMemoryServer} from 'mongodb-memory-server';
import { ParkingService } from './parking.service';
import { VisitorInviteService } from '@vms/visitor-invite';
import { MailService } from '@vms/mail';
import { RestrictionsService } from '@vms/restrictions';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

describe('ParkingService Int', () => {
  let service: ParkingService;
  let mongod: MongoMemoryServer;

  beforeEach(async () => {
    let mongod = await MongoMemoryServer.create();
    const module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRootAsync({
          useFactory: async () => ({
            uri: mongod.getUri(),
          }),
        }),
      ],
      providers:[
          ParkingService,
          CommandBus,
          QueryBus,
      ]
     
    }).compile();

    service = module.get<ParkingService>(ParkingService);

    await module.init()
  });

  afterEach(async () => {
    //await module.close();
    await mongoose.disconnect();
    await mongod.stop();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
