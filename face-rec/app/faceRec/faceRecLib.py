import face_recognition

from app.database import faceEncodingsCollection

# Load image in format that face_recognition module understands
def loadImage(path):
    return face_recognition.load_image_file(path)

# Get position data from faces in image
def getFacesLocationData(image):
    face_locations = face_recognition.face_locations(image, number_of_times_to_upsample=1)
    return face_locations

# Test if face encodings match
def recognizeFace(knownEncodings, testEncoding):
    if len(knownEncodings) > 0:
        return face_recognition.compare_faces(knownEncodings, testEncoding)
    else:
        raise "Empty known encoding list"

# Face encoding data for given image returns [] if no faces in image
def getFaceEncodingsFromImage(image, faceLocations):
    faceEncodings = face_recognition.face_encodings(image, faceLocations)
    return faceEncodings

# Add face encoding to existing entry
def addFaceEncoding(faceEncoding, idNumber):
    return faceEncodingsCollection.update_one(
            {"idNumber": idNumber},
            {"$push": { "encodings": faceEncoding }}
    )

# Store face encoding in database
def storeFace(faceEncoding, idNumber, name):
    return faceEncodingsCollection.insert_one({
        "idNumber": idNumber,
        "name": name,
        "encodings": [faceEncoding.tolist()]
    })

# Get face with largest surface area bounding box
def getLargestFace(faceLocations):
    maxSurface = 0
    maxSurfaceIdx = 0
    for idx, location in enumerate(faceLocations):
        length = location[3] - location[1]
        width = location[0] - location[2]
        if length * width > maxSurface:
            maxSurface = length * width
            maxSurfaceIdx = idx
    return maxSurfaceIdx

def compareFaces(faceEncodings, idNumber):
    knownEncodingsForName = faceEncodingsCollection.find_one({ "idNumber": idNumber })

    if knownEncodingsForName:
        for faceEncoding in faceEncodings:
            matches = recognizeFace(knownEncodingsForName["encodings"], faceEncoding)
            if True in matches:
                return True
        
    return False

def faceRecognition(imageData, idNumber):
    facesLocationData = getFacesLocationData(imageData)
    
    if(len(facesLocationData) > 0):
        encodings = getFaceEncodingsFromImage(imageData, facesLocationData)

        knownEncodingsForName = list(faceEncodingsCollection.find({ idNumber: idNumber }))

        if knownEncodingsForName:
            for faceEncoding in encodings:
                if recognizeFace(knownEncodingsForName, faceEncoding) == True:
                    return True

    return False

