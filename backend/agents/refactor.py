from llm_client import call_llm

REFACTOR_SYSTEM_PROMPT = """
You are a precise, highly-skilled Software Refactoring Engine.
Rewrite the provided code to be production-ready. 
Patch all bugs, secure all vulnerabilities, enforce strict style conventions, and optimize the Big-O complexity.
Return ONLY the raw refactored code. No markdown formatting, no backticks, no explanations. 
If no changes are necessary, return the exact original code.
"""

async def rewrite(code: str, language: str):
    prompt = f"Language: {language}\n\nCode:\n{code}"
    # Use Gemini for large context window rewrites
    response = await call_llm(prompt, REFACTOR_SYSTEM_PROMPT, use_gemini=True)
    
    clean_code = response.strip()
    if clean_code.startswith("```"):
        # Strip potential markdown blocks
        lines = clean_code.split("\n")
        if len(lines) > 1:
            clean_code = "\n".join(lines[1:-1])
            
    return clean_code
