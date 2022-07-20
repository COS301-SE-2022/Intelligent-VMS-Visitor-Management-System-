from pymongo import MongoClient
import os

client = MongoClient(os.environ["MONGO_DB_CONNECTION_STRING"])
db = client["vms"]
 
invitesCollection = db["invites"]
groupInvitesCollection = db["groupInvites"]