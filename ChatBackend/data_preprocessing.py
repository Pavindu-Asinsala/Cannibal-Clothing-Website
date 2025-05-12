import json
from datasets import Dataset

# Load JSONL dataset
def load_dataset(file_path):
    data = []
    with open(file_path, "r", encoding="utf-8") as file:
        for line in file:
            data.append(json.loads(line))
    return data

# Convert dataset to Hugging Face format
def prepare_huggingface_dataset(jsonl_file):
    data = load_dataset(jsonl_file)
    dataset = Dataset.from_list(data)
    return dataset

# Example usage
if __name__ == "__main__":
    dataset = prepare_huggingface_dataset("dataset.jsonl")
    print(dataset)
