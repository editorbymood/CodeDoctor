/**
 * Shared AI utilities — JSON extraction, retry logic, timing.
 */

/** Strip markdown fences and extract raw JSON from LLM responses */
export function extractJSON<T>(raw: string): T {
    let text = raw.trim();

    // Strip ```json ... ``` fences
    const fenceMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)```/);
    if (fenceMatch) {
        text = fenceMatch[1].trim();
    }

    // Strip leading/trailing non-JSON characters (some models prefix with text)
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}');
    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
        text = text.substring(jsonStart, jsonEnd + 1);
    }

    return JSON.parse(text) as T;
}

/** Retry an async function with exponential backoff */
export async function withRetry<T>(
    fn: () => Promise<T>,
    options: { maxRetries?: number; baseDelayMs?: number; label?: string } = {},
): Promise<T> {
    const { maxRetries = 3, baseDelayMs = 1000, label = 'operation' } = options;
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error instanceof Error ? error : new Error(String(error));
            if (attempt < maxRetries) {
                const delay = baseDelayMs * Math.pow(2, attempt - 1) + Math.random() * 500;
                console.warn(`⚠️  ${label} attempt ${attempt}/${maxRetries} failed: ${lastError.message}. Retrying in ${Math.round(delay)}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }

    throw lastError!;
}

/** Measure execution time of an async function */
export async function timed<T>(
    fn: () => Promise<T>,
): Promise<{ result: T; durationMs: number }> {
    const start = performance.now();
    const result = await fn();
    const durationMs = Math.round(performance.now() - start);
    return { result, durationMs };
}
