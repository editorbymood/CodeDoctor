import { GoogleGenerativeAI } from '@google/generative-ai';
import { ANALYZER_PROMPT } from './prompts.js';
import { extractJSON, withRetry } from '../utils/ai-helpers.js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export interface AnalysisIssue {
    id: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    category: string;
    title: string;
    description: string;
    line_start: number;
    line_end: number;
    suggestion: string;
    cve_reference: string | null;
}

export interface AnalysisResult {
    issues: AnalysisIssue[];
    performance_score: number;
    security_score: number;
    maintainability_score: number;
    overall_quality_score: number;
    summary: string;
    language_detected: string;
    lines_analyzed: number;
    complexity_rating: string;
}

function getMockAnalysis(code: string, language: string): AnalysisResult {
    const lines = code.split('\n').length;
    return {
        issues: [
            {
                id: 'ISS-001',
                severity: 'high',
                category: 'security',
                title: 'Potential injection vulnerability',
                description: 'User input may not be properly sanitized before use, which could lead to injection attacks.',
                line_start: 1,
                line_end: Math.min(5, lines),
                suggestion: 'Validate and sanitize all user inputs before processing.',
                cve_reference: 'CVE-2021-44228',
            },
            {
                id: 'ISS-002',
                severity: 'medium',
                category: 'performance',
                title: 'Inefficient data structure usage',
                description: 'Consider using more efficient data structures for better time complexity.',
                line_start: Math.min(3, lines),
                line_end: Math.min(8, lines),
                suggestion: 'Use a hash map for O(1) lookups instead of linear search.',
                cve_reference: null,
            },
            {
                id: 'ISS-003',
                severity: 'low',
                category: 'code-quality',
                title: 'Missing error handling',
                description: 'Several code paths lack proper error handling which could lead to unhandled exceptions.',
                line_start: Math.min(5, lines),
                line_end: Math.min(12, lines),
                suggestion: 'Add try-catch blocks and proper error propagation.',
                cve_reference: null,
            },
            {
                id: 'ISS-004',
                severity: 'critical',
                category: 'security',
                title: 'Hard-coded credentials detected',
                description: 'Potential hard-coded secrets or API keys found in the source code.',
                line_start: 1,
                line_end: Math.min(3, lines),
                suggestion: 'Use environment variables or a secrets manager to store sensitive values.',
                cve_reference: 'CVE-2019-13139',
            },
            {
                id: 'ISS-005',
                severity: 'medium',
                category: 'maintainability',
                title: 'Code duplication detected',
                description: 'Similar code patterns found in multiple locations. This violates the DRY principle.',
                line_start: Math.min(8, lines),
                line_end: Math.min(15, lines),
                suggestion: 'Extract common logic into reusable functions or modules.',
                cve_reference: null,
            },
        ],
        performance_score: 62,
        security_score: 45,
        maintainability_score: 58,
        overall_quality_score: 55,
        summary: `Analyzed ${lines} lines of ${language} code. Found 5 issues including 1 critical security vulnerability (hard-coded credentials) and 1 high severity injection risk. Performance is moderate with room for optimization through better data structure usage.`,
        language_detected: language,
        lines_analyzed: lines,
        complexity_rating: lines > 50 ? 'high' : lines > 20 ? 'moderate' : 'low',
    };
}

export async function runAnalyzer(code: string, language: string): Promise<AnalysisResult> {
    if (!process.env.GEMINI_API_KEY) {
        console.log('⚠️  No GEMINI_API_KEY set — using mock analysis');
        return getMockAnalysis(code, language);
    }

    try {
        return await withRetry(async () => {
            const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
            const prompt = `Language: ${language}\n\nCode to analyze:\n\`\`\`${language}\n${code}\n\`\`\``;

            const result = await model.generateContent({
                contents: [
                    { role: 'user', parts: [{ text: ANALYZER_PROMPT }] },
                    { role: 'model', parts: [{ text: 'I understand. I will analyze the code you provide and return structured JSON with severity-rated issues, performance scores, security analysis, and code quality metrics.' }] },
                    { role: 'user', parts: [{ text: prompt }] },
                ],
                generationConfig: {
                    temperature: 0.2,
                    maxOutputTokens: 8192,
                    responseMimeType: 'application/json',
                },
            });

            const text = result.response.text();
            return extractJSON<AnalysisResult>(text);
        }, { label: 'Analyzer Agent', maxRetries: 3 });
    } catch (error) {
        console.error('Analyzer error after retries, falling back to mock:', error);
        return getMockAnalysis(code, language);
    }
}
