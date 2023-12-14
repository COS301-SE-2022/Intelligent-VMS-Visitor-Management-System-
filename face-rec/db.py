from pymongo import MongoClient

# MongoDB connection URI
uri = "mongodb+srv://DevLam:O8AkhlZfMtX0Dfic@cluster0.pnhzoxr.mongodb.net/?retryWrites=true&w=majority"

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
    user = {
        'username': 'MyDevLam',
        'password': 'O8AkhlZfMtX0Dfic'
    }

    # Insert the user document into the User collection
    user.insert_one(user)

    print("User created")

finally:
    # Close the MongoDB connection
    client.close()

