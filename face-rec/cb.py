from pymongo import MongoClient

# MongoDB connection URI
uri = "mongodb+srv://DevLam:O8AkhlZfMtX0Dfic@cluster0.pnhzoxr.mongodb.net/?retryWrites=true&w=majority"

# Create a MongoDB client
client = MongoClient(uri)

db = client['VISITOR_MANAGEMENT_APPLICATION']

# Connect to the MongoDB database
db = client.get_database()

# Define the user schema
user_schema = {
    'username': str,
    'password': str
}

# Create a User collection with the defined schema
user_collection = db.get_collection('User', validator={'$jsonSchema': {'bsonType': 'object', 'properties': user_schema}})

try:
    print("Connected to Database")

    # Create a new user document
    user_document = {
        'username': 'DevLam',
        'password': 'O8AkhlZfMtX0Dfic'
    }

    # Insert the user document into the User collection
    user_collection.insert_one(user_document)

    print("User created")

finally:
    # Close the MongoDB connection
    client.close()

