import sys
from base64 import b64encode, b64decode

data = b64encode(sys.argv[1])
print(data)
sys.stdout.flush()
