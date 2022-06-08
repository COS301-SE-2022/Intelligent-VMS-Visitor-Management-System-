import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import mongoose from 'mongoose';
import { MailService } from './mail.service';
import {MongoMemoryServer} from 'mongodb-memory-server';

describe('MailService Int', () => {
  let service: MailService;
  let mongod: MongoMemoryServer;

  beforeEach(async () => {
    mongod = await MongoMemoryServer.create();
    const module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRootAsync({
          useFactory: async () => ({
            uri: mongod.getUri(),
          }),
        }),
      ],
    }).compile();

    await module.init()
  });

  afterEach(async () => {
    //await module.close();
    await mongoose.disconnect();
    await mongod.stop();
  });

  it.todo('should be defined');
});
