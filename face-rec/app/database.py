from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

client = MongoClient(os.getenv("MONGO_DB_CONNECTION_STRING"))
db = client["VISITOR_MANAGEMENT_APPLICATION"]

faceEncodingsCollection = db["faceEncodings"]
