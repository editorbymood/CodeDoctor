import React, { useState, useMemo } from 'react';
import { Bug, Shield, SearchCode, Zap, CheckCircle2, ArrowUpDown } from 'lucide-react';

export default function IssuesList({ issues }) {
    const [filter, setFilter] = useState('all');
    const [sortBy, setSortBy] = useState('severity'); // 'severity' | 'line'

    const filteredIssues = filter === 'all' ? issues : issues.filter(i => i.severity === filter);

    const sortedIssues = useMemo(() => {
        const sorted = [...filteredIssues];
        if (sortBy === 'severity') {
            const order = { critical: 0, warning: 1, info: 2 };
            sorted.sort((a, b) => (order[a.severity] ?? 3) - (order[b.severity] ?? 3));
        } else if (sortBy === 'line') {
            sorted.sort((a, b) => (a.line || 999) - (b.line || 999));
        }
        return sorted;
    }, [filteredIssues, sortBy]);

    const getSeverityStyles = (severity) => {
        switch (severity) {
            case 'critical': return 'bg-[#ff5f56]';
            case 'warning': return 'bg-[var(--accent-amber)]';
            case 'info': return 'bg-[var(--accent-cyan)]';
            default: return 'bg-white';
        }
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'bug': return <Bug className="w-6 h-6 text-black" />;
            case 'security': return <Shield className="w-6 h-6 text-black" />;
            case 'performance': return <Zap className="w-6 h-6 text-black" />;
            default: return <SearchCode className="w-6 h-6 text-black" />;
        }
    };

    return (
        <div className="bg-white border-4 border-black shadow-[6px_6px_0px_#000] w-full p-6 flex flex-col h-full relative overflow-hidden">
            <div className="flex items-center justify-between mb-6 pb-4 border-b-4 border-black relative z-10 flex-wrap gap-3">
                <div className="flex items-center gap-3">
                    <h3 className="font-black text-black tracking-widest text-lg uppercase bg-[var(--accent-pink)] px-3 py-1 border-2 border-black inline-block shadow-[2px_2px_0px_#000] rotate-1">Why Your Code Sucks</h3>
                    {/* Issue Count Badge */}
                    <div className="font-mono text-sm font-black text-black bg-white px-3 py-1 border-2 border-black shadow-[2px_2px_0px_#000] -rotate-2">
                        {issues.length} {issues.length === 1 ? 'issue' : 'issues'}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* Sort Toggle */}
                    <button
                        onClick={() => setSortBy(s => s === 'severity' ? 'line' : 'severity')}
                        className="flex items-center gap-1 px-3 py-1.5 border-2 border-black font-black text-xs uppercase bg-white text-black shadow-[2px_2px_0px_#000] hover:bg-zinc-100 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                    >
                        <ArrowUpDown className="w-3 h-3" />
                        {sortBy === 'severity' ? 'By Severity' : 'By Line'}
                    </button>

                    {/* Filters */}
                    <div className="flex gap-1 font-mono text-xs">
                        {['all', 'critical', 'warning', 'info'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-2 py-1.5 border-2 border-black transition-all uppercase font-black focus:outline-none ${filter === f
                                        ? 'bg-black text-white shadow-[2px_2px_0px_var(--accent-amber)] -translate-y-1'
                                        : 'bg-white text-black hover:bg-zinc-200 shadow-[2px_2px_0px_#000]'
                                    }`}
                            >
                                {f === 'all' ? 'All' : f.charAt(0).toUpperCase()}
                                {f !== 'all' && ` ${issues.filter(i => i.severity === f).length}`}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-4 space-y-4 relative z-10 scrollbar-hide">
                {sortedIssues.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 text-black space-y-3 border-4 border-dashed border-black bg-[var(--accent-amber)] p-6 shadow-[4px_4px_0px_#000] rotate-1">
                        <CheckCircle2 className="w-12 h-12 text-black" />
                        <span className="font-black text-lg uppercase tracking-widest text-black">Zero Issues (Somehow)</span>
                    </div>
                ) : (
                    sortedIssues.map((issue, idx) => (
                        <div key={idx} className={`p-4 border-4 border-black shadow-[4px_4px_0px_#000] ${getSeverityStyles(issue.severity)} flex flex-col gap-3 transition-all duration-200 hover:-translate-y-1 hover:shadow-[6px_6px_0px_#000]`}>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 border-2 border-black bg-white shadow-[2px_2px_0px_#000]">
                                        {getCategoryIcon(issue.category)}
                                    </div>
                                    <span className="font-mono text-xs uppercase font-black tracking-widest text-black bg-white border-2 border-black px-2 py-1 shadow-[2px_2px_0px_#000]">
                                        [{issue.category}]
                                    </span>
                                </div>
                                {issue.line && (
                                    <span className="font-mono text-xs font-black border-2 border-black px-2 py-1 bg-white shadow-[2px_2px_0px_#000] transform rotate-2 text-black">
                                        Line {issue.line}
                                    </span>
                                )}
                            </div>

                            <div className="text-base font-black text-black mt-2 bg-white border-2 border-black p-3 shadow-[2px_2px_0px_#000]">{issue.message}</div>

                            <div className="bg-black border-2 border-black p-4 text-sm shadow-inner mt-2">
                                <strong className="font-mono text-[12px] text-[var(--accent-cyan)] uppercase font-black tracking-wider block mb-1">How to fix it:</strong>
                                <span className="text-white font-bold">{issue.suggestion}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
