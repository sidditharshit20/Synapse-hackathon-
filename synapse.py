import random
import time
import copy
import threading
from typing import Dict, List, Tuple, Optional

import requests

API_KEY = "http://indianrailapi.com/api/v2/livetrainstatus/apikey/<apikey>/trainnumber/<train_number>/date/<yyyymmdd>/"   # replace with your key
TRAIN_NO = "12727"
DATE = "20250919"  # YYYYMMDD

url = f"http://indianrailapi.com/api/v2/livetrainstatus/apikey/{API_KEY}/trainnumber/{TRAIN_NO}/date/{DATE}/"

resp = requests.get(url)

if resp.status_code == 200:
    data = resp.json()
    print("Train:", data.get("TrainName"))
    print("Number:", data.get("TrainNumber"))
    print("Status:", data.get("Position"))
    print("Current Station:", data.get("CurrentStation"))
    print("Delay (Arrival):", data.get("DelayInArrival"))
else:
    print("Error:", resp.status_code, resp.text)
