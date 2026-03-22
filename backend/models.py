from pymongo import MongoClient
import os
import bcrypt
from datetime import datetime

class MongoDB:
    def __init__(self):
        self.client = None
        self.db = None

    def init_app(self, app):
        from flask import current_app
        # This is a basic PyMongo setup; in production use Flask-PyMongo properly
        self.client = MongoClient(app.config['MONGO_URI'])
        self.db = self.client.get_database()

db = MongoDB()

def hash_password(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def check_password(password, hashed):
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_user(email, password, name):
    user_data = {
        "email": email,
        "password": hash_password(password),
        "name": name,
        "created_at": datetime.utcnow()
    }
    return db.db.users.insert_one(user_data)

def get_user_by_email(email):
    return db.db.users.find_one({"email": email})

def get_user_by_id(user_id):
    from bson.objectid import ObjectId
    return db.db.users.find_one({"_id": ObjectId(user_id)}, {"password": 0})

def save_prediction(user_id, prediction_data):
    from bson.objectid import ObjectId
    record = {
        "user_id": ObjectId(user_id),
        "disease": prediction_data['disease'],
        "confidence": prediction_data['confidence'],
        "symptoms": prediction_data.get('symptoms', []),
        "precautions": prediction_data.get('precautions', []),
        "created_at": datetime.utcnow()
    }
    return db.db.predictions.insert_one(record)

def get_user_predictions(user_id):
    from bson.objectid import ObjectId
    records = list(db.db.predictions.find({"user_id": ObjectId(user_id)}).sort("created_at", -1))
    for r in records:
        r['_id'] = str(r['_id'])
        r['user_id'] = str(r['user_id'])
    return records
