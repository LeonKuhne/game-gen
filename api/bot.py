from transformers import T5ForConditionalGeneration, T5Tokenizer

class Bot:
  model_name = "google/flan-t5-large"
  tokenizer = T5Tokenizer.from_pretrained(model_name)
  model = T5ForConditionalGeneration.from_pretrained(model_name, device_map="auto")
  requests = {}

  @staticmethod
  def prompt(text, size=50):
    input_ids = Bot.tokenizer(text, return_tensors="pt").input_ids.to("cuda")
    outputs = Bot.model.generate(input_ids, max_length=size, do_sample=True)
    dirty_string = Bot.tokenizer.decode(outputs[0])
    response = dirty_string.replace("</s>", "").replace("<pad>", "").replace("<unk>", "-").strip()
    if text not in Bot.requests: Bot.requests[text] = 0
    Bot.requests[text] += 1
    print(f"Question: {text} ({Bot.requests[text]})")
    print(f"Answer: {response}")
    return response