from faker import Faker
from faker.providers import DynamicProvider
from datetime import date, timedelta, datetime
from dateutil.relativedelta import relativedelta
from random import randint

from app.database import invitesCollection
from app.holidaysSA import ourHolidays

fake = Faker()

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
    elements=["inActive","signedIn","signedIn","signedOut","signedOut","signedOut","signedOut"] # Smaller prob that invite not used
)

# Register Providers
fake.add_provider(doc_provider)
fake.add_provider(relation_provider)
fake.add_provider(notes_provider)
fake.add_provider(state_provider)

def create_fake_invite(fake,resident_email,visitor_email,visitor_name,id_num,invite_date,relation):
  return {
      "userEmail": resident_email,
      "visitorEmail": visitor_email,
      "idDocType": fake.doc(),
      "idNumber": id_num,
      "inviteDate": invite_date.strftime("%Y-%m-%d"),
      "inviteState": fake.state(),
      "visitorName": visitor_name,
      "relation": relation,
      "notes": fake.notes()
  }

def createInvites(startDate,endDate,maxIterations):
    invites = []
    for i in range(1,maxIterations):
        userEmail = fake.email()
        for i in range(1,20):
            visEmail = fake.email()
            visName = fake.name()
            visRelation = fake.relation()
            visId = fake.msisdn()
            for i in range(1,30):
                inviteDate = fake.date_between_dates(startDate,endDate)
                #Saturday's, Friday's, Decembers and holidays are always busier
                if(inviteDate.weekday()==5 or inviteDate.weekday()==4):
                    for i in range(0,2):
                        invites.append(create_fake_invite(fake,fake.email(),fake.email(),fake.name(),fake.msisdn(),inviteDate,fake.relation()))
                if(inviteDate.month==12):
                    for i in range(0,3):
                        invites.append(create_fake_invite(fake,fake.email(),fake.email(),fake.name(),fake.msisdn(),inviteDate,fake.relation()))
                if(inviteDate in ourHolidays):
                    for i in range(0,1):
                        invites.append(create_fake_invite(fake,fake.email(),fake.email(),fake.name(),fake.msisdn(),inviteDate,fake.relation()))
                invites.append(create_fake_invite(fake,userEmail,visEmail,visName,visId,inviteDate,visRelation))

    #send generated invites to db
    invitesCollection.insert_many(invites)


