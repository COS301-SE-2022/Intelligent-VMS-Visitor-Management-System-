import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CACHE_MANAGER } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';
import { MailService } from '@vms/mail';
import { ParkingService } from '@vms/parking';
import { removeTrayByInviteIDCommand } from '@vms/receptionist/commands/impl/Tray/removeTrayByInviteID.command';
import { Tray } from '@vms/receptionist/schema/tray.schema';
import { UserService } from "@vms/user";
import { VisitorInviteService } from '@vms/visitor-invite';
import { RestrictionsService } from "@vms/restrictions";
import { SignOutService } from './sign-out.service';
import { ReceptionistService } from '@vms/receptionist';
import { SchedulerRegistry } from '@nestjs/schedule';
import { getModelToken } from '@nestjs/mongoose';
import { User, UserDocument } from '@vms/user/schema/user.schema';
import { Model } from 'mongoose';
import { RewardsService } from '@vms/rewards';

describe('SignOutService', () => {
  let service: SignOutService;
  let inviteService: VisitorInviteService;
  const receptionistService = {
    getTrayByInviteID: jest.fn(()=> {return {}})

  };
  /*eslint-disable*/
  const commandBusMock = {
    execute: jest.fn((command) => {
      if(command instanceof removeTrayByInviteIDCommand) {
        const trays=[];
        const firstTray= new Tray();
        firstTray.trayID=0;
        firstTray.inviteID="someArbitraryString";
        firstTray.containsResidentID=true;
        firstTray.containsVisitorID=true;

        const secondTray= new Tray();
        secondTray.trayID=2;
        secondTray.inviteID="TheSecondInviteIDCheeky";
        secondTray.containsResidentID=true;
        secondTray.containsVisitorID=true;
        trays[0]=firstTray;
        trays[1]=secondTray;
        if(command.inviteID=="someArbitraryString"){
          trays[0]=secondTray;
        }
        return trays
     }
    }),
  };

  const queryBusMock = {
    execute: jest.fn((query) => {
        
    }),
  };
  /*eslint-enable*/

  const scheduleMock = {
    addCronJob: jest.fn(()=>{return {}}),
    deleteCronJob: jest.fn(()=>{return {}}),
  };


  beforeEach(async () => {
    
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [SignOutService,
        VisitorInviteService,
        RestrictionsService,
        UserService,
        ParkingService,
        ReceptionistService,
        RewardsService,
        MailService,
        ConfigService,
        { provide: SchedulerRegistry, useValue: scheduleMock},
        {
          provide: QueryBus, useValue: queryBusMock
        },
        {
          provide: ReceptionistService, useValue: receptionistService 
        },
        {
          provide: getModelToken(User.name),
          useValue: Model,
      },
        {
            provide: CACHE_MANAGER,
            useValue: {
                get: () => {return 'any value'},
                set: () => {return jest.fn()},
            },
        },
        {
          provide: CommandBus, useValue: commandBusMock
        }],
    }).compile();

    service = module.get<SignOutService>(SignOutService);
    inviteService = module.get<VisitorInviteService>(VisitorInviteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it("should sign out", async()=>{
    //Arrange
    receptionistService.getTrayByInviteID.mockReturnValueOnce({trayID:123});
    //Act
    const resp = await service.signOut('dwvsdvsd');
    //Assert
    expect(resp).toEqual(123);
  });

  describe("removeTrayByInviteID", () => {
    it("should delete the first tray", async () => {
      const deleteTray=await service.removeTrayByInviteID("someArbitraryString");
      expect( deleteTray[0].trayID).toEqual(2);
    });
  });
});
