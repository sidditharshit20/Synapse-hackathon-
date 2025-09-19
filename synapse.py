import random
import time
import copy
import threading
from typing import Dict, List, Tuple, Optional

import requests

API_KEY = "http://indianrailapi.com/api/v2/livetrainstatus/apikey/<apikey>/trainnumber/<train_number>/date/<yyyymmdd>/"
SRC = "NDLS"    # e.g. New Delhi
DEST = "BCT"    # e.g. Mumbai CSTM
DATE = "10-10-2025"

url = f"https://indianrailapi.com/api/v2/between/source/dest/journey/{SRC}/{DEST}/{DATE}"
params = {
    "api_key": API_KEY
}

resp = requests.get(url, params=params)
if resp.status_code == 200:
    data = resp.json()
    # Process data
    print(data)
else:
    print("Error:", resp.status_code, resp.text)