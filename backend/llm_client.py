import os
import openai
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

async def call_llm(prompt: str, system: str, use_gemini: bool = False):
    """
    Dual-Model Setup:
    Use OpenAI (GPT-4o) for audit/security (more precise).
    Use Gemini (1.5 Pro) for refactoring (longer context window for large files).
    """
    if use_gemini:
        model = genai.GenerativeModel("gemini-1.5-pro")
        response = model.generate_content(system + "\n" + prompt)
        return response.text
    else:
        client = openai.AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        res = await client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": system},
                {"role": "user", "content": prompt}
            ],
            temperature=0.2
        )
        return res.choices[0].message.content
