from transformers import GPT2LMHeadModel, GPT2Tokenizer
import torch

model_path = "./models/gpt2-code"
model = GPT2LMHeadModel.from_pretrained("gpt2")
tokenizer = GPT2Tokenizer.from_pretrained("gpt2")
tokenizer.pad_token = tokenizer.eos_token

def prompt(input, options):
    inputs = tokenizer(input, return_tensors="pt")

    output = model.generate(
        **inputs,
        max_length=options['max_length'],
        num_return_sequences=options['num_return_sequences'],
        do_sample=True,
        top_k=options['top_k'],
        top_p=options['top_p'],
        temperature=options['temperature'],
        pad_token_id=tokenizer.eos_token_id,
        eos_token_id=tokenizer.eos_token_id
    )

    return tokenizer.decode(output[0], skip_special_tokens=True)
