import os
import joblib
import pandas as pd

def get_predictions(user_symptoms):
    """
    Given a list of symptoms, returns the predicted disease and guidance.
    """
    base_dir = os.path.dirname(__file__)
    model_path = os.path.join(base_dir, 'model.pkl')
    metadata_path = os.path.join(base_dir, 'metadata.pkl')
    
    if not os.path.exists(model_path) or not os.path.exists(metadata_path):
        return {"error": "Model or metadata not found. Train the model first."}
        
    try:
        model = joblib.load(model_path)
        metadata = joblib.load(metadata_path)
        
        all_symptoms = metadata["symptoms"]
        
        # Create input vector
        input_vector = [0] * len(all_symptoms)
        for symptom in user_symptoms:
            if symptom in all_symptoms:
                index = all_symptoms.index(symptom)
                input_vector[index] = 1
                
        # Predict
        prediction = model.predict([input_vector])[0]
        
        # Determine confidence (probability of the predicted class)
        probabilities = model.predict_proba([input_vector])[0]
        confidence = max(probabilities) * 100
        
        # Get guidance
        guidance = metadata["guidance"].get(prediction, {
            "precautions": ["Consult a doctor for accurate advice."],
            "exercises": ["Light walking"],
            "tips": ["Stay hydrated and rest well."]
        })
        
        return {
            "disease": prediction,
            "confidence": round(confidence, 2),
            "precautions": guidance["precautions"],
            "exercises": guidance["exercises"],
            "tips": guidance["tips"]
        }
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    # Test script locally
    test_symptoms = ["itching", "skin_rash", "nodal_skin_eruptions"]
    print("Testing predictions with:", test_symptoms)
    res = get_predictions(test_symptoms)
    print(res)
