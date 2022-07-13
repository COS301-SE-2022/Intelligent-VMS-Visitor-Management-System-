from app import app
import os

PORT = int(os.environ.get('PORT', 33507))

if __name__ == "__main__":
    app.run(debug=True,port=PORT)
