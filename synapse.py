import random
import time
import copy
import threading
from typing import Dict, List, Tuple, Optional

import http.client

conn = http.client.HTTPSConnection("railradar.in")

headers = { 'x-api-key': "rr_live_EXPo2kM5HHtFeQiGlZm6w4FhBJHmlaYj" }

conn.request("GET", "/api/v1/trains/live-map", headers=headers)

res = conn.getresponse()
data = res.read()

print(data.decode("utf-8"))