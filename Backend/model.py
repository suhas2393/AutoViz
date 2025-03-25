import os
import json
from dotenv import load_dotenv
from azure.ai.inference import ChatCompletionsClient
from azure.ai.inference.models import SystemMessage, UserMessage
from azure.core.credentials import AzureKeyCredential
from collections import defaultdict

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

def load_data(file_name):
    file_path = os.path.join(DATA_DIR, file_name)
    if os.path.exists(file_path):
        with open(file_path, 'r', encoding="utf-8") as f:
            return json.load(f)
    return None

# Sample input data (you can load it from a JSON file or API call)
data = load_data("clients.json")

# Aggregation logic
def aggregate_data(data):

    data = data.get("data",[])

    output = {
        "connected_devices": 0,
        "devices_per_location": defaultdict(int),
        "instant_port_profile_types": set(),
        "management_issues": defaultdict(int),
        "operating_system_types": set(),
        "total_clients": 0,
        "unconnected_devices": 0,
        "usernames_types": set()
    }
    
    for device in data:
        # Update connected devices count
        if device['connection_status'] == "Connected":
            output['connected_devices'] += 1
        else:
            output['unconnected_devices'] += 1
        
        # Devices per location
        site = device['site'] if device['site'] else "Unknown"
        output['devices_per_location'][site] += 1
        
        # Instant port profile types
        output['instant_port_profile_types'].add(device['instant_port_profile'])
        
        # Management issues counts
        output['management_issues']['has_ip_address_issues'] += device['has_ip_address_issues']
        output['management_issues']['has_port_congestions'] += device['has_port_congestions']
        output['management_issues']['has_port_errors'] += device['has_port_errors']
        output['management_issues']['has_traffic_anomalies'] += device['has_traffic_anomalies']
        
        # Operating system types
        output['operating_system_types'].add(device['operating_system'])
        
        # Total clients count
        output['total_clients'] += 1
        
        # Usernames types
        output['usernames_types'].add(device['username'])
    
    # Convert sets to lists for final output
    output['instant_port_profile_types'] = list(output['instant_port_profile_types'])
    output['operating_system_types'] = list(output['operating_system_types'])
    output['usernames_types'] = list(output['usernames_types'])
    
    return output

# Get the aggregated data
aggregated_output = aggregate_data(data)

# Print the output
print(aggregated_output)

# Optionally: Send this aggregated data to the model for further processing
response = client.complete(
    messages=[UserMessage(str(aggregated_output))],
    max_tokens=1000,
    model=model_name
)

# Print the model's response
print(response.choices[0].message.content)

