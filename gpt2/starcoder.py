from transformers import AutoTokenizer, AutoModelForCausalLM

model_name = "Qwen/Qwen2.5-Coder-3B-Instruct"

tokenizer = AutoTokenizer.from_pretrained(model_name, trust_remote_code=True)
model = AutoModelForCausalLM.from_pretrained(
    model_name,
    device_map="auto",              # Handles CPU/GPU automatically
    trust_remote_code=True,         # Required for Qwen models
    torch_dtype="auto",             # Helps with mixed precision
    low_cpu_mem_usage=True          # Important for limited RAM
)

prompt = "Write a Python function to calculate factorial of a number."

inputs = tokenizer(prompt, return_tensors="pt").to(model.device)
outputs = model.generate(**inputs, max_new_tokens=100)
print(tokenizer.decode(outputs[0], skip_special_tokens=True))
