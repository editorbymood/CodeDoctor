import os
import openai
import google.generativeai as genai
from dotenv import load_dotenv
import asyncio

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

MAX_RETRIES = 2
RETRY_DELAY = 1.0  # seconds, doubles each retry

async def call_llm(prompt: str, system: str, use_gemini: bool = False):
    """
    Dual-Model Setup with retry logic and fallback:
    Use OpenAI (GPT-4o) for audit/security (more precise).
    Use Gemini (1.5 Pro) for refactoring (longer context window for large files).
    If OpenAI fails after retries, falls back to Gemini.
    """
    last_error = None

    for attempt in range(MAX_RETRIES):
        try:
            if use_gemini:
                return await _call_gemini(prompt, system)
            else:
                return await _call_openai(prompt, system)
        except Exception as e:
            last_error = e
            delay = RETRY_DELAY * (2 ** attempt)
            print(f"LLM call failed (attempt {attempt + 1}/{MAX_RETRIES}): {e}. Retrying in {delay}s...")
            await asyncio.sleep(delay)

    # If OpenAI failed, try Gemini as fallback
    if not use_gemini:
        print(f"OpenAI failed after {MAX_RETRIES} retries. Falling back to Gemini...")
        try:
            return await _call_gemini(prompt, system)
        except Exception as e:
            print(f"Gemini fallback also failed: {e}")
            raise e

    raise last_error


async def _call_openai(prompt: str, system: str):
    client = openai.AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    res = await client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": prompt}
        ],
        temperature=0.2,
        timeout=30
    )
    return res.choices[0].message.content


async def _call_gemini(prompt: str, system: str):
    model = genai.GenerativeModel("gemini-1.5-pro")
    response = model.generate_content(system + "\n" + prompt)
    return response.text
