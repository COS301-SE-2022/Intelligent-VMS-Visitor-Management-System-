from pymongo import MongoClient
import os

# MongoDB connection URI
uri = os.environ.get('MONGO_DB_CONNECTION_STRING')

# Create a MongoDB client
client = MongoClient(uri)

# Connect to a specific MongoDB database (without spaces)
# Replace 'VISITOR_MANAGEMENT_APPLICATION' with a suitable name without spaces
db_name = 'VISITOR_MANAGEMENT_APPLICATION'
db = client[db_name]

# Rest of the code remains unchanged
# ...

try:
    print("Connected to Database")

    # Create a new user document
    user_data = {
      'username': os.environ.get('USERNAME'),
    'password': os.environ.get('PASSWORD')
    }

    # Insert the user document into the User collection
    # user.insert_one(user)

     # Get the User collection from the database
    user_collection = db['User']

     # Insert the user document into the User collection
    user_collection.insert_one(user_data)
    
    print("User created")

finally:
    # Close the MongoDB connection
    client.close()

