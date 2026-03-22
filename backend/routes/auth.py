from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import datetime
from models import get_user_by_email, create_user, check_password, get_user_by_id

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password') or not data.get('name'):
        return jsonify({"error": "Missing required fields"}), 400
        
    existing_user = get_user_by_email(data['email'])
    if existing_user:
        return jsonify({"error": "User already exists with this email"}), 400
        
    result = create_user(data['email'], data['password'], data['name'])
    
    expires = datetime.timedelta(days=7)
    access_token = create_access_token(identity=str(result.inserted_id), expires_delta=expires)
    
    return jsonify({
        "message": "User registered successfully",
        "token": access_token,
        "user": {"id": str(result.inserted_id), "email": data['email'], "name": data['name']}
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({"error": "Missing email or password"}), 400
        
    user = get_user_by_email(data['email'])
    if not user or not check_password(data['password'], user['password']):
        return jsonify({"error": "Invalid email or password"}), 401
        
    expires = datetime.timedelta(days=7)
    access_token = create_access_token(identity=str(user['_id']), expires_delta=expires)
    
    return jsonify({
        "message": "Login successful",
        "token": access_token,
        "user": {"id": str(user['_id']), "email": user['email'], "name": user['name']}
    }), 200

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_me():
    user_id = get_jwt_identity()
    user = get_user_by_id(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
        
    user['_id'] = str(user['_id'])
    return jsonify({"user": user}), 200
