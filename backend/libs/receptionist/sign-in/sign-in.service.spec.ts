import { CommandBus, IQuery, QueryBus } from '@nestjs/cqrs';
import { CACHE_MANAGER } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from "@nestjs/axios";
import { MailService } from '@vms/mail';
import { ParkingService } from '@vms/parking';
import { AssignParkingCommand } from '@vms/parking/commands/impl/assignParking.command';
import { Parking } from '@vms/parking/models/parking.model';
import { ParkingReservation } from '@vms/parking/models/reservation.model';
import { GetInviteReservationQuery } from '@vms/parking/queries/impl/getInviteReservation.query';
import { ReceptionistModule, ReceptionistService } from '@vms/receptionist';
import { generateTrayCommand } from '@vms/receptionist/commands/impl/Tray/generateTray.command';
import { getTrayFromInviteQuery } from '@vms/receptionist/queries/impl/getTrayFromInvite.query';
import { getTrayListQuery } from '@vms/receptionist/queries/impl/getTrayList.query';
import { Tray } from '@vms/receptionist/schema/tray.schema';
import { UserService } from "@vms/user";
import { VisitorInviteService } from '@vms/visitor-invite';
import { Invite } from '@vms/visitor-invite/models/invite.model';
import { GetInviteQuery } from '@vms/visitor-invite/queries/impl/getInvite.query';
import { RestrictionsService } from "@vms/restrictions";
import { SignInService } from './sign-in.service';
import { async } from 'rxjs';
import { SchedulerRegistry } from '@nestjs/schedule';
import { RewardsService } from '@vms/rewards';

import { forwardRef, Inject, Injectable } from '@nestjs/common';

import { SignInInviteCommand } from '@vms/receptionist/commands/impl/signInInvite.command';



import { InviteNotFound } from '../src/errors/inviteNotFound.error';
import { InvalidSignIn } from '../src/errors/invalidSignIn.error';

import { BulkSignInCommand } from '@vms/receptionist/commands/impl/bulkSignIn.command';
import { BSIdata } from '@vms/receptionist/models/BSIdata.model';
import * as FormData from "form-data";
import { HttpService } from '@nestjs/axios';

import { firstValueFrom } from "rxjs";
import { Readable } from 'stream';

describe('SignInService', () => {
  let service: SignInService;
  let inviteService: VisitorInviteService;
  let receptionistService: ReceptionistService;
  let userService: UserService;

  const commandBusMock = {
    execute: jest.fn((command) => {
      if (command instanceof generateTrayCommand) {
        if (command.inviteID === "hello") {
          const generateTray = new Tray();
          generateTray.trayID = 0;
          generateTray.inviteID = "someArbitraryString";
          generateTray.containsResidentID = true;
          generateTray.containsVisitorID = true;
          return generateTray;
        } else if (command.inviteID === "cb7c7938-1c41-427d-833e-2c6b77e0e26b") {
          const generateTray = new Tray();
          generateTray.trayID = 0;
          generateTray.inviteID = "cb7c7938-1c41-427d-833e-2c6b77e0e26b";
          generateTray.containsResidentID = true;
          generateTray.containsVisitorID = true;
          return generateTray;
        } else if (command.inviteID === "f11ae766-ce23-4f27-b428-83cff1afbf04") {
          const generateTray = new Tray();
          generateTray.trayID = 0;
          generateTray.inviteID = "cf11ae766-ce23-4f27-b428-83cff1afbf04";
          generateTray.containsResidentID = true;
          generateTray.containsVisitorID = true;
          return generateTray;
        } else
          return null;
      } else if (command instanceof AssignParkingCommand) {
        const parking = new Parking();
        parking.parkingNumber = 0;
        parking.visitorEmail = "larisabotha@icloud.com";
        return parking;
      }else if (command instanceof SignInInviteCommand) {
        const parking = new Parking();
        parking.parkingNumber = 0;
        parking.visitorEmail = "larisabotha@icloud.com";
        return parking;
      } else
        return null;
    }),
  };

  const queryBusMock = {
    execute: jest.fn((query: IQuery) => {
      if (query instanceof getTrayListQuery) {
        const trays = [];
        const firstTray = new Tray();
        firstTray.trayID = 0;
        firstTray.inviteID = "someArbitraryString";
        firstTray.containsResidentID = true;
        firstTray.containsVisitorID = true;

        const secondTray = new Tray();
        secondTray.trayID = 2;
        secondTray.inviteID = "someArbitraryString1";
        secondTray.containsResidentID = true;
        secondTray.containsVisitorID = true;

        trays[0] = firstTray;
        trays[1] = secondTray;
        return trays
      } else if (query instanceof GetInviteQuery) {
        if (query.inviteID === "cb7c7938-1c41-427d-833e-2c6b77e0e26b") {
          const invite = new Invite();
          invite.inviteID = "cb7c7938-1c41-427d-833e-2c6b77e0e26b";
          const formatYmd = (today: Date) => { return today.toISOString().slice(0, 10) };
          const todayString = formatYmd(new Date());
          invite.inviteDate = todayString;
          invite.requiresParking = true;
          return invite;
        } else if (query.inviteID === "f11ae766-ce23-4f27-b428-83cff1afbf04") {
          const invite = new Invite();
          invite.inviteID = "f11ae766-ce23-4f27-b428-83cff1afbf04";
          const formatYmd = (today: Date) => { return today.toISOString().slice(0, 10) };
          const todayString = formatYmd(new Date());
          invite.inviteDate = todayString;
          invite.requiresParking = false;
          return invite;
        } else if (query.inviteID === "9f296b2e-514c-47bf-ac1b-192e3c66508d") {
          const invite = new Invite();
          invite.inviteID = "9f296b2e-514c-47bf-ac1b-192e3c66508d";
          invite.inviteDate = "2022-02-01";
          invite.requiresParking = false;
          return invite;
        } else
          return null;
      } else if (query instanceof getTrayFromInviteQuery) {
        if (query.inviteID === "cb7c7938-1c41-427d-833e-2c6b77e0e26b") {
          const tray = new Tray();
          tray.trayID = 0;
          tray.inviteID = "cb7c7938-1c41-427d-833e-2c6b77e0e26b";
          tray.containsResidentID = true;
          tray.containsVisitorID = true;
          return tray;
        } else if (query.inviteID === "f11ae766-ce23-4f27-b428-83cff1afbf04") {
          const tray = new Tray();
          tray.trayID = 0;
          tray.inviteID = "f11ae766-ce23-4f27-b428-83cff1afbf04";
          tray.containsResidentID = true;
          tray.containsVisitorID = true;
          return tray;
        } else
          return null;
      } else if (query instanceof GetInviteReservationQuery) {
        if (query.invitationID === "cb7c7938-1c41-427d-833e-2c6b77e0e26b") {
          const reservation = new ParkingReservation();
          reservation.parkingNumber = 0;
          reservation.invitationID = "cb7c7938-1c41-427d-833e-2c6b77e0e26b"
          return reservation;

        } else if (query instanceof GetInviteQuery) {
          if (query.inviteID === "cb7c7938-1c41-427d-833e-2c6b77e0e26b") {

            const invite = new Invite();
            invite.idDocType = "RSA-ID";
            invite.idNumber = "0012120178087";
            invite.userEmail = "admin@mail.com";
            invite.inviteDate = "2022-05-14";
            invite.visitorEmail = "larisabotha@gmail.com";
            invite.inviteID = "cb7c7938-1c41-427d-833e-2c6b77e0e26b";

            return invite;

          } else if (query.inviteID === "f11ae766-ce23-4f27-b428-83cff1afbf04") {

            const invite = new Invite();
            invite.idDocType = "RSA-ID";
            invite.idNumber = "0012120178087";
            invite.userEmail = "admin@mail.com";
            invite.inviteDate = "2022-05-15";
            invite.visitorEmail = "larisabotha@icloud.com";
            invite.inviteID = "f11ae766-ce23-4f27-b428-83cff1afbf04";

            return invite;
          } else {
            return undefined;
          }
        } else
          return [];

      } else
        return null;
    })
  };

  const scheduleMock = {
    addCronJob: jest.fn(()=>{return {}}),
    deleteCronJob: jest.fn(()=>{return {}}),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        SignInService,
        VisitorInviteService,
        ReceptionistService,
        ParkingService,
        MailService,
        UserService,
        RewardsService,
        ConfigService,
        RestrictionsService,
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: () => { return 'any value' },
            set: () => { return jest.fn() },
          },
        },
        { provide: SchedulerRegistry, useValue: scheduleMock},
        {
          provide: QueryBus, useValue: queryBusMock
        },
        {
          provide: CommandBus, useValue: commandBusMock
        }],
    }).compile();

    service = module.get<SignInService>(SignInService);
    inviteService = module.get<VisitorInviteService>(VisitorInviteService);
    receptionistService = module.get<ReceptionistService>(ReceptionistService);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(inviteService).toBeDefined();
    expect(receptionistService).toBeDefined();
  });

  describe("generateTray", () => {
    it("should generate a tray", async () => {
      const generatedTray = await service.generateTray("hello", true, true);
      expect(generatedTray.trayID).toEqual(0);
    });
  });

  describe("signIn", () => {

    it("should return a tray number,assign parking if a valid invite id is given", async () => {
      const trayNr = await service.signIn("cb7c7938-1c41-427d-833e-2c6b77e0e26b", "some notes", "13:02:01");
      expect(trayNr).toEqual(0);
    });

    it("should return a tray number if a valid invite id is given", async () => {
      const trayNr = await service.signIn("f11ae766-ce23-4f27-b428-83cff1afbf04", "some notes", "13:02:01");
      expect(trayNr).toEqual(0);
    });


    it("should throw an exception if invite with wrong date is given", async () => {
      try {
        await service.signIn("9f296b2e-514c-47bf-ac1b-192e3c66508d", "some notes", "13:02:01");
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.message).toEqual('The date on invitation with ID 9f296b2e-514c-47bf-ac1b-192e3c66508d does not match the sign in date')
      }
    });

    it("should throw an exception if invalid invite id is given", async () => {
      try {
        await service.signIn("yay", "some notes", "13:02:01");
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.message).toEqual('Invite not found with id')
      }
    });

  });

  describe('bulkSignIn', () => {
    it('should sign-in in bulk with "id"', async () => {
      // Arrange
      jest.spyOn(inviteService, 'createInviteForBulkSignIn').mockReturnValueOnce(Promise.resolve('hello world'))
      jest.spyOn(commandBusMock as any, 'execute').mockReturnValueOnce([1, 2, 3, 4])


      // Act
      const response = await service.bulkSignIn('id;diinvite;id;di\nhello', 'user.email@email.com');
    
      // Assert
      expect(response).toEqual({"createData": [], "signInData": [undefined]})
    })
    it('should sign-in in bulk with "user"', async () => {
      // Arrange
      jest.spyOn(inviteService, 'createInviteForBulkSignIn').mockReturnValueOnce(Promise.resolve('hello world'))
      jest.spyOn(commandBusMock as any, 'execute').mockReturnValueOnce([1, 2, 3, 4])


      // Act
      const response = await service.bulkSignIn(';user.email', 'user.email@email.com');

      // Assert
      expect(response).toEqual({"createData": [], "signInData": []})
    })
    it('should sign-in in bulk without "user"', async () => {
      // Arrange
      jest.spyOn(inviteService, 'createInviteForBulkSignIn').mockReturnValueOnce(Promise.resolve('hello world'))
      jest.spyOn(commandBusMock as any, 'execute').mockReturnValueOnce([1, 2, 3, 4])


      // Act
      const response = await service.bulkSignIn('name.email', 'user.email@email.com');

      // Assert
      expect(response).toEqual({"createData": [], "signInData": []})
    })
    it('should sign-in in bulk with "name"', async () => {
      // Arrange
      jest.spyOn(inviteService, 'createInviteForBulkSignIn').mockReturnValueOnce(Promise.resolve('hello world'))
      jest.spyOn(commandBusMock as any, 'execute').mockReturnValueOnce([1, 2, 3, 4])


      // Act
      const response = await service.bulkSignIn('name', 'user.email@email.com');

      // Assert
      expect(response).toEqual({"createData": [], "signInData": []})
    })
    it('should sign-in in bulk with "date"', async () => {
      // Arrange
      jest.spyOn(inviteService, 'createInviteForBulkSignIn').mockReturnValueOnce(Promise.resolve('hello world'))
      jest.spyOn(commandBusMock as any, 'execute').mockReturnValueOnce([1, 2, 3, 4])


      // Act
      const response = await service.bulkSignIn('date;', 'user.email@email.com');

      // Assert
      expect(response).toEqual({"createData": [], "signInData": []})
    }) 
  });
    it('should format the given date', async () => {
      // Act
      const today = new Date("1998/01/01");
      const response = await service.formatDate(today);
      

      // Assert
      expect(response).toEqual('1998-01-01')
    })
    describe('Upload Face', () => {
      it('should give an error', async () => {
        // Act
        
        const response = await service.signInFace(false);
      
        // Assert
        expect(response).toEqual({"error": "Invite not found"})
      })

      it('should signInFace', async () => {
        // Act
        const today = new Date();
        const invite={inviteDate:today,requiresParking:true,inviteID:"cb7c7938-1c41-427d-833e-2c6b77e0e26b",notes:"none"}
        const response = await service.signInFace(invite);
      
        // Assert
        expect(response).toBeTruthy
      })
    })
    describe('Upload Face', () => {
      it('should return error regarding ID provided', async () => {
       
        const today = new Date();
        const tempReadable=  new Readable();
        const tempBuffer=new Buffer("hi");
        const testfile2={fieldname:"temp",filename:"test",originalname:"t",encoding:"7",mimetype:"temp",stream:tempReadable,size:7, destination:"temp", path:"temp", buffer:tempBuffer};
        const invite={inviteDate:today,requiresParking:true,inviteID:"cb7c7938-1c41-427d-833e-2c6b77e0e26b",notes:"none"}

        const response = await service.uploadFaceFile(testfile2,"","1","1");
      
        // Assert
        expect(response).toEqual({"error": "No invite id provided"})
      })

      it('should return error regarding pin provided', async () => {
      
        const today = new Date();
        const tempReadable=  new Readable();
        const tempBuffer=new Buffer("hi");
        const testfile2={fieldname:"temp",filename:"test",originalname:"t",encoding:"7",mimetype:"temp",stream:tempReadable,size:7, destination:"temp", path:"temp", buffer:tempBuffer};
        const invite={inviteDate:today,requiresParking:true,inviteID:"cb7c7938-1c41-427d-833e-2c6b77e0e26b",notes:"none"}

        jest.spyOn(userService, 'getUserByEmail').mockReturnValueOnce(Promise.resolve({permission:0,pin:3}))
        const response = await service.uploadFaceFile(testfile2,"1","1","1");
      
        // Assert
        expect(response).toEqual({ "error": "Invalid PIN"})
      })
      it('should return error regarding invite not found', async () => {
      
        const today = new Date();
        const tempReadable=  new Readable();
        const tempBuffer=new Buffer("hi");
        const testfile2={fieldname:"temp",filename:"test",originalname:"t",encoding:"7",mimetype:"temp",stream:tempReadable,size:7, destination:"temp", path:"temp", buffer:tempBuffer};
        const invite={inviteDate:today,requiresParking:true,inviteID:"cb7c7938-1c41-427d-833e-2c6b77e0e26b",notes:"none"}
        jest.spyOn(inviteService, 'getInvite').mockReturnValueOnce(Promise.resolve(''))
        jest.spyOn(userService, 'getUserByEmail').mockReturnValueOnce(Promise.resolve({permission:1,pin:5}))
        const response = await service.uploadFaceFile(testfile2,"1","5","1");
      
        // Assert
        expect(response).toEqual({"error": "Invite not found"})
      })
      it('should return error regarding invite in use', async () => {
      
        const today = new Date();
        const tempReadable=  new Readable();
        const tempBuffer=new Buffer("hi");
        const testfile2={fieldname:"temp",filename:"test",originalname:"t",encoding:"7",mimetype:"temp",stream:tempReadable,size:7, destination:"temp", path:"temp", buffer:tempBuffer};
        const invite={inviteDate:today,requiresParking:true,inviteID:"cb7c7938-1c41-427d-833e-2c6b77e0e26b",notes:"none"}
        jest.spyOn(inviteService, 'getInvite').mockReturnValueOnce(Promise.resolve({inviteState : "signedIn"}))
        jest.spyOn(userService, 'getUserByEmail').mockReturnValueOnce(Promise.resolve({permission:1,pin:5}))
        const response = await service.uploadFaceFile(testfile2,"1","5","1");
      
        // Assert
        expect(response).toEqual({"error": "Invite already used"})
      })

    })
    describe('compare Face File', () => {


      it('should compare a face file', async () => {
        // Act
        const today = new Date();
        const invite={inviteDate:today,requiresParking:true,inviteID:"cb7c7938-1c41-427d-833e-2c6b77e0e26b",notes:"none"}
        const response = await service.compareFaceFile(invite);

        expect(response).toBeTruthy
      })
    })

});
