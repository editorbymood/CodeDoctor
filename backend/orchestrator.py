import asyncio
from agents import auditor, style, security, performance, refactor

AGENT_TIMEOUT = 30  # seconds per agent

def aggregate_results(results):
    auditor_res, style_res, sec_res, perf_res, refactored = results
    
    # Calculate Algorithm Score (Phase 4 Specification)
    # Weighted: Bugs (40%) + Security (30%) + Style (15%) + Performance (15%)
    bugs_count = len(auditor_res)
    sec_count = len(sec_res)
    style_count = len(style_res)
    perf_count = len(perf_res)
    
    weighted_pts = (bugs_count * 40) + (sec_count * 30) + (style_count * 15) + (perf_count * 15)
    score = max(0, 100 - weighted_pts)
    
    all_issues = auditor_res + style_res + sec_res + perf_res
    
    return {
        "score": score,
        "breakdown": {
            "bugs": bugs_count,
            "security": sec_count,
            "style": style_count,
            "performance": perf_count
        },
        "issues": all_issues,
        "refactoredCode": refactored
    }

async def run_agent_and_yield(agent_name, agent_coro, queue):
    await queue.put({"type": "status", "agent": agent_name, "status": "running"})
    try:
        result = await asyncio.wait_for(agent_coro, timeout=AGENT_TIMEOUT)
        await queue.put({"type": "result", "agent": agent_name, "data": result})
        await queue.put({"type": "status", "agent": agent_name, "status": "completed"})
    except asyncio.TimeoutError:
        print(f"Agent '{agent_name}' timed out after {AGENT_TIMEOUT}s")
        await queue.put({"type": "status", "agent": agent_name, "status": "error", "message": f"Agent timed out after {AGENT_TIMEOUT}s"})
    except Exception as e:
        print(f"Agent '{agent_name}' failed: {e}")
        await queue.put({"type": "status", "agent": agent_name, "status": "error", "message": str(e)})

async def run_all_agents_stream(code: str, language: str):
    import json
    queue = asyncio.Queue()
    
    # Fire off simultaneous tasks
    tasks = [
        asyncio.create_task(run_agent_and_yield("auditor", auditor.analyze(code, language), queue)),
        asyncio.create_task(run_agent_and_yield("style", style.analyze(code, language), queue)),
        asyncio.create_task(run_agent_and_yield("security", security.analyze(code, language), queue)),
        asyncio.create_task(run_agent_and_yield("performance", performance.analyze(code, language), queue)),
        asyncio.create_task(run_agent_and_yield("refactor", refactor.rewrite(code, language), queue)),
    ]
    
    results_map = {}
    completed_agents = 0
    total_agents = len(tasks)
    
    yield f"data: {json.dumps({'type': 'init', 'message': 'Boot Sequence Initiated'})}\n\n"
    
    while completed_agents < total_agents:
        msg = await queue.get()
        yield f"data: {json.dumps(msg)}\n\n"
        
        if msg["type"] == "result":
            results_map[msg["agent"]] = msg["data"]
        elif msg["type"] == "status" and msg["status"] in ["completed", "error"]:
            completed_agents += 1
            
    # Compile final aggregated payload — gracefully handle missing agents
    ordered_res = [
        results_map.get("auditor", []),
        results_map.get("style", []),
        results_map.get("security", []),
        results_map.get("performance", []),
        results_map.get("refactor", "")
    ]
    
    final_payload = aggregate_results(ordered_res)
    yield f"data: {json.dumps({'type': 'final', 'data': final_payload})}\n\n"

async def run_all_agents(code: str, language: str):
    """
    Legacy synchronous endpoint for non-streaming clients.
    Each agent runs with a timeout; failures are gracefully handled.
    """
    async def safe_run(coro, default):
        try:
            return await asyncio.wait_for(coro, timeout=AGENT_TIMEOUT)
        except (asyncio.TimeoutError, Exception) as e:
            print(f"Agent failed in non-stream mode: {e}")
            return default

    results = await asyncio.gather(
        safe_run(auditor.analyze(code, language), []),
        safe_run(style.analyze(code, language), []),
        safe_run(security.analyze(code, language), []),
        safe_run(performance.analyze(code, language), []),
        safe_run(refactor.rewrite(code, language), ""),
    )
    return aggregate_results(results)
