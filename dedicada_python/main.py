import requests
import pickle
import json
import ast
import numpy as np
import os
import time

companyid = '1a2b3c'

def get_data(companyid):
    try:
        print('emepando')
        request = requests.get(
            f'http://localhost:5000/user/get_data/{companyid}')
        response = request.text
        names = json.loads(response)['names']
        names = np.array(names)
        aca = 'D:\GitHub\\proyecto-21-junio\\dedicada_bue\pickle'
        if not os.path.exists(f'{aca}/{companyid}'):
            os.makedirs(f'{aca}/{companyid}')
        f = open(f'{aca}/{companyid}/known_names', 'wb')

        serialized = pickle.dump(names, f, pickle.HIGHEST_PROTOCOL)

        faces = json.loads(response)['faces']
        faces = np.array(faces)

        if not os.path.exists(f'{aca}/{companyid}'):
            os.makedirs(f'{aca}/{companyid}')
        f = open(f'{aca}/{companyid}/known_faces', 'wb')

        serialized = pickle.dump(faces, f, pickle.HIGHEST_PROTOCOL)

        f.close()
        print('done')
    except Exception as err:
        print('error',err)

def getUsers(companyid):
    r = requests.get(f'http://localhost:5000/user/get_user_info/{companyid}')
    response = r.text
    data = json.loads(response)['users']
    return data

def updateDB():
    users = getUsers('1a2b3c')
    r = requests.post('http://localhost:5500/user/update',json = users)
    print(r.status_code)
    response = r.text
    data = json.loads(response)['message']
    print(data)


# get_data(companyid)
updateDB()