from app import app
import os

PORT = os.environ.get("PORT")

if __name__ == "__main__":
    app.run(debug=True,port=PORT)
