from PIL import Image
import face_recognition

########### Load known encodings ################
encodingMap = {}

def init():
    image = loadImage("./testFiles/TestImage.jpg")
    encodings = getFaceEncodingsFromImage(image, getFacesLocationData(image))
    encodingMap["kyle"] = encodings

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
        matches = face_recognition.compare_faces(knownEncodings, testEncoding)
        return True in matches
    else:
        raise "Empty known encoding list"

# Face encoding data for given image returns [] if no faces in image
def getFaceEncodingsFromImage(image, faceLocations):
    faceEncodings = face_recognition.face_encodings(image, faceLocations)
    return faceEncodings

def faceRecognition(imageData, name):
    facesLocationData = getFacesLocationData(imageData)
    
    if(len(facesLocationData) > 0):
        encodings = getFaceEncodingsFromImage(image, facesLocationData)
        for faceEncoding in encodings:
            print(recognizeFace(encodingMap[name], faceEncoding))
    else:
        print("No faces in image")

# Load known encodings
init()

# Load test image
image = loadImage("./testFiles/Test2.jpg")
faceRecognition(image, "kyle")
