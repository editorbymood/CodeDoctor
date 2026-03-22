import React, { useMemo, useState } from 'react';
import * as Diff from 'diff';
import { Copy, Check, Eye, GitCompare } from 'lucide-react';

export default function RefactoredCode({ originalCode, refactoredCode }) {
    const [copied, setCopied] = useState(false);
    const [viewMode, setViewMode] = useState('diff'); // 'diff' | 'plain'

    const diffs = useMemo(() => {
        if (!originalCode || !refactoredCode) return [];
        return Diff.diffLines(originalCode, refactoredCode);
    }, [originalCode, refactoredCode]);

    const handleCopy = async () => {
        if (!refactoredCode) return;
        try {
            await navigator.clipboard.writeText(refactoredCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = refactoredCode;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (!originalCode || !refactoredCode) {
        return (
            <div className="bg-white border-4 border-black shadow-[6px_6px_0px_#000] w-full h-full min-h-[400px] flex items-center justify-center">
                <div className="text-black font-black text-xl uppercase tracking-widest border-4 border-dashed border-black p-8 bg-[var(--accent-pink)] rotate-2 shadow-[6px_6px_0px_#000]">
                    Waiting to fix your mess...
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white border-4 border-black shadow-[6px_6px_0px_#000] w-full flex flex-col h-full p-0 overflow-hidden relative">
            <div className="flex items-center justify-between px-6 py-4 border-b-4 border-black bg-[var(--accent-cyan)] relative z-10">
                <h3 className="font-black text-black tracking-widest text-lg uppercase bg-white px-3 py-1 border-2 border-black shadow-[2px_2px_0px_#000] transform -rotate-1">Fixed Code</h3>
                <div className="flex items-center gap-3">
                    {/* Toggle View */}
                    <div className="flex border-2 border-black bg-white">
                        <button
                            onClick={() => setViewMode('diff')}
                            className={`flex items-center gap-1 px-3 py-1 text-xs font-black uppercase transition-colors border-r-2 border-black ${viewMode === 'diff' ? 'bg-black text-white' : 'bg-white text-black hover:bg-zinc-100'}`}
                        >
                            <GitCompare className="w-3 h-3" /> Diff
                        </button>
                        <button
                            onClick={() => setViewMode('plain')}
                            className={`flex items-center gap-1 px-3 py-1 text-xs font-black uppercase transition-colors ${viewMode === 'plain' ? 'bg-black text-white' : 'bg-white text-black hover:bg-zinc-100'}`}
                        >
                            <Eye className="w-3 h-3" /> Clean
                        </button>
                    </div>

                    {/* Copy Button */}
                    <button
                        onClick={handleCopy}
                        className={`flex items-center gap-1 px-3 py-1 border-2 border-black text-xs font-black uppercase shadow-[2px_2px_0px_#000] transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none ${copied ? 'bg-[#27c93f] text-black' : 'bg-white text-black hover:bg-[var(--accent-amber)]'}`}
                    >
                        {copied ? <><Check className="w-3 h-3" /> Copied!</> : <><Copy className="w-3 h-3" /> Copy</>}
                    </button>

                    {/* Legend */}
                    {viewMode === 'diff' && (
                        <div className="flex items-center gap-3 text-xs font-black uppercase text-black">
                            <div className="flex items-center gap-1 bg-white px-2 py-1 border-2 border-black shadow-[2px_2px_0px_#000]">
                                <div className="w-3 h-3 border-2 border-black bg-[#ff5f56]"></div> Del
                            </div>
                            <div className="flex items-center gap-1 bg-white px-2 py-1 border-2 border-black shadow-[2px_2px_0px_#000]">
                                <div className="w-3 h-3 border-2 border-black bg-[#27c93f]"></div> Add
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-auto bg-white p-6 font-mono text-[14px] leading-relaxed relative z-10 font-bold border-t-4 border-black -mt-1 shadow-inner">
                {viewMode === 'diff' ? (
                    diffs.map((part, index) => {
                        const color = part.added ? 'bg-[#dcfce7] text-black border-l-4 border-[#27c93f]'
                            : part.removed ? 'bg-[#fee2e2] text-black line-through opacity-80 border-l-4 border-[#ff5f56]'
                                : 'text-zinc-600 border-l-4 border-transparent';
                        return (
                            <span key={index} className={`block px-3 py-1 font-mono hover:bg-zinc-100 ${color}`}>
                                {part.value}
                            </span>
                        );
                    })
                ) : (
                    <pre className="text-black whitespace-pre-wrap font-mono text-[14px] leading-relaxed">
                        {refactoredCode}
                    </pre>
                )}
            </div>
        </div>
    );
}
