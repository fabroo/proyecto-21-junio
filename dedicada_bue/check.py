try:
    import pickle
    import face_recognition
    import os
    import shutil
    import numpy as np
    import time
    import math
    import sys

    company = '1a2b3c'

    kf = open('./pickle/'+company+'/known_faces','rb')
    kn = open('./pickle/'+company+'/known_names','rb')
    known_faces = pickle.load(kf)
    known_names = pickle.load(kn)
    kf.close()

    kn.close()

    print(known_names)

except Exception as ex:
    print(ex)