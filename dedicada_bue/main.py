import requests
import pickle
import json
import ast
import numpy as np
import os
import time


def get_data(companyid):
    request = requests.get(
        f'http://localhost:5000/user/get_data/{companyid}')
    response = request.text
    names = json.loads(response)['names']
    names = np.array(names)

    if not os.path.exists(f'D:\pickles\pickle/{companyid}'):
        os.makedirs(f'D:\pickles\pickle/{companyid}')
    f = open(f'{os.getcwd()}/pickle/{companyid}/known_names', 'wb')

    serialized = pickle.dump(names, f, pickle.HIGHEST_PROTOCOL)

    faces = json.loads(response)['faces']
    faces = np.array(faces)

    if not os.path.exists(f'D:\pickles\pickle/{companyid}'):
        os.makedirs(f'D:\pickles\pickle/{companyid}')
    f = open(f'{os.getcwd()}/pickle/{companyid}/known_faces', 'wb')

    serialized = pickle.dump(faces, f, pickle.HIGHEST_PROTOCOL)

    f.close()


companyid = '1a2b3c'
get_data(companyid)
