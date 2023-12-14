import os
from pymongo import MongoClient

# MongoDB connection URI
uri = os.environ.get('MONGO_DB_CONNECTION_STRING')

# Create a MongoDB client
client = MongoClient(uri)

db = client['VISITOR_MANAGEMENT_APPLICATION']

# Connect to the MongoDB database
# db = client.get_database()

# # Define the user schema
# user_schema = {
#     'username': str,
#     'password': str
# }

# Define the user schema
user_schema = {
    'bsonType': 'object',
    'properties': {
        'username': {'bsonType': 'string'},
        'password': {'bsonType': 'string'}
    }
}


# Create a User collection with the defined schema
# user_collection = db.get_collection('User', validator={'$jsonSchema': {'bsonType': 'object', 'properties': user_schema}})

# Create a User collection with the defined schema
db.create_collection('User', validator={'$jsonSchema': user_schema})


try:
    print("Connected to Database")

    # Create a new user document
    user_document = {
        'username': os.environ.get('USERNAME'),
        'password': os.environ.get('PASSWORD')
    }

    # Insert the user document into the User collection
    db['User'].insert_one(user_document)

    print("User created")

finally:
    # Close the MongoDB connection
    client.close()