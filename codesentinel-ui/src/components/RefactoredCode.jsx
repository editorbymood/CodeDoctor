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
        <div className="glass-panel w-full flex flex-col h-full border border-white/5 p-0 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/5">
                <h3 className="font-semibold text-white tracking-tight text-sm uppercase">Refactored Output</h3>
                <div className="flex items-center gap-4 text-xs font-mono">
                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500/50"></div> Removed</div>
                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-500/50"></div> Added</div>
                </div>
            </div>

            <div className="flex-1 overflow-auto bg-[#0d0d0d] p-4 font-mono text-sm leading-relaxed">
                {diffs.map((part, index) => {
                    const color = part.added ? 'bg-amber-500/10 text-amber-300'
                        : part.removed ? 'bg-red-500/10 text-red-300 line-through opacity-70'
                            : 'text-zinc-300';

                    return (
                        <span key={index} className={`block px-2 rounded-sm ${color}`}>
                            {part.value}
                        </span>
                    );
                })}
            </div>
        </div>
    );
}
