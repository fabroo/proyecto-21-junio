try:
    import pickle
    import sys
    company = sys.argv[1]
    kf = open('./pickles/'+company+'/known_faces','rb')

    print(pickle.load(kf))

except Exception as identifier:
    print(identifier)