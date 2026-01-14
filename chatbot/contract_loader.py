import json
import os

def load_contract():
    """
    Loads the contract JSON file and returns it as a Python dictionary.
    """

    base_dir = os.path.dirname(os.path.abspath(__file__))
    contract_path = os.path.join(base_dir, "..", "data", "sample_contract.json")

    print("Looking for contract at:")
    print(contract_path)

    try:
        with open(contract_path, "r") as file:
            contract_data = json.load(file)
        return contract_data

    except FileNotFoundError:
        raise Exception("Contract JSON file not found.")

    except json.JSONDecodeError:
        raise Exception("Contract JSON is not valid.")
