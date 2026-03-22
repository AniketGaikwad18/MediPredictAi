from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from openai import OpenAI

chat_bp = Blueprint('chat', __name__)

@chat_bp.route('/', methods=['POST'])
@jwt_required()
def chat():
    data = request.json
    message = data.get('message', '')
    
    if not message:
        return jsonify({"message": "I didn't quite catch that. How can I help?"}), 400

    api_key = current_app.config.get('OPENAI_API_KEY')
    
    if not api_key:
        return jsonify({
            "response": "Chat service is temporarily unavailable (API key missing).",
            "sender": "MediAssist AI",
            "timestamp": "now"
        }), 503

    try:
        client = OpenAI(api_key=api_key)
        
        completion = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are MediAssist AI, a professional medical assistant. Provide helpful, empathetic, and concise medical information. Always include a disclaimer that you are an AI and not a substitute for professional medical advice."},
                {"role": "user", "content": message}
            ],
            max_tokens=250,
            temperature=0.7
        )
        
        response = completion.choices[0].message.content

        return jsonify({
            "response": response,
            "sender": "MediAssist AI",
            "timestamp": "now"
        }), 200
        
    except Exception as e:
        print(f"OpenAI Error: {str(e)}")
        return jsonify({
            "response": "I'm having trouble processing your request right now. Please try again later.",
            "sender": "MediAssist AI",
            "timestamp": "now"
        }), 500
