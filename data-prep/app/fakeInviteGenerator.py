import uuid
import random
from faker import Faker
from faker.providers import DynamicProvider
from datetime import datetime, timedelta

from app.database import invitesCollection,groupInvitesCollection,parkingReservationCollection,groupParkingReservationsCollection,trayCollection,userCollection
from app.holidaysSA import ourHolidays

global fake
global invites
global reservations
global trays

fake = Faker()
invites = []
reservations = []
trays = []

# ID Document Provider
doc_provider = DynamicProvider(
    provider_name="doc",
    elements=["RSA-ID", "UP-Student-ID", "Drivers-License"]
)

# Relation provider
relation_provider = DynamicProvider(
    provider_name="relation",
    elements=["family","friend","other"]
)

# Notes provider
notes_provider = DynamicProvider(
    provider_name="notes",
    elements=["","","","","","","Brought Child","Brought Beer","Drunk","Rude","Upset","Weekly visitor"]
)

# Invite state provider
state_provider = DynamicProvider(
    provider_name="state",
    elements=["inActive","signedIn","cancelled","cancelled","signedOut","signedOut","signedOut","signedOut"] # Smaller prob that invite not used
)

# Register Providers
fake.add_provider(doc_provider)
fake.add_provider(relation_provider)
fake.add_provider(notes_provider)
fake.add_provider(state_provider)

def createVisitation(resident_email,visitor_email,visitor_name,id_num,invite_date,relation,invites,fake,trays,reservations):

  activated = False
  invite_id = str(uuid.uuid1())
  req_parking = fake.boolean()
  invite_state = fake.state()
  inTime = ""
  outTime = ""

  if(invite_state != "inActive" and invite_state != "cancelled"):
    trays.append(create_fake_tray(invite_id))
    activated = fake.boolean()
    inTime = fake.date_time_between_dates(invite_date,invite_date).strftime("%Y-%m-%d, %H:%M:%S")
    outTime = fake.date_time_between_dates(invite_date,invite_date).strftime("%Y-%m-%d, %H:%M:%S")

    if(invite_state == "signedIn"):
        invites.append(create_fake_signedIn_invite(invite_id,invite_state,req_parking,resident_email,visitor_email,visitor_name,id_num,invite_date,relation,inTime))
    elif(invite_state == "signedOut"): 
        invites.append(create_fake_signedOut_invite(invite_id,invite_state,req_parking,resident_email,visitor_email,visitor_name,id_num,invite_date,relation,inTime,outTime))
    elif(invite_state == "extended"):
        inTime = fake.date_time_between_dates(invite_date,invite_date+timedelta(days=7)).strftime("%Y-%m-%d, %H:%M:%S")
        outTime = fake.date_time_between_dates(invite_date,invite_date+timedelta(days=7)).strftime("%Y-%m-%d, %H:%M:%S")
        invites.append(create_fake_signedOut_invite(invite_id,invite_state,req_parking,resident_email,visitor_email,visitor_name,id_num,invite_date,relation,inTime,outTime))
        
  else: 
    invites.append(create_fake_invite(invite_id,invite_state,req_parking,resident_email,visitor_email,visitor_name,id_num,invite_date,relation))
    
  if(req_parking):
    reservations.append(create_fake_parkingReservation(invite_id,invite_date,activated))

def create_fake_invite(invite_id,invite_state,req_parking,resident_email,visitor_email,visitor_name,id_num,invite_date,relation):
    return {
      "inviteID": invite_id,
      "userEmail": resident_email,
      "visitorEmail": visitor_email,
      "idDocType": fake.doc(),
      "idNumber": id_num,
      "inviteDate": invite_date.strftime("%Y-%m-%d"),
      "inviteState": invite_state,
      "visitorName": visitor_name,
      "relation": relation,
      "requiresParking": req_parking,
      "notes": fake.notes()
  }

def create_fake_signedOut_invite(invite_id,invite_state,req_parking,resident_email,visitor_email,visitor_name,id_num,invite_date,relation,inTime,outTime):
    return {
      "inviteID": invite_id,
      "userEmail": resident_email,
      "visitorEmail": visitor_email,
      "idDocType": fake.doc(),
      "idNumber": id_num,
      "inviteDate": invite_date.strftime("%Y-%m-%d"),
      "inviteState": invite_state,
      "visitorName": visitor_name,
      "relation": relation,
      "requiresParking": req_parking,
      "notes": fake.notes(),
      "signInTime": inTime,
      "signOutTime": outTime
  }

def create_fake_signedIn_invite(invite_id,invite_state,req_parking,resident_email,visitor_email,visitor_name,id_num,invite_date,relation,inTime):
    return {
      "inviteID": invite_id,
      "userEmail": resident_email,
      "visitorEmail": visitor_email,
      "idDocType": fake.doc(),
      "idNumber": id_num,
      "inviteDate": invite_date.strftime("%Y-%m-%d"),
      "inviteState": invite_state,
      "visitorName": visitor_name,
      "relation": relation,
      "requiresParking": req_parking,
      "notes": fake.notes(),
      "signInTime": inTime,
  }

def create_fake_parkingReservation(invite_id,resDate,activated):
    return {
        "invitationID": invite_id,
        "parkingNumber": random.randint(0,35),
        "reservationDate": resDate.strftime("%Y-%m-%d"),
        "activated": activated
    }

def create_fake_tray(invite_id):
    return {
        "inviteID": invite_id,
        "trayID": random.randint(0,50),
        "containsResidentID": True,
        "containsVisitorID": True
    }

def create_fake_resident(email):
    return{
        "email": email,
        "password": "$2b$10$yWljmYjKC3soHOprL.YUVun/d41SJSzY61PRFMsOMxjfaN.cNe/6q",
        "permission": -1,
        "name": fake.email(),
        "idDocType": "RSA-ID",
        "idNumber": fake.msisdn()
    }

def createInvites(startDate,endDate,maxResidents):
    startDate = datetime.strptime(startDate, '%Y/%m/%d').date()
    endDate = datetime.strptime(endDate, '%Y/%m/%d').date()

    invites = []
    reservations = []

    createVisitation(fake.email(),fake.email(),fake.name(),fake.msisdn(),startDate,fake.relation(),invites,fake,trays,reservations)
    for i in range(1,maxResidents):
        userEmail = fake.email()
        for i in range(1,16):
            visEmail = fake.email()
            visName = fake.name()
            visId = fake.msisdn()
            visRelation = fake.relation()
            if(visRelation == "family"):
                for i in range(1,40):
                    inviteDate = fake.date_between_dates(startDate,endDate)
                    #Saturdays, Fridays, Decembers and holidays are always busier
                    if(inviteDate.weekday()==5 or inviteDate.weekday()==4):
                        for i in range(0,8):
                            createVisitation(fake.email(),fake.email(),fake.name(),fake.msisdn(),inviteDate,fake.relation(),invites,fake,trays,reservations)
                    if(inviteDate.month==12 or inviteDate.month==7):
                        for i in range(0,12):
                            createVisitation(fake.email(),fake.email(),fake.name(),fake.msisdn(),inviteDate,fake.relation(),invites,fake,trays,reservations)
                    if(inviteDate in ourHolidays):
                        for i in range(0,4):
                            createVisitation(fake.email(),fake.email(),fake.name(),fake.msisdn(),inviteDate,fake.relation(),invites,fake,trays,reservations)
                    
                    createVisitation(userEmail,visEmail,visName,visId,inviteDate,visRelation,invites,fake,trays,reservations)
            elif(visRelation == "friend"):
                for i in range(1,65):
                    inviteDate = fake.date_between_dates(startDate,endDate)
                    #Saturdays, Fridays, Decembers and holidays are always busier
                    if(inviteDate.weekday()==5 or inviteDate.weekday()==4):
                        for i in range(0,8):
                            createVisitation(fake.email(),fake.email(),fake.name(),fake.msisdn(),inviteDate,fake.relation(),invites,fake,trays,reservations)
                    if(inviteDate.month==12):
                        for i in range(0,12):
                            createVisitation(fake.email(),fake.email(),fake.name(),fake.msisdn(),inviteDate,fake.relation(),invites,fake,trays,reservations)
                    if(inviteDate in ourHolidays):
                        for i in range(0,4):
                            createVisitation(fake.email(),fake.email(),fake.name(),fake.msisdn(),inviteDate,fake.relation(),invites,fake,trays,reservations)
                    
                    createVisitation(userEmail,visEmail,visName,visId,inviteDate,visRelation,invites,fake,trays,reservations)
            else:
                for i in range(1,8):
                    inviteDate = fake.date_between_dates(startDate,endDate)
                    #Saturdays, Fridays, Decembers and holidays are always busier
                    if(inviteDate.weekday()==5 or inviteDate.weekday()==4):
                        for i in range(0,8):
                           createVisitation(fake.email(),fake.email(),fake.name(),fake.msisdn(),inviteDate,fake.relation(),invites,fake,trays,reservations)
                    if(inviteDate.month==12):
                        for i in range(0,12):
                            createVisitation(fake.email(),fake.email(),fake.name(),fake.msisdn(),inviteDate,fake.relation(),invites,fake,trays,reservations)
                    if(inviteDate in ourHolidays):
                        for i in range(0,4):
                            createVisitation(fake.email(),fake.email(),fake.name(),fake.msisdn(),inviteDate,fake.relation(),invites,fake,trays,reservations)
                    
                    createVisitation(userEmail,visEmail,visName,visId,inviteDate,visRelation,invites,fake,trays,reservations)
                    # for i in range(0,40):
    #     inviteDate = fake.date_between_dates(datetime.strptime("2019/02/02", '%Y/%m/%d').date(),datetime.strptime("2022/09/27", '%Y/%m/%d').date())
    #     if(inviteDate.weekday() == 5 or inviteDate.weekday() == 6):
    #         createVisitation("petualbg@gmail.com","sandra@mail.com","Sandra Booysen","0012120178087",inviteDate,"friend",invites,fake,trays,reservations)
    #     else:
    #         createVisitation("petualbg@gmail.com","carla@mail.com","Carla Alberts","0012120178087",inviteDate,"friend",invites,fake,trays,reservations)

    invitesCollection.insert_many(invites)

    parkingReservationCollection.insert_many(reservations)

    trayCollection.insert_many(trays)

    invitesCollection.aggregate([
    {
        '$group': {
            '_id': '$inviteDate', 
            'numInvites': {
                '$sum': 1
            },
            'numVisitors':{
                '$sum': {
                        '$add': [
                            {'$cond': [
                                {
                                    '$and' : [ 
                                        {
                                            '$ne': [
                                                '$inviteState', 'inActive'
                                            ]
                                        },
                                        {
                                            '$ne': [
                                                '$inviteState', 'cancelled'
                                            ]
                                        }
                                    ]
                                }, 1, 0
                            ]},{
                                '$cond': [
                                    {
                                        '$eq': [
                                            '$inviteState', 'extended'
                                        ]
                                    }, 
                                    { 
                                        '$dateDiff':
                                            {
                                                'startDate': "$signInTime",
                                                'endDate': "$signOutTime",
                                                'unit': "day"
                                            }
                                    }, 0
                                ]
                            }
                        ]
                    }
                }
            }
    }, {
        '$out': 'groupinvites'
    }
    ])

    parkingReservationCollection.aggregate([
    {
        '$group': {
            '_id': '$reservationDate', 
            'numParkings': {
                '$sum': {
                    '$cond': [
                        {
                            '$eq': [
                                '$activated', True
                            ]

                        }, 1, 0
                    ]
                }
            }
        }
    }, {
        '$out': 'groupparkingreservations'
    }
    ])

def resetInviteHistory():
    invitesCollection.delete_many({})
    parkingReservationCollection.delete_many({})
    trayCollection.delete_many({})
    groupInvitesCollection.delete_many({})
    groupParkingReservationsCollection.delete_many({})
    userCollection.delete_many({})


