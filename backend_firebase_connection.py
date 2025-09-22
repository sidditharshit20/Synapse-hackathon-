# backend/main.py
from fastapi import FastAPI
import firebase_admin
from firebase_admin import credentials, db
import requests
import time

app = FastAPI()

# Initialize Firebase Admin SDK
cred = credentials.Certificate("serviceAccountKey.json")  # Downloaded from Firebase console
firebase_admin.initialize_app(cred, {
    "databaseURL": "https://your-project-id.firebaseio.com"
})

@app.get("/train/{train_no}")
def get_train(train_no: str):
    ref = db.reference(f"trains/{train_no}")
    data = ref.get()

    # Check if cached and fresh (< 3 min old)
    if data and (time.time() - data["last_updated"] < 180):
        return data

    # Otherwise fetch from external API (dummy example)
    response = requests.get(f"https://railradar.in/api/train/{train_no}")
    train_info = response.json()

    # Save to Firebase
    ref.set({
        "info": train_info,
        "last_updated": time.time()
    })

    return train_info