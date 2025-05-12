from transformers import BlenderbotTokenizer, BlenderbotForConditionalGeneration, Trainer, TrainingArguments
from datasets import Dataset
import torch
import json

# Load dataset
def load_dataset(file_path):
    data = []
    with open(file_path, "r", encoding="utf-8") as file:
        for line in file:
            data.append(json.loads(line))
    return Dataset.from_list(data)

# Initialize model and tokenizer
model_name = "facebook/blenderbot-400M-distill"
tokenizer = BlenderbotTokenizer.from_pretrained(model_name)
model = BlenderbotForConditionalGeneration.from_pretrained(model_name)

# Load training dataset
dataset = load_dataset("dataset.jsonl")

# Tokenize dataset
def tokenize_function(examples):
    inputs = tokenizer(examples["input"], padding="max_length", truncation=True, max_length=128)
    outputs = tokenizer(examples["output"], padding="max_length", truncation=True, max_length=128)
    inputs["labels"] = outputs["input_ids"]
    return inputs

tokenized_datasets = dataset.map(tokenize_function, batched=True)

# Training arguments
training_args = TrainingArguments(
    output_dir="./fine_tuned_model",
    per_device_train_batch_size=2,
    per_device_eval_batch_size=2,
    num_train_epochs=3,
    save_steps=500,
    logging_dir="./logs",
    logging_steps=10
)

# Trainer setup
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=tokenized_datasets
)

# Train model
trainer.train()

# Save fine-tuned model
model.save_pretrained("./fine_tuned_blenderbot")
tokenizer.save_pretrained("./fine_tuned_blenderbot")
