import json
from llm_client import call_llm

SECURITY_SYSTEM_PROMPT = """
You are a senior Application Security Architect.
Analyze the given code for potential vulnerabilities (XSS, SQLi, CSRF, insecure auth, etc.).
Return a JSON array of issues with:
- severity: "critical" | "warning"
- category: "security" | "crypto" | "data-leak"
- line: line number (if applicable)
- message: clear explanation of the vulnerability
- suggestion: how to remediate
Return ONLY valid JSON arrays. No markdown, no backticks.
"""

async def analyze(code: str, language: str):
    prompt = f"Language: {language}\n\nCode:\n{code}"
    response = await call_llm(prompt, SECURITY_SYSTEM_PROMPT, use_gemini=False)
    try:
        clean_json = response.strip('` \n').removeprefix('json')
        return json.loads(clean_json)
    except Exception as e:
        print(f"Security Scanner parse error: {e}")
        return []
