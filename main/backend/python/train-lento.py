import face_recognition
import os
import pickle
import shutil
import time
import sys

try:
    KNOWN_FACES_DIR = sys.argv[1]
    known_faces = []
    known_names = []
    dir_error = './error/'
    companyid = sys.argv[2]
    dir_known = './known/' + companyid
    error_count = 0
    total = 0
    START = time.time() #the code starts here

    for name in os.listdir(KNOWN_FACES_DIR):

        for filename in os.listdir(f'{KNOWN_FACES_DIR}/{name}'): # Next we load every file of faces of known person
            
            image = face_recognition.load_image_file(f'{KNOWN_FACES_DIR}/{name}/{filename}') # Load an image
            
            try:
                encoding = face_recognition.face_encodings(image)[0] # Get 128-dimension face encoding, Always returns a list of found faces, for this purpose we take first face only.
                known_faces.append(encoding) # Append encodings and name
                known_names.append(name)
                if not os.path.exists(f'{dir_known}/{name}'):
                    os.makedirs(f'{dir_known}/{name}')
                shutil.move(f'{KNOWN_FACES_DIR}/{name}/{filename}',f'{dir_known}/{name}/{filename}')
            except:
                os.remove(f'{KNOWN_FACES_DIR}/{name}/{filename}')
                error_count += 1
            total += 1
    if not os.path.exists(f'./pickles/{companyid}'):
        os.makedirs(f'./pickles/{companyid}')
    f = open(f'./pickles/{companyid}/known_faces','wb')
    g = open(f'./pickles/{companyid}/known_names','wb')


    serialized = pickle.dump(known_faces,f, pickle.HIGHEST_PROTOCOL)
    serialized = pickle.dump(known_names,g, pickle.HIGHEST_PROTOCOL)
    f.close()
    g.close()

    END = time.time() #the code ends here
    #total time
    if error_count > 0:
        print(f'tardo { str(int(END - START)+2) } segundos aproximadamente, \n{error_count} de {total} no pudieron ser procesadas, revisa que las fotos no esten movidas y se note la presencia de la cara..')
    else:
        print(f'tardo { str(int(END - START)+2) } segundos aproximadamente, \nse pudieron cargar todas las fotos!')
except Exception as ex:
    print("Err: " + ex)

    #stdout.split("DNI:")[1]. model