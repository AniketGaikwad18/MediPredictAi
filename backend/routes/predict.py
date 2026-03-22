from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import sys
import os

# Ensure the ml package can be imported
sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from ml.predict import get_predictions
from models import save_prediction, get_user_by_id
from utils.email_service import send_health_report

predict_bp = Blueprint('predict', __name__)

@predict_bp.route('/', methods=['POST'])
@jwt_required()
def predict_disease():
    data = request.get_json()
    if not data or not data.get('symptoms') or not isinstance(data.get('symptoms'), list):
        return jsonify({"error": "Invalid or missing symptoms list"}), 400
        
    symptoms = data['symptoms']
    if len(symptoms) == 0:
        return jsonify({"error": "Please provide at least one symptom"}), 400
        
    # Get prediction
    prediction_result = get_predictions(symptoms)
    if "error" in prediction_result:
        return jsonify({"error": prediction_result["error"]}), 500
        
    # Add input symptoms to result
    prediction_result["symptoms"] = symptoms
    
    # Save to database
    user_id = get_jwt_identity()
    save_prediction(user_id, prediction_result)
    
    # Get user to send email
    user = get_user_by_id(user_id)
    if user and user.get('email'):
        # Trigger async email
        send_health_report(user['email'], user['name'], prediction_result)
        
    return jsonify({
        "message": "Prediction successful",
        "result": prediction_result
    }), 200
