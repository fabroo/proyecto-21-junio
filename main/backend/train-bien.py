import face_recognition
import os
import pickle
import shutil
import time
import sys

KNOWN_FACES_DIR = sys.argv[1]
known_faces = []
known_names = []
dir_error = './error/'
errors = 0
START = time.time() #the code starts here

for name in os.listdir(KNOWN_FACES_DIR):

    for filename in os.listdir(f'{KNOWN_FACES_DIR}/{name}'): # Next we load every file of faces of known person
        
        image = face_recognition.load_image_file(f'{KNOWN_FACES_DIR}/{name}/{filename}') # Load an image
        
        try:
            encoding = face_recognition.face_encodings(image)[0] # Get 128-dimension face encoding, Always returns a list of found faces, for this purpose we take first face only.
            known_faces.append(encoding) # Append encodings and name
            known_names.append(name)
        except:
            if not os.path.exists(f'{dir_error}/{name}'):
                os.makedirs(f'{dir_error}/{name}')
            shutil.move(f'{KNOWN_FACES_DIR}/{name}/{filename}',f'{dir_error}/{name}/{filename}')

f = open('./pickle/known_faces','wb')
g = open('./pickle/known_names','wb')


serialized = pickle.dump(known_faces,f, pickle.HIGHEST_PROTOCOL)
serialized = pickle.dump(known_names,g, pickle.HIGHEST_PROTOCOL)
f.close()
g.close()

END = time.time() #the code ends here
#total time
data ='Terminado en ' + str(int(END - START)) + ' segundos! Feliz cumple'
print(data)