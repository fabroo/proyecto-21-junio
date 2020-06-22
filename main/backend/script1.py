import pyshorteners
import json
import sys

s = pyshorteners.Shortener()
print(s.tinyurl.short(sys.argv[1]))