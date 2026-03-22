import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import joblib
import os

def train_model():
    base_dir = os.path.dirname(__file__)
    data_path = os.path.join(base_dir, 'dataset', 'disease_dataset.csv')
    
    if not os.path.exists(data_path):
        print(f"Dataset not found at {data_path}. Run generate_mock_data.py first.")
        return

    # Load dataset
    df = pd.read_csv(data_path)
    
    # Features and Target
    X = df.drop('prognosis', axis=1)
    y = df['prognosis']
    
    symptoms = list(X.columns)
    diseases = list(y.unique())
    
    # Train-Test Split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Train Model (Random Forest)
    print("Training Random Forest Classifier...")
    rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
    rf_model.fit(X_train, y_train)
    
    # Evaluate
    y_pred = rf_model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Model Accuracy: {accuracy * 100:.2f}%")
    
    # Save Model
    model_path = os.path.join(base_dir, 'model.pkl')
    joblib.dump(rf_model, model_path)
    print(f"Model saved to {model_path}")
    
    # Generate mock precautions, exercises, and tips for each disease
    # In production, these should come from a medical database or CSV
    metadata = {
        "symptoms": symptoms,
        "diseases": diseases,
        "guidance": {}
    }
    
    for disease in diseases:
        metadata["guidance"][disease] = {
            "precautions": [
                "Rest properly and stay hydrated.",
                "Avoid strenuous activities.",
                "Consult a doctor if symptoms persist."
            ],
            "exercises": [
                "Light stretching",
                "Breathing exercises",
                "Short walks"
            ],
            "tips": [
                "Maintain a balanced diet.",
                "Ensure 8 hours of sleep.",
                "Monitor your symptoms daily."
            ]
        }
        
    metadata_path = os.path.join(base_dir, 'metadata.pkl')
    joblib.dump(metadata, metadata_path)
    print(f"Metadata saved to {metadata_path}")

if __name__ == "__main__":
    train_model()
