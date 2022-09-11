from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

client = MongoClient(os.getenv("MONGO_DB_CONNECTION_STRING"))
db = client["vms"]
 
invitesCollection = db["invites"]
groupInvitesCollection = db["groupinvites"]
groupParkingReservationsCollection = db["groupparkingreservations"]
parkingReservationCollection = db["parkingreservations"]
trayCollection = db["trays"]
