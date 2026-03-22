import React, { useRef, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import LanguageSelector from './LanguageSelector';
import { Upload } from 'lucide-react';

export default function CodeEditor({ code, setCode, language, setLanguage, isAnalyzing }) {
    const fileInputRef = useRef(null);
    const [isDragging, setIsDragging] = React.useState(false);

    const lineCount = code ? code.split('\n').length : 0;

    const handleFileRead = useCallback((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result;
            if (typeof text === 'string') {
                setCode(text);
                // Auto-detect language from extension
                const ext = file.name.split('.').pop()?.toLowerCase();
                const extMap = {
                    py: 'python', js: 'javascript', ts: 'typescript', tsx: 'typescript',
                    jsx: 'javascript', java: 'java', go: 'go', rs: 'rust',
                    cpp: 'cpp', cc: 'cpp', c: 'cpp', cs: 'csharp', php: 'php',
                    rb: 'ruby', kt: 'kotlin', swift: 'swift'
                };
                if (ext && extMap[ext]) setLanguage(extMap[ext]);
            }
        };
        reader.readAsText(file);
    }, [setCode, setLanguage]);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer?.files?.[0];
        if (file) handleFileRead(file);
    }, [handleFileRead]);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback(() => {
        setIsDragging(false);
    }, []);

    const handleFileSelect = useCallback((e) => {
        const file = e.target?.files?.[0];
        if (file) handleFileRead(file);
    }, [handleFileRead]);

    return (
        <div
            className={`flex flex-col h-full bg-white border-4 border-black shadow-[6px_6px_0px_#000] overflow-hidden relative ${isDragging ? 'ring-4 ring-[var(--accent-cyan)]' : ''}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
        >
            {/* Drag Overlay */}
            {isDragging && (
                <div className="absolute inset-0 z-50 bg-[var(--accent-cyan)] bg-opacity-90 border-4 border-dashed border-black flex items-center justify-center">
                    <div className="text-black font-black text-3xl uppercase bg-white border-4 border-black px-8 py-4 shadow-[6px_6px_0px_#000] rotate-2">
                        DROP YOUR FILE HERE 💀
                    </div>
                </div>
            )}

            {/* Editor Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-[var(--accent-cyan)] border-b-4 border-black">
                <div className="flex items-center gap-4">
                    <div className="flex gap-2">
                        <div className="w-4 h-4 rounded-full border-2 border-black bg-[#ff5f56]"></div>
                        <div className="w-4 h-4 rounded-full border-2 border-black bg-[#ffbd2e]"></div>
                        <div className="w-4 h-4 rounded-full border-2 border-black bg-[#27c93f]"></div>
                    </div>
                    <div className="font-mono text-sm font-black text-black bg-white px-3 py-1 border-2 border-black">
                        dumpster_fire.{language === 'python' ? 'py' : language === 'javascript' ? 'js' : language === 'typescript' ? 'ts' : 'txt'}
                    </div>
                    {/* Line Count Badge */}
                    <div className="font-mono text-xs font-black text-black bg-white px-2 py-1 border-2 border-black shadow-[2px_2px_0px_#000]">
                        {lineCount} lines
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* File Upload Button */}
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-1 bg-white border-2 border-black px-3 py-1 font-black text-xs uppercase text-black shadow-[2px_2px_0px_#000] hover:bg-[var(--accent-amber)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                    >
                        <Upload className="w-3 h-3" /> Upload
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".py,.js,.ts,.tsx,.jsx,.java,.go,.rs,.cpp,.cc,.c,.cs,.php,.rb,.kt,.swift,.txt"
                        onChange={handleFileSelect}
                        className="hidden"
                    />

                    <LanguageSelector selected={language} onChange={setLanguage} />
                    {isAnalyzing && (
                        <div className="flex items-center gap-2 text-black bg-[var(--accent-amber)] border-2 border-black px-2 py-1 font-black text-xs uppercase animate-pulse">
                            <span className="animate-spin text-lg">⚙️</span>
                            <span>Parsing Garbage</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Monaco Instance */}
            <div className="flex-1 min-h-[400px] relative bg-[#1e1e1e]">
                <Editor
                    height="100%"
                    language={language}
                    theme="vs-dark"
                    value={code}
                    onChange={(value) => setCode(value || '')}
                    options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        fontFamily: 'JetBrains Mono, ui-monospace, Menlo, Monaco, Consolas, monospace',
                        lineHeight: 24,
                        padding: { top: 24, bottom: 24 },
                        scrollBeyondLastLine: false,
                        smoothScrolling: true,
                        cursorBlinking: 'smooth',
                        cursorSmoothCaretAnimation: 'on',
                        formatOnPaste: true,
                        scrollbar: {
                            verticalScrollbarSize: 8,
                            horizontalScrollbarSize: 8,
                        }
                    }}
                    loading={
                        <div className="flex items-center justify-center h-full text-zinc-500 font-mono text-xl font-bold">
                            [LOADING_MONACO...]
                        </div>
                    }
                />
            </div>
        </div>
    );
}
