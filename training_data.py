import pandas as pd
import json

# Load feature list
with open("static/column_reference.json", "r", encoding="utf-8") as f:
    all_features = json.load(f)

# Load symptom mapping (Chinese → cc_code)
with open("static/cc_mapping.json", "r", encoding="utf-8") as f:
    cc_mapping = json.load(f)

def prepare_input(symptom_keys, age):
    """
    symptom_keys: list of strings like ['cc_chestpain', 'cc_dyspnea']
    age: int
    returns: pandas DataFrame with one row
    """

    # Initialize all features to 0
    input_dict = {feature: 0 for feature in all_features}

    # Set symptom-related features to 1
    for key in symptom_keys:
        if key in input_dict:
            input_dict[key] = 1

    # Set age
    input_dict["age"] = age

    # Convert to DataFrame
    input_df = pd.DataFrame([input_dict])
    return input_df
