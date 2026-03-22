import os
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from models import db

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Enable CORS
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Init extensions
    db.init_app(app)
    jwt = JWTManager(app)

    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({"status": "healthy", "message": "MediPredict API is running"}), 200

    # Register blueprints
    from routes.auth import auth_bp
    from routes.predict import predict_bp
    from routes.reports import reports_bp
    from routes.chat import chat_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(predict_bp, url_prefix='/api/predict')
    app.register_blueprint(reports_bp, url_prefix='/api/reports')
    app.register_blueprint(chat_bp, url_prefix='/api/chat')

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=int(os.environ.get('PORT', 5000)))
