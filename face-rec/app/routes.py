from app import app, APP_ROOT, ALLOWED_EXTENSIONS
from flask import request, redirect, url_for
import json

from app.faceRec.faceRecLib import loadImage, faceRecognition, storeFace, getFaceEncodingsFromImage, getFacesLocationData, getLargestFace, compareFaces, addFaceEncoding

# Parse filename to check if it is valid
def allowedFile(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Create OK response with json data
def createResponse(data):
    return app.response_class(
        response = json.dumps(data),
        status = 200,
        mimetype = 'application/json'
    )

# Endpoint check
@app.route("/")
def home():
    return "facial recognition api"

# Compare faces endpoint
@app.route("/compareFaces", methods=['POST'])
def comparefaces():
    if request.method == "POST":
        if 'file' not in request.files:
            return createResponse({"error": "No file in request"})

        # Get file data from request
        file = request.files['file']

        # Check if file is selected
        if file.filename == '':
            return createResponse({"error": "No file selected"})

        if not request.args.get("idNumber"):
            return createResponse({"error", "No id-number given"})

        if file and allowedFile(file.filename):
            idNumber = request.args.get("idNumber")
            image = loadImage(file)
            faceLocations = getFacesLocationData(image)
            
            # If no faces in image error
            if len(faceLocations) == 0:
                return createResponse({"error": "No Faces Detected"})

            # Get facial encodings for uploaded image
            encodings = getFaceEncodingsFromImage(image, faceLocations)             

            matches = compareFaces(encodings, idNumber)

            # If result is positive, store encoding
            for idx, m in enumerate(matches):
                if m == True:
                    # This makes more sense in a real world scenario, in testing we will be adding a lot of the same face encodings
                    # Adding positive outcomes helps with comparisons in the future
                    addFaceEncoding(encodings[idx], idNumber)
                    return createResponse({"result": True})

            # No matching face was found
            return createResponse({"result": False})


# Store face encoding
@app.route("/storeFace", methods=['POST'])
def storeface():
    if request.method == "POST":

        # Check if file is in request
        if 'file' not in request.files:
            return createResponse({"error": "No file in request"})
        
        # Get file data from request
        file = request.files['file']

        # Check if file is selected
        if file.filename == '':
            return redirect(request.url)

        if not request.args.get("idNumber"):
            return createResponse({"error": "No id-number given"})

        if not request.args.get("name"):
            return createResponse({"error": "No id-number given"})

        # Check if file extension is allowed
        if file and allowedFile(file.filename):
            name = request.args.get("name")
            idNumber = request.args.get("idNumber")

            image = loadImage(file)
            faceLocations = getFacesLocationData(image)
            
            # If no faces in image error
            if len(faceLocations) == 0:
                return createResponse({"error": "No Faces Detected"})

            # Get encodings for faces in image
            encodings = getFaceEncodingsFromImage(image, faceLocations)             

            print("Found {} face(s) in image".format(len(faceLocations)))
            
            # If there is one face in the image store it immediately
            if len(faceLocations) != 1:
                storeFace(encodings[0], idNumber, name)
            else:
                faceIdx = getLargestFace(faceLocations)
                storeFace(encodings[faceIdx], idNumber, name)
            
            return createResponse({"result": True})
        
        return createResponse({"error": "Invalid File"})
