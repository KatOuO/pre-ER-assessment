from flask import Flask, request, jsonify, render_template
import joblib
import pandas as pd
import json
import numpy as np
import lightgbm
import xgboost
app = Flask(__name__)

# Load models and column references
xgb_model = joblib.load("models/xgb_base.pkl")
lgb_model = joblib.load("models/lgb_base.pkl")
meta_model = joblib.load("models/xgb_meta_model.pkl")

with open("models/xgb_threshold.txt") as f:
    xgb_threshold = float(f.read())
with open("models/lgb_threshold.txt") as f:
    lgb_threshold = float(f.read())
with open("models/meta_threshold.txt") as f:
    meta_threshold = float(f.read())

with open('static/column_reference.json', 'r') as f:
    all_features = json.load(f)

def encode_symptoms(symptoms, all_features):
    features = [1 if f in symptoms else 0 for f in all_features]
    return np.array(features).reshape(1, -1)

def prepare_input(symptoms, age):
    input_data = {feature: 0 for feature in all_features}

    if "age" in input_data:
        input_data["age"] = age

    for s in symptoms:
        if s in input_data:
            input_data[s] = 1

    return pd.DataFrame([input_data])

@app.route("/")
def home():
    return render_template("home.html")

@app.route("/chatbox")
def chatbox_page():
    return render_template("chatbox.html")

@app.route('/api/predict', methods=['POST'])
def predict():
    data = request.json
    symptoms = data.get("symptoms", [])
    age = data.get("age", 30)

    input_df = prepare_input(symptoms, age)

    # Predict with base models
    xgb_proba = xgb_model.predict_proba(input_df)
    lgb_proba = lgb_model.predict_proba(input_df)

    # Predict with meta model
    meta_input = np.hstack([xgb_proba, lgb_proba])
    meta_proba_all = meta_model.predict_proba(meta_input)[0]  # [P(class_0), P(class_1)]
    final_pred = int(meta_proba_all[1] >= meta_threshold)
    confidence = round(float(meta_proba_all[final_pred]), 3)
    label_meaning = map_prediction_to_label(final_pred)

    result = {
        "prediction": final_pred,
        "meaning": label_meaning,
        "confidence": confidence
    }

    print("✅ Sending prediction:", result)
    return jsonify(result)

@app.route('/debug/features', methods=['GET'])
def debug_features():
    try:
        model_features = xgb_model.get_booster().feature_names
        input_features = all_features
        mismatches = [f for f in input_features if f not in model_features]
        extra_in_model = [f for f in model_features if f not in input_features]
        return jsonify({
            "input_feature_count": len(input_features),
            "model_feature_count": len(model_features),
            "missing_in_model": mismatches,
            "extra_in_model": extra_in_model,
            "match": mismatches == [] and extra_in_model == []
        })
    except Exception as e:
        return jsonify({"error": str(e)})

def map_prediction_to_label(pred):
    if pred == 0:
        return "🟥 緊急 Emergency"
    else:
        return "🟧 非緊急 Non-urgent"


import os

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=True, host="0.0.0.0", port=port)
