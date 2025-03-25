import os
import json
from dotenv import load_dotenv
from flask import Flask, jsonify, request
import pandas as pd
from flask_cors import CORS  # Import CORS
from azure.ai.inference import ChatCompletionsClient
from azure.ai.inference.models import SystemMessage, UserMessage
from azure.core.credentials import AzureKeyCredential

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Directory where JSON files are stored
DATA_DIR = "data"

# Load environment variables from the .env file
load_dotenv()

# Set up the client
endpoint = "https://models.inference.ai.azure.com"
model_name = "DeepSeek-V3"
token = os.getenv('MODEL_ACCESS_TOKEN')

client = ChatCompletionsClient(
    endpoint=endpoint,
    credential=AzureKeyCredential(token),
)

# Function to load JSON data
def load_data(file_name):
    file_path = os.path.join(DATA_DIR, file_name)
    if os.path.exists(file_path):
        with open(file_path, 'r', encoding="utf-8") as f:
            return json.load(f)
    return None

def load_prompt(context):
    prompt_file = f"{context}_prompt.txt"  # File name based on context (alerts, devices, clients)
    file_path = os.path.join(DATA_DIR, prompt_file)
    if os.path.exists(file_path):
        with open(file_path, 'r', encoding="utf-8") as f:
            return f.read()  # Return the content of the text file
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

# Function to analyze device data
def analyze_devices(data):
    devices = data.get("data", [])
    
    total_devices = len(devices)
    connected_devices = sum(1 for d in devices if d.get("connected", False))
    unconnected_devices = total_devices - connected_devices

    device_types = list(set(d.get("product_type") for d in devices if d.get("product_type")))

    locations = {}
    for d in devices:
        site = d.get("locations", {}).get("site", "Unknown")
        locations[site] = locations.get(site, 0) + 1

    healthy_clients_total = sum(d.get("healthy_clients", 0) for d in devices)
    unhealthy_clients_total = sum(d.get("unhealthy_clients", 0) for d in devices)

    firmware_versions = list(set(d.get("software_version") for d in devices if d.get("software_version")))

    config_mismatch_count = sum(1 for d in devices if d.get("config_mismatch", False))

    management_issues = {
        "has_management_ip_issue": sum(1 for d in devices if d.get("has_management_ip_issue", False)),
        "has_default_gateway_issue": sum(1 for d in devices if d.get("has_default_gateway_issue", False)),
        "has_firmware_version_issue": sum(1 for d in devices if d.get("has_firmware_version_issue", False))
    }

    return {
        "total_devices": total_devices,
        "device_types": device_types,
        "connected_devices": connected_devices,
        "unconnected_devices": unconnected_devices,
        "devices_per_location": locations,
        "healthy_clients_total": healthy_clients_total,
        "unhealthy_clients_total": unhealthy_clients_total,
        "firmware_versions": firmware_versions,
        "config_mismatch_count": config_mismatch_count,
        "management_issues": management_issues
    }

# API to get analyzed client data
@app.route('/analyze', methods=['GET'])
def get_analyzed_data():
    context = request.query_string.decode('utf-8')
    print(request)
    data = load_data(f"{context}.json")  # Assuming the data is in a JSON file


    if not data:
        return jsonify({"error": "Data not found"}), 404
    
    # Load the prompt for the current context
    prompt_template = load_prompt(context)

    # Prepare the prompt by inserting the data dynamically into the prompt template
    if prompt_template:
        prompt = prompt_template.format(data=json.dumps(data, indent=2))  # Insert the data into the prompt
    else:
        raise ValueError(f"No prompt found for context: {context}")

    # Send the request to the model
    response = client.complete(
        messages=[{
            "role": "user",
            "content": prompt
        }],
        max_tokens=1000,
        model=model_name
    )

    # Parse and save the response
    parsed_data = json.loads(response.choices[0].message.content[7:-3])

    return parsed_data

# API to get raw clients data
@app.route('/raw/clients', methods=['GET'])
def get_raw_clients():
    data = load_data("clients.json")
    if not data:
        return jsonify({"error": "Data not found"}), 404

    return jsonify(data)

# API to get analyzed alert data dynamically
@app.route('/alerts', methods=['GET'])
def get_alert_analysis():
    data = load_data("alerts.json")
    if not data:
        return jsonify({"error": "Data not found"}), 404

    analyzed_data = analyze_alerts(data)
    return jsonify(analyzed_data)

# API to get raw alerts data
@app.route('/raw/alerts', methods=['GET'])
def get_raw_alerts():
    data = load_data("alerts.json")
    if not data:
        return jsonify({"error": "Data not found"}), 404

    return jsonify(data)

# API to get analyzed device data
@app.route('/devices', methods=['GET'])
def get_device_analysis():
    data = load_data("devices.json")
    if not data:
        return jsonify({"error": "Data not found"}), 404

    analyzed_data = analyze_devices(data)
    return jsonify(analyzed_data)

# API to get raw devices data
@app.route('/raw/devices', methods=['GET'])
def get_raw_devices():
    data = load_data("devices.json")
    if not data:
        return jsonify({"error": "Data not found"}), 404

    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)