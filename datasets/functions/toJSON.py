import pandas as pd
import json

from Extract_features.ExtractFeatures import getDomain
from Environment.path import final_632k_urls

pd.set_option('display.max_columns', None)
pd.set_option('display.width', None)
pd.set_option('display.max_rows', None)

input1 = final_632k_urls

# Load CSV
data1 = pd.read_csv(input1)
data1['domain'] = data1['url'].apply(getDomain)
data1 = data1[data1['type'] == 'phishing']
data1 = data1.drop_duplicates(subset='domain', keep='first')

documents = []
for _, row in data1.iterrows():
    document = {
        "domain": row["domain"],
        "type": row['type']
    }
    documents.append(document)

with open("final_of_final_632k_urls.json", "w") as f:
    json.dump(documents, f, indent=4)

print("JSON file created successfully!")
