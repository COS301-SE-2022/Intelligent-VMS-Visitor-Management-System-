import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from '@vms/mail';
import { ParkingService } from '@vms/parking';
import { removeTrayByInviteIDCommand } from '@vms/receptionist/commands/impl/Tray/removeTrayByInviteID.command';
import { Tray } from '@vms/receptionist/schema/tray.schema';
import { VisitorInviteService } from '@vms/visitor-invite';
import { RestrictionsService } from "@vms/restrictions";
import { SignOutService } from './sign-out.service';
import { ReceptionistService } from '@vms/receptionist';

describe('SignOutService', () => {
  let service: SignOutService;
  let inviteService: VisitorInviteService;
  let receptionistService = {
    getTrayByInviteID: jest.fn(()=> ({}))

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

  beforeEach(async () => {
    
    const module: TestingModule = await Test.createTestingModule({
      providers: [SignOutService,
        VisitorInviteService,
        ParkingService,
        ReceptionistService,
        MailService,
        ConfigService,
        RestrictionsService,
        {
          provide: QueryBus, useValue: queryBusMock
        },
        {
          provide: ReceptionistService, useValue: receptionistService 
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
    receptionistService.getTrayByInviteID.mockReturnValueOnce({});
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
