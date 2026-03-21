import React from 'react';
import Editor from '@monaco-editor/react';
import LanguageSelector from './LanguageSelector';

export default function CodeEditor({ code, setCode, language, setLanguage, isAnalyzing }) {
    return (
        <div className="flex flex-col h-full rounded-xl overflow-hidden glass-panel p-0 border border-white/5">
            {/* Editor Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/5">
                <div className="flex items-center gap-4">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                    </div>
                    <div className="font-mono text-xs text-zinc-400 bg-black/30 px-3 py-1 rounded-md border border-white/5">
                        target_source.{language === 'python' ? 'py' : language === 'javascript' ? 'js' : language === 'typescript' ? 'ts' : 'txt'}
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <LanguageSelector selected={language} onChange={setLanguage} />
                    {isAnalyzing && (
                        <div className="flex items-center gap-2 text-orange-500 font-mono text-xs animate-pulse">
                            <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_#f97316]"></div>
                            <span>STREAMING_AST</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Monaco Instance */}
            <div className="flex-1 min-h-[400px] relative bg-[#0d0d0d]">
                <Editor
                    height="100%"
                    language={language}
                    theme="vs-dark"
                    value={code}
                    onChange={(value) => setCode(value || '')}
                    options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        fontFamily: 'SF Mono, ui-monospace, Menlo, Monaco, Consolas, monospace',
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
                        <div className="flex items-center justify-center h-full text-zinc-500 font-mono text-sm">
                            [INITIALIZING_MONACO_CORE]
                        </div>
                    }
                />
                {/* Subtle inner shadow for depth */}
                <div className="absolute inset-0 pointer-events-none shadow-[inset_0_20px_40px_-20px_rgba(0,0,0,0.8)]"></div>
            </div>
        </div>
    );
}
