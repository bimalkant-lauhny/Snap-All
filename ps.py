import pyscreenshot
import pickle

ss = pyscreenshot.grab()
ds = pickle.dumps(ss)
print ds
