try:
    import pickle
    import face_recognition
    import os
    import shutil
    import numpy as np
    import time
    import math
    import sys

    
    #aca hacemos que importe loss datos en la webapp!!!
    company = sys.argv[2]
    kf = open('./pickles/'+company+'/known_faces','rb')
    kn = open('./pickles/'+company+'/known_names','rb')
    known_faces = pickle.load(kf)
    known_names = pickle.load(kn)
    new_array = []
    kf.close()
    kn.close()
    DESIGNATED_NAME = sys.argv[1]
    KNOWN_FACES_DIR = './known/'+company
    START = time.time()
    indiv_names = np.unique(known_names)

    NEW_FACES= './fotitos/'+company

    original = 0
    orignal2 = 0
    #ESTABA TO_DO ADENTRO DEL FOR
    for name in os.listdir(NEW_FACES):
        
        for filename in os.listdir(f'{NEW_FACES}/{name}'):
            image = face_recognition.load_image_file(f'{NEW_FACES}/{name}/{filename}')
            try:
                encoding = face_recognition.face_encodings(image)[0]
                new_array.append(encoding) #amigo esta linea estaba afuera del try que onda bue tiraba esa y manqueaba en los comentarios jaja re developer
                
                original = len(new_array)
                shutil.move(f'{NEW_FACES}/{name}/{filename}',f'{KNOWN_FACES_DIR}/{name}')
            except:
                pass
        # n encodings nuevos
    pingo = False
    numPics = 0
    numAppear = 0
    for i in range(len(known_names)):
        if known_names[i] == DESIGNATED_NAME:
            numPics += 1
            if not pingo:
                numAppear = i
                pingo = True
    elNumero = numAppear + numPics
    original2 = len(new_array)


    hol1 = known_names

    for k in range(len(new_array)):
        y = k + elNumero
        known_faces.insert(y, new_array[k])
        known_names.insert(y, DESIGNATED_NAME)


    f = open('./pickles/'+company+'/known_faces','wb')
    n = open('./pickles/'+company+'/known_names','wb')
    pickle.dump(known_faces,f, pickle.HIGHEST_PROTOCOL)
    pickle.dump(known_names,n, pickle.HIGHEST_PROTOCOL)
    f.close()
    n.close()

    END = time.time()
    print('tardo ' + str(int(END - START)+2) + ' segundos (aprox uwu) checkpoint1: ' + str(hol1) + " checkpoint 2: " +str(known_names))

except Exception as err:
    print(err)
            

 