from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from bot import Bot

app = FastAPI()
app.add_middleware(
  CORSMiddleware,
  allow_origins=["*"],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

@app.get("/answer")
async def answer(prompt: str, tries: int = 3):
  response = retry(tries,
    lambda: Bot.prompt(prompt),
    lambda response: len(response) > 0
  )
  return {"answer": response}

@app.get("/answerYN")
async def answerYN(prompt: str, tries: int = 3):
  response = retry(tries,
    lambda: Bot.prompt(prompt),
    lambda response: response[0] in ["y", "n"]
  )
  return {"answer": response}

def retry(tries, method, check):
  result = None
  for _ in range(tries):
    result = method()
    if check(result): return result
  return None