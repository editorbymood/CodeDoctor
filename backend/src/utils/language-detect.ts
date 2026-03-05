const EXTENSION_MAP: Record<string, string> = {
    '.js': 'javascript', '.jsx': 'javascript', '.mjs': 'javascript', '.cjs': 'javascript',
    '.ts': 'typescript', '.tsx': 'typescript', '.mts': 'typescript',
    '.py': 'python', '.pyw': 'python', '.pyi': 'python',
    '.java': 'java',
    '.cpp': 'cpp', '.cc': 'cpp', '.cxx': 'cpp', '.hpp': 'cpp', '.h': 'cpp',
    '.c': 'c',
    '.cs': 'csharp',
    '.go': 'go',
    '.rs': 'rust',
    '.rb': 'ruby', '.erb': 'ruby',
    '.php': 'php',
    '.swift': 'swift',
    '.kt': 'kotlin', '.kts': 'kotlin',
    '.scala': 'scala',
    '.dart': 'dart',
    '.lua': 'lua',
    '.pl': 'perl', '.pm': 'perl',
    '.r': 'r', '.R': 'r',
    '.sql': 'sql',
    '.html': 'html', '.htm': 'html',
    '.css': 'css', '.scss': 'scss', '.sass': 'sass', '.less': 'less',
    '.xml': 'xml', '.xsl': 'xml',
    '.json': 'json',
    '.yaml': 'yaml', '.yml': 'yaml',
    '.toml': 'toml',
    '.md': 'markdown',
    '.sh': 'bash', '.bash': 'bash', '.zsh': 'bash',
    '.ps1': 'powershell',
    '.bat': 'batch', '.cmd': 'batch',
    '.dockerfile': 'dockerfile',
    '.ex': 'elixir', '.exs': 'elixir',
    '.erl': 'erlang',
    '.hs': 'haskell',
    '.ml': 'ocaml', '.mli': 'ocaml',
    '.clj': 'clojure', '.cljs': 'clojure',
    '.fs': 'fsharp', '.fsx': 'fsharp',
    '.jl': 'julia',
    '.nim': 'nim',
    '.zig': 'zig',
    '.v': 'v',
    '.sol': 'solidity',
    '.vue': 'vue',
    '.svelte': 'svelte',
    '.tf': 'terraform',
    '.groovy': 'groovy', '.gvy': 'groovy',
    '.m': 'objective-c', '.mm': 'objective-c',
    '.asm': 'assembly', '.s': 'assembly',
    '.pas': 'pascal',
    '.vb': 'visual-basic',
    '.coffee': 'coffeescript',
};

const CONTENT_PATTERNS: [RegExp, string][] = [
    [/^#!\s*\/.*\bpython/, 'python'],
    [/^#!\s*\/.*\bnode/, 'javascript'],
    [/^#!\s*\/.*\bbash/, 'bash'],
    [/^#!\s*\/.*\bruby/, 'ruby'],
    [/^#!\s*\/.*\bperl/, 'perl'],
    [/\bimport\s+React\b/, 'javascript'],
    [/\bfrom\s+\w+\s+import\b/, 'python'],
    [/\bdef\s+\w+\s*\(.*\)\s*:/, 'python'],
    [/\bfunc\s+\w+\s*\(/, 'go'],
    [/\bfn\s+\w+\s*\(/, 'rust'],
    [/\bpublic\s+static\s+void\s+main/, 'java'],
    [/\bpackage\s+\w+;/, 'java'],
    [/\busing\s+System;/, 'csharp'],
    [/\bnamespace\s+\w+\s*{/, 'csharp'],
    [/\bconst\s+\w+\s*:\s*\w+/, 'typescript'],
    [/\binterface\s+\w+\s*{/, 'typescript'],
    [/^\s*<\?php/, 'php'],
    [/\bSELECT\s+.*\bFROM\b/i, 'sql'],
    [/\b(CREATE|ALTER|DROP)\s+TABLE\b/i, 'sql'],
    [/\bmodule\s+\w+\s+exposing/, 'elm'],
    [/\bdefmodule\s+\w+/, 'elixir'],
];

export function detectLanguage(code: string, filename?: string): string {
    // Try extension-based detection first
    if (filename) {
        const ext = '.' + filename.split('.').pop()?.toLowerCase();
        if (ext && EXTENSION_MAP[ext]) {
            return EXTENSION_MAP[ext];
        }
    }

    // Try content-based detection
    const firstLines = code.split('\n').slice(0, 10).join('\n');
    for (const [pattern, lang] of CONTENT_PATTERNS) {
        if (pattern.test(firstLines)) {
            return lang;
        }
    }

    // Broader content check
    for (const [pattern, lang] of CONTENT_PATTERNS) {
        if (pattern.test(code)) {
            return lang;
        }
    }

    return 'plaintext';
}

export function getSupportedLanguages(): string[] {
    const languages = new Set(Object.values(EXTENSION_MAP));
    return Array.from(languages).sort();
}
