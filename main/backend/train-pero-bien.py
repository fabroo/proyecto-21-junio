try:
    import pickle
    import os
    import face_recognition
    import shutil
    import numpy as np 
    import time
    import sys

    company = sys.argv[1]

    START =time.time()

    kf = open('./pickles/'+company+'/known_faces','rb')
    kn = open('./pickles/'+company+'/known_names','rb')
    known_faces = pickle.load(kf)
    known_names = pickle.load(kn)
    kf.close()
    kn.close()
    new_faces_array = []
    new_names_array = []
    NEW_FACES= f'./fotitos/{company}'

    for i in range(len(known_names)):
        known_names[i].rstrip('\r\n')
    for name in os.listdir(NEW_FACES):
        for filename in os.listdir(f'{NEW_FACES}/{name}'):
            # Load an image
            image = face_recognition.load_image_file(f'{NEW_FACES}/{name}/{filename}')
            try:
                encoding = face_recognition.face_encodings(image)[0]
                new_faces_array.append(encoding)
                new_names_array.append(name)

            except:
                dir_error = './error/'
                if not os.path.exists(f'{dir_error}/{name}'):
                    os.makedirs(f'{dir_error}/{name}')

                shutil.move(f'{NEW_FACES}/{name}/{filename}',f'{dir_error}/{name}/{filename}')
                
        dir_done = f'./known/{company}'
        shutil.move(f'{NEW_FACES}/{name}',f'{dir_done}/{name}')

    arrayPrevio_names = np.array(known_names)
    arrayPrevio_faces = np.array(known_faces)

    arrayNuevo_faces = np.array(new_faces_array)
    arrayNuevo_names = np.array(new_names_array)

    try:
        total_faces = list(np.concatenate((arrayPrevio_faces, arrayNuevo_faces)))
        total_names = list(np.concatenate((arrayPrevio_names, arrayNuevo_names)))

        f = open('./pickles/'+company+'/known_faces','wb')
        g = open('./pickles/'+company+'/known_names','wb')


        serialized = pickle.dump(total_faces,f, pickle.HIGHEST_PROTOCOL)
        serialized = pickle.dump(total_names,g, pickle.HIGHEST_PROTOCOL)
        f.close()
        g.close()
    except:
        pass
    END = time.time()

    print('Terminado en: '+str(int(END-START))+' segundos')
except Exception as ex:
    print("Err: " + ex)