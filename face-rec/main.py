from PIL import Image
import face_recognition

# Load image in format that face_recognition module understands
def loadImage(path):
    return face_recognition.load_image_file(path)

# Get position data from faces in image
def detectFacesInImage(image):
    face_locations = face_recognition.face_locations(image, number_of_times_to_upsample=0)
    print("I found {} face(s) in this photograph.".format(len(face_locations)))
    return face_locations

# Get position of face in image
def getFaceImages(face_locations):
    for face_location in face_locations:

        top, right, bottom, left = face_location
        print("A face is located at pixel location Top: {}, Left: {}, Bottom: {}, Right: {}".format(top, left, bottom, right))

        face_image = image[top:bottom, left:right]
        pil_image = Image.fromarray(face_image)
        pil_image.show()
        pil_image.save("./testFiles/cropped.jpg")

# Face encoding data for given image returns [] if no faces in image
def getFaceEncodingsFromImage(image):
    faceEncodings = face_recognition.face_encodings(image)
    return faceEncodings

image = loadImage("./testFiles/TestImage.jpg")
getFaceEncodingsFromImage(image)
locations = detectFacesInImage(image)
getFaceImages(locations)
