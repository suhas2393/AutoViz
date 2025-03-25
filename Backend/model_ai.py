import os
import json
from azure.ai.inference import ChatCompletionsClient
from azure.ai.inference.models import SystemMessage, UserMessage
from azure.core.credentials import AzureKeyCredential
from collections import defaultdict

# Set up the client
endpoint = "https://models.inference.ai.azure.com"
model_name = "DeepSeek-V3"
token = "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"

client = ChatCompletionsClient(
    endpoint=endpoint,
    credential=AzureKeyCredential(token),
)
DATA_DIR = "data"

def load_data(file_name):
    file_path = os.path.join(DATA_DIR, file_name)
    if os.path.exists(file_path):
        with open(file_path, 'r', encoding="utf-8") as f:
            return json.load(f)
    return None

# Sample input data (you can load it from a JSON file or API call)
data = load_data("clients.json")

# Prepare a prompt for the model
prompt = f"""
Here is a list of network device data:

{json.dumps(data, indent=2)}

Please analyze this data and provide a summary with the following aggregated information:

1. The total number of connected devices.
2. A breakdown of the devices per location (site).
3. A list of unique instant port profile types used.
4. A count of management issues, including:
   - Number of devices with IP address issues.
   - Number of devices with port congestion.
   - Number of devices with port errors.
   - Number of devices with traffic anomalies.
5. A list of unique operating system types.
6. The total number of clients.
7. The total number of unconnected devices.
8. A list of unique usernames.
9. Give me some insights as well on the data

Please return the result as a json object like this. And always keep same format:
    "connected_devices": <int>,
    "devices_per_location": <dict>,
    "instant_port_profile_types": <list>,
    "management_issues": <dict>,
    "operating_system_types": <list>,
    "total_clients": <int>,
    "unconnected_devices": <int>,
    "usernames_types": <list>
    "insights" : <list>
"""

# Send the request to the model
response = client.complete(
    messages=[{
        "role": "user",
        "content": prompt
    }],
    max_tokens=1000,
    model=model_name
)

# Print the response
parsed_data = json.loads(response.choices[0].message.content[7:-3])

file_path = 'output.json'

# Write the parsed data to a JSON file
with open(file_path, 'w') as output_file:
    json.dump(parsed_data, output_file, indent=4)