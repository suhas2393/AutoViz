import os
import json
import pandas as pd
from flask import Flask, jsonify

app = Flask(__name__)

# Directory where JSON files are stored
DATA_DIR = "data"

# Function to load JSON data
def load_data(file_name):
    file_path = os.path.join(DATA_DIR, file_name)
    if os.path.exists(file_path):
        with open(file_path, 'r', encoding="utf-8") as f:
            return json.load(f)
    return None

# Function to analyze alerts data (fully dynamic)
def analyze_alerts(data):
    df = pd.json_normalize(data["data"])  # Flatten nested JSON structures

    return {
        "total_alerts": len(df),
        "high_severity_alerts": df[df["severity"] == "High"].shape[0] if "severity" in df else 0,
        "warning_alerts": df[df["severity"] == "Medium"].shape[0] if "severity" in df else 0,
        "resolved_alerts": df[df["status"] == "Resolved"].shape[0] if "status" in df else 0,
        "active_alerts": df[df["status"] == "Active"].shape[0] if "status" in df else 0,
        "alert_types": df["alert_type"].unique().tolist() if "alert_type" in df else [],
    }

# API to get analyzed data dynamically
@app.route('/alerts', methods=['GET'])
def get_alert_analysis():
    data = load_data("alerts.json")
    if not data:
        return jsonify({"error": "Data not found"}), 404

    analyzed_data = analyze_alerts(data)
    return jsonify(analyzed_data)

# API to get actual JSON data
@app.route('/raw/alerts', methods=['GET'])
def get_raw_alerts():
    data = load_data("alerts.json")
    if not data:
        return jsonify({"error": "Data not found"}), 404

    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)
