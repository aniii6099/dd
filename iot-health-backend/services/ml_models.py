import numpy as np
from sklearn.ensemble import RandomForestClassifier, IsolationForest

# ==========================================
# 1. SMART FALL DETECTION (Random Forest)
# ==========================================
# Mock training data: [acceleration, bpm]
# 0: Normal Activity, 1: Fall Event
X_fall = np.array([[1.0, 80], [1.2, 85], [3.0, 110], [4.5, 130], [2.8, 90]])
y_fall = np.array([0, 0, 1, 1, 1])
fall_model = RandomForestClassifier(n_estimators=10, random_state=42)
fall_model.fit(X_fall, y_fall)

# ==========================================
# 2. ANOMALY DETECTION (Isolation Forest)
# ==========================================
# Mock baseline vitals for a specific user: [bpm, spo2]
# Using unsupervised learning to detect statistical outliers
X_baseline = np.array([[75, 98], [80, 97], [78, 99], [82, 96], [70, 98]])
anomaly_model = IsolationForest(contamination=0.1, random_state=42)
anomaly_model.fit(X_baseline)

# ==========================================
# 3. EARLY WARNING SYSTEM (Regression/Trend)
# ==========================================
# In a real environment, this would fit a LinearRegression model over a rolling time window.
# We are mocking the inference to warn if the trajectory is trending near hypoxia.

def predict_fall(accel: float, bpm: float) -> str:
    # Random Forest predicts 1 for fall, 0 for normal
    prediction = fall_model.predict([[accel, bpm]])
    return "Fall Predicted" if prediction[0] == 1 else "Normal Activity"

def detect_anomaly(bpm: float, spo2: float) -> str:
    # Isolation Forest predicts -1 for anomaly, 1 for normal
    # But only flag anomaly if they are severely out of standard range
    prediction = anomaly_model.predict([[bpm, spo2]])
    return "Anomaly Detected" if prediction[0] == -1 else "Baseline Normal"

def predict_spo2_trend(current_spo2: float) -> str:
    if current_spo2 <= 92:
        return "Hypoxia Risk in < 5 mins"
    return "Trend Stable"

def get_ml_insights(bpm: float, spo2: float, accel: float) -> dict:
    """Run real-time inference across all 3 Machine Learning models."""
    return {
        "fall_detection": predict_fall(accel, bpm),
        "anomaly_detection": detect_anomaly(bpm, spo2),
        "early_warning": predict_spo2_trend(spo2)
    }
