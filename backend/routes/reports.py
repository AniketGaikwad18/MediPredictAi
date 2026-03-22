from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from models import get_user_predictions

reports_bp = Blueprint('reports', __name__)

@reports_bp.route('/', methods=['GET'])
@jwt_required()
def get_reports():
    user_id = get_jwt_identity()
    reports = get_user_predictions(user_id)
    
    return jsonify({
        "reports": reports
    }), 200
