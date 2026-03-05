import json
from llm_client import call_llm

STYLE_SYSTEM_PROMPT = """
You are a strict code quality enforcer.
Analyze the given code and return a JSON array of stylistic issues with:
- severity: "warning" | "info"
- category: "style" | "naming" | "formatting" | "best-practice"
- line: line number (if applicable)
- message: clear explanation
- suggestion: how to fix it
Return ONLY valid JSON arrays. No markdown, no backticks.
"""

async def analyze(code: str, language: str):
    prompt = f"Language: {language}\n\nCode:\n{code}"
    response = await call_llm(prompt, STYLE_SYSTEM_PROMPT, use_gemini=False)
    try:
        clean_json = response.strip('` \n').removeprefix('json')
        return json.loads(clean_json)
    except Exception as e:
        print(f"Style Critic parse error: {e}")
        return []
