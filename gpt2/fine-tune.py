from datasets import load_dataset
from transformers import GPT2Tokenizer, GPT2LMHeadModel, DataCollatorForLanguageModeling, Trainer, TrainingArguments

# Load GPT-2 tokenizer and model
tokenizer = GPT2Tokenizer.from_pretrained("gpt2")
tokenizer.pad_token = tokenizer.eos_token

model = GPT2LMHeadModel.from_pretrained("gpt2")

# Load your dataset
dataset = load_dataset("codeparrot/github-code", trust_remote_code=True)  # Or your own
def tokenize_fn(example):
    return tokenizer(example["content"], truncation=True, padding="max_length", max_length=512)

tokenized = dataset["train"].map(tokenize_fn, batched=True)

# Training setup
collator = DataCollatorForLanguageModeling(tokenizer=tokenizer, mlm=False)
args = TrainingArguments(
    output_dir="./models/gpt2-code",
    per_device_train_batch_size=2,
    num_train_epochs=3,
    save_steps=500,
    logging_dir="./logs",
    fp16=True,
)

trainer = Trainer(
    model=model,
    args=args,
    train_dataset=tokenized,
    data_collator=collator,
)

trainer.train()

model.save_pretrained("./models/gpt2-code")
tokenizer.save_pretrained("./models/gpt2-code")
