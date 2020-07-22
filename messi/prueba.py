from pathlib import Path
from os import path
home = str(Path.home()) + '\\Downloads\\attachment.zip'

print(path.exists(home))