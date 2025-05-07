from flask import Flask, request, jsonify, render_template
import joblib
import pandas as pd
import json
import os
import numpy as np
import lightgbm
import xgboost
import hashlib
import pickle
import sqlite3
from datetime import datetime

app = Flask(__name__)

CACHE_DIR = "cache/"
os.makedirs(CACHE_DIR, exist_ok=True)

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

def prepare_input_with_cache(symptoms, age):
    cache_key = hashlib.md5(f"{sorted(symptoms)}|{age}".encode()).hexdigest()
    cache_path = os.path.join(CACHE_DIR, f"{cache_key}.pkl")

    if os.path.exists(cache_path):
        print("✅ Loaded input from cache:", cache_key)
        with open(cache_path, "rb") as f:
            return pickle.load(f)

    # Fallback: generate fresh input
    input_df = prepare_input(symptoms, age)
    with open(cache_path, "wb") as f:
        pickle.dump(input_df, f)
    return input_df

def log_submission_db(symptoms, age, followup, result):
    conn = sqlite3.connect("data/triage_submissions.db")
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO submissions (timestamp, age, symptoms, followup, prediction, meaning, confidence, override_reason)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        datetime.now().isoformat(),
        age,
        ", ".join(symptoms),
        json.dumps(followup, ensure_ascii=False),
        result.get("prediction"),
        result.get("meaning"),
        result.get("confidence"),
        result.get("override_reason", "")
    ))

    conn.commit()
    conn.close()


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
    followup = data.get("followup", {})

    # -----------------------------
    # Compute follow-up weight
    # -----------------------------
    def compute_followup_weight(followup_data):
        total = 0
        for key, answers in followup_data.items():
            if isinstance(answers, list):
                for answer in answers:
                    if isinstance(answer, dict) and "weight" in answer:
                        total += answer["weight"]
                    elif isinstance(answer, str) and "|" in answer:
                        try:
                            total += int(answer.split("|")[-1])
                        except:
                            continue
            elif isinstance(answers, (int, float, str)):
                try:
                    total += int(answers)
                except:
                    continue
        return total

    followup_weight = compute_followup_weight(followup)

    # -----------------------------
    # Model Prediction
    # -----------------------------
    input_df = prepare_input_with_cache(symptoms, age)

    xgb_proba = xgb_model.predict_proba(input_df)
    lgb_proba = lgb_model.predict_proba(input_df)

    meta_input = np.hstack([xgb_proba, lgb_proba])
    meta_proba_all = meta_model.predict_proba(meta_input)[0]

    final_pred = int(np.argmax(meta_proba_all))
    confidence = round(float(meta_proba_all[final_pred]), 3)
    label_meaning = map_prediction_to_label(final_pred)

    # -----------------------------
    # Override logic
    # -----------------------------
    override_reason = None
    if final_pred == 1 and followup_weight >= 60:
        final_pred = 0
        confidence = round(float(meta_proba_all[0]), 3)
        label_meaning = map_prediction_to_label(final_pred)
        override_reason = f"Upgraded due to follow-up weight: {followup_weight}"

    result = {
        "prediction": final_pred,
        "meaning": label_meaning,
        "confidence": confidence,
        "class_0_confidence": round(float(meta_proba_all[0]), 3),
        "class_1_confidence": round(float(meta_proba_all[1]), 3),
        "followup_weight": followup_weight,
        "override_reason": override_reason
    }

    print("✅ Sending prediction:", result)
    log_submission_db(symptoms, age, followup, result)
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
    
@app.route("/admin")
def view_submissions():
    conn = sqlite3.connect("data/triage_submissions.db")
    conn.row_factory = sqlite3.Row
    rows = conn.execute("SELECT * FROM submissions ORDER BY id DESC").fetchall()
    conn.close()
    return render_template("admin.html", rows=rows)

def map_prediction_to_label(pred):
    if pred == 0:
        return "🟥 緊急 Emergency"
    else:
        return "🟧 非緊急 Non-urgent"


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 10000)))