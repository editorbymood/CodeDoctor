import React, { useMemo } from 'react';
import * as Diff from 'diff';

export default function RefactoredCode({ originalCode, refactoredCode }) {
    const diffs = useMemo(() => {
        if (!originalCode || !refactoredCode) return [];
        return Diff.diffLines(originalCode, refactoredCode);
    }, [originalCode, refactoredCode]);

    if (!originalCode || !refactoredCode) {
        return (
            <div className="glass-panel w-full h-full min-h-[400px] flex items-center justify-center border border-white/5">
                <div className="text-zinc-500 font-mono text-sm uppercase tracking-widest border border-dashed border-white/10 p-6 rounded-xl bg-black/20">
                    Awaiting Refactor Instructions
                </div>
            </div>
        );
    }

    return (
        <div className="glass-panel w-full flex flex-col h-full p-0 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[80px] rounded-full pointer-events-none z-0" />

            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5 relative z-10 backdrop-blur-md">
                <h3 className="font-semibold text-white tracking-widest text-sm uppercase">Refactored Output</h3>
                <div className="flex items-center gap-4 text-xs font-mono">
                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500/80 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div> Removed</div>
                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-orange-500/80 shadow-[0_0_8px_rgba(249,115,22,0.5)]"></div> Added</div>
                </div>
            </div>

            <div className="flex-1 overflow-auto bg-[#030303] shadow-[inset_0_4px_20px_rgba(0,0,0,0.8)] p-6 font-mono text-[13px] leading-relaxed relative z-10">
                {diffs.map((part, index) => {
                    const color = part.added ? 'bg-orange-500/10 text-orange-300 border-l-2 border-orange-500 shadow-[inset_0_1px_0_rgba(249,115,22,0.05)]'
                        : part.removed ? 'bg-red-500/10 text-red-400 line-through opacity-70 border-l-2 border-red-500'
                            : 'text-zinc-400 border-l-2 border-transparent';

                    return (
                        <span key={index} className={`block px-3 py-[1px] ${color}`}>
                            {part.value}
                        </span>
                    );
                })}
            </div>
        </div>
    );
}
