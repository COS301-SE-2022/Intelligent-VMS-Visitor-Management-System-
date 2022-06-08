import { CommandBus, IQuery, QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from '@vms/mail';
import { ParkingService } from '@vms/parking';
import { generateTrayCommand } from '@vms/receptionist/commands/impl/Tray/generateTray.command';
import { getTrayListQuery } from '@vms/receptionist/queries/impl/getTrayList.query';
import { Tray } from '@vms/receptionist/schema/tray.schema';
import { VisitorInviteService } from '@vms/visitor-invite';
import { RestrictionsService } from "@vms/restrictions";
import { SignInService } from './sign-in.service';

describe('SignInService', () => {
  let service: SignInService;
  let inviteService: VisitorInviteService;

  /*eslint-disable*/
  const commandBusMock = {
    execute: jest.fn((command) => {
      if(command instanceof generateTrayCommand) {
        const generateTray= new Tray();
        generateTray.trayID=0;
        generateTray.inviteID="someArbitraryString";
        generateTray.containsResidentID=true;
        generateTray.containsVisitorID=true;
        return generateTray;
     }
    }),
  };

  const queryBusMock = {
    execute: jest.fn((query: IQuery) => {
      if(query instanceof getTrayListQuery) {
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
        return trays
      }
    })
  };
  /*eslint-enable*/

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SignInService,
        VisitorInviteService,
        ParkingService,
        MailService,
        RestrictionsService,
        {
          provide: QueryBus, useValue: queryBusMock
        },
        {
          provide: CommandBus, useValue: commandBusMock
        }],
    }).compile();

    service = module.get<SignInService>(SignInService);
    inviteService = module.get<VisitorInviteService>(VisitorInviteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe("generateTrayID", () => {
    it("should return a valid Tray id", async () => {
      const generatedTrayID=await service.generateTrayID();
      expect( generatedTrayID).toEqual(1);
    });
  });

  describe("generateTray", () => {
    it("should generate a tray", async () => {
      const generatedTray=await service.generateTray("hello",true,true);
      expect( generatedTray.trayID).toEqual(0);
    });
  });


});
