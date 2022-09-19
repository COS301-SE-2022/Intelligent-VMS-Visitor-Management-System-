import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import mongoose from 'mongoose';
import {MongoMemoryServer} from 'mongodb-memory-server';
import { VisitorInviteService } from '@vms/visitor-invite';
import { MailService } from '@vms/mail';
import { RestrictionsService } from '@vms/restrictions';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ParkingService } from '@vms/parking';

describe('VisitorInviteService Int', () => {
  let service: VisitorInviteService;
  let mongod: MongoMemoryServer;

  beforeEach(async () => {
    const mongod = await MongoMemoryServer.create();
    const module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRootAsync({
          useFactory: async () => {return {
            uri: mongod.getUri(),
          }},
        }),
      ],
      providers:[
          VisitorInviteService,
          ParkingService,
          CommandBus,
          QueryBus,
      ]
     
    }).compile();

    service = module.get<VisitorInviteService>(VisitorInviteService);

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

