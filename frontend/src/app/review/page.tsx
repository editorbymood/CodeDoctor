'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import { useToast } from '@/components/Toast';
import styles from './page.module.css';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

const LANGUAGES = [
    'javascript', 'typescript', 'python', 'java', 'cpp', 'c', 'csharp', 'go', 'rust',
    'ruby', 'php', 'swift', 'kotlin', 'scala', 'dart', 'lua', 'perl', 'r', 'sql',
    'html', 'css', 'bash', 'powershell', 'dockerfile', 'elixir', 'erlang', 'haskell',
    'json', 'yaml', 'xml', 'markdown', 'rust'
];

const EXT_TO_LANG: Record<string, string> = {
    js: 'javascript', jsx: 'javascript', ts: 'typescript', tsx: 'typescript',
    py: 'python', java: 'java', cpp: 'cpp', c: 'c', cs: 'csharp',
    go: 'go', rs: 'rust', rb: 'ruby', php: 'php', swift: 'swift',
    kt: 'kotlin', scala: 'scala', r: 'r', sql: 'sql', html: 'html', css: 'css',
    sh: 'bash', json: 'json', yml: 'yaml', yaml: 'yaml', md: 'markdown'
};

const SAMPLE_CODE = `// Example: VULNERABLE PAYLOAD DETECTED
function processUserData(users) {
  const results = [];
  const password = "admin123"; // SEC-001: Hardcoded credentials
  
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    
    // SEC-002: Raw input concatenation (SQL Injection)
    const query = "SELECT * FROM users WHERE id = " + user.id;
    
    try {
      // SEC-003: Dangerous execution context
      const data = eval(user.expression);
      results.push(data);
    } catch(e) {
      // QUALITY-001: Swallowed exception
    }
  }
  return results;
}`;

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001';

// SVGs
const TerminalIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" /></svg>);
const FileCodeIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>);

export default function ReviewPage() {
    const router = useRouter();
    const { showToast } = useToast();
    const [code, setCode] = useState(SAMPLE_CODE);
    const [language, setLanguage] = useState('javascript');
    const [filename, setFilename] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const dropRef = useRef<HTMLDivElement>(null);

    // Keyboard shortcut: Cmd+Enter to submit
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                e.preventDefault();
                if (!isSubmitting && code.trim()) {
                    handleSubmit();
                }
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [code, isSubmitting]);

    // Drag & drop handlers
    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            const ext = file.name.split('.').pop()?.toLowerCase() || '';
            const detectedLang = EXT_TO_LANG[ext];

            if (detectedLang) setLanguage(detectedLang);
            setFilename(file.name);

            const reader = new FileReader();
            reader.onload = (ev) => {
                const content = ev.target?.result as string;
                if (content.length > 100_000) {
                    showToast('File too large (max 100KB)', 'error');
                    return;
                }
                setCode(content);
                showToast(`Loaded ${file.name}`, 'success');
            };
            reader.readAsText(file);
        }
    }, [showToast]);

    const handleSubmit = useCallback(async () => {
        if (!code.trim()) {
            setError('System Error: No payload detected in buffer.');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            const res = await fetch(`${API_URL}/api/review`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code, language, filename: filename || undefined }),
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({ error: 'Request failed' }));
                throw new Error(err.error || 'Pipeline failure: Node unresponsive');
            }

            const data = await res.json();
            showToast('Telemetry connected. Engaging agents...', 'success');
            router.push(`/review/${data.id}`);
        } catch (err: any) {
            setError(err.message || 'Pipeline offline. Connection refused at 127.0.0.1:3001');
            setIsSubmitting(false);
        }
    }, [code, language, filename, router, showToast]);

    const lineCount = code.split('\n').length;
    const charCount = code.length;

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.ambientGlowTop}></div>
            <Navbar />

            <main className={styles.main}>
                <div className={styles.container}>

                    <div className={styles.header}>
                        <div className={styles.titleGroup}>
                            <div className={styles.pulseIndicator}>
                                <div className={styles.pulseDot}></div>
                                <span>SCANNER READY</span>
                            </div>
                            <h1 className={styles.title}>Initialize AST Scan</h1>
                            <p className={styles.subtitle}>Execute deep-architectural and vulnerability analysis against source code payloads.</p>
                        </div>
                    </div>

                    <div
                        className={`${styles.editorWindow} ${isDragging ? styles.dragging : ''}`}
                        ref={dropRef}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        {isDragging && (
                            <div className={styles.dropOverlay}>
                                <FileCodeIcon />
                                <p>Transfer Payload to Buffer</p>
                            </div>
                        )}

                        {/* Terminal Window Header */}
                        <div className={styles.editorHeader}>
                            <div className={styles.headerNav}>
                                <div className={styles.trafficLights}><span></span><span></span><span></span></div>
                                <div className={styles.headerTabs}>
                                    <div className={styles.activeTab}>
                                        <TerminalIcon />
                                        <input
                                            type="text"
                                            className={styles.filenameInput}
                                            value={filename}
                                            onChange={(e) => setFilename(e.target.value)}
                                            placeholder="buffer.tmp"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className={styles.headerTools}>
                                <select
                                    className={styles.languageSelect}
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                >
                                    {LANGUAGES.map(lang => (
                                        <option key={lang} value={lang}>{lang.toUpperCase()}</option>
                                    ))}
                                </select>
                                <div className={styles.telemetryTag}>
                                    {lineCount}L / {charCount}B
                                </div>
                                <button
                                    className={styles.ghostBtn}
                                    onClick={() => { setCode(SAMPLE_CODE); showToast('Sample payload loaded', 'info'); }}
                                >
                                    [SAMPLE]
                                </button>
                                <button
                                    className={styles.ghostBtn}
                                    onClick={() => { setCode(''); setFilename(''); }}
                                >
                                    [FLUSH]
                                </button>
                            </div>
                        </div>

                        {/* Code Body */}
                        <div className={styles.editorBody}>
                            <MonacoEditor
                                height="500px"
                                language={language}
                                value={code}
                                onChange={(value) => setCode(value || '')}
                                theme="vs-dark"
                                options={{
                                    minimap: { enabled: false },
                                    fontSize: 14,
                                    fontFamily: "'JetBrains Mono', 'Menlo', monospace",
                                    lineNumbers: 'on',
                                    scrollBeyondLastLine: false,
                                    wordWrap: 'on',
                                    padding: { top: 24, bottom: 24 },
                                    renderLineHighlight: 'all',
                                    cursorBlinking: 'smooth',
                                    cursorSmoothCaretAnimation: 'on',
                                    smoothScrolling: true,
                                }}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className={styles.errorBanner}>
                            <span className={styles.errorIcon}>!</span>
                            <div>{error}</div>
                        </div>
                    )}

                    <div className={styles.actionRow}>
                        <div className={styles.shortcutContext}>
                            <span>Press <kbd className={styles.kbdStyle}>⌘</kbd> + <kbd className={styles.kbdStyle}>Enter</kbd> to execute</span>
                        </div>
                        <button
                            className={styles.executeBtn}
                            onClick={handleSubmit}
                            disabled={isSubmitting || !code.trim()}
                        >
                            {isSubmitting ? (
                                <>
                                    <span className={styles.btnSpinner}></span> EXECUTING PIPELINE...
                                </>
                            ) : (
                                <>[ ENQUEUE PAYLOAD ]</>
                            )}
                        </button>
                    </div>

                </div>
            </main>
        </div>
    );
}
