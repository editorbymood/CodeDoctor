import json
from llm_client import call_llm

AUDIT_SYSTEM_PROMPT = """
You are a senior software engineer performing a code audit.
Analyze the given code and return a JSON array of issues with:
- severity: "critical" | "warning" | "info"
- category: "bug" | "logic" | "type" | "null-safety"
- line: line number (if applicable)
- message: clear explanation
- suggestion: how to fix it
Return ONLY valid JSON arrays. No markdown, no backticks, no explanations.
"""

async def analyze(code: str, language: str):
    prompt = f"Language: {language}\n\nCode:\n{code}"
    response = await call_llm(prompt, AUDIT_SYSTEM_PROMPT, use_gemini=False)
    try:
        # Strip potential markdown formatting if the model fails instruction adherence
        clean_json = response.strip('` \n').removeprefix('json')
        return json.loads(clean_json)
    except Exception as e:
        print(f"Auditor parse error: {e}")
        return []
