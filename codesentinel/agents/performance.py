import json
from llm_client import call_llm

PERFORMANCE_SYSTEM_PROMPT = """
You are a principal performance engineer specializing in latency and memory optimization.
Analyze the given code for bottlenecks, inefficient Big-O complexity, or memory leaks.
Return a JSON array of issues with:
- severity: "critical" | "warning" | "info"
- category: "performance" | "memory" | "complexity"
- line: line number (if applicable)
- message: clear explanation of the bottleneck
- suggestion: how to optimize
Return ONLY valid JSON arrays. No markdown, no backticks.
"""

async def analyze(code: str, language: str):
    prompt = f"Language: {language}\n\nCode:\n{code}"
    response = await call_llm(prompt, PERFORMANCE_SYSTEM_PROMPT, use_gemini=False)
    try:
        clean_json = response.strip('` \n').removeprefix('json')
        return json.loads(clean_json)
    except Exception as e:
        print(f"Performance Analyst parse error: {e}")
        return []
