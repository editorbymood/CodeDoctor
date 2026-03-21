import React, { useState } from 'react';
import { Bug, Shield, SearchCode, Zap, CheckCircle2 } from 'lucide-react';

export default function IssuesList({ issues }) {
    const [filter, setFilter] = useState('all');

    const filteredIssues = filter === 'all' ? issues : issues.filter(i => i.severity === filter);

    const getSeverityStyles = (severity) => {
        switch (severity) {
            case 'critical': return 'border-red-500/40 bg-red-500/10 text-red-400 shadow-[inset_0_1px_1px_rgba(239,68,68,0.2)]';
            case 'warning': return 'border-orange-500/40 bg-orange-500/10 text-orange-400 shadow-[inset_0_1px_1px_rgba(249,115,22,0.2)]';
            case 'info': return 'border-cyan-500/40 bg-cyan-500/10 text-cyan-400 shadow-[inset_0_1px_1px_rgba(6,182,212,0.2)]';
            default: return 'border-zinc-500/40 bg-zinc-500/10 text-zinc-400 shadow-[inset_0_1px_1px_rgba(161,161,170,0.2)]';
        }
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'bug': return <Bug className="w-4 h-4" />;
            case 'security': return <Shield className="w-4 h-4" />;
            case 'performance': return <Zap className="w-4 h-4" />;
            default: return <SearchCode className="w-4 h-4" />;
        }
    };

    return (
        <div className="glass-panel w-full p-6 flex flex-col h-full relative overflow-hidden">
            {/* Ambient background blur */}
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-red-500/5 blur-[80px] rounded-full pointer-events-none z-0" />
            
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10 relative z-10">
                <h3 className="font-semibold text-white tracking-tight uppercase text-sm">Detected Anomalies</h3>

                {/* Filters */}
                <div className="flex gap-2 font-mono text-xs">
                    {['all', 'critical', 'warning', 'info'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3 py-1.5 rounded-md border transition-all uppercase ${filter === f
                                    ? 'bg-white/10 border-white/20 text-white shadow-md'
                                    : 'bg-black/40 border-white/5 text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
                                }`}
                        >
                            {f} {f !== 'all' && `(${issues.filter(i => i.severity === f).length})`}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-4 relative z-10">
                {filteredIssues.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 text-zinc-500 space-y-3 border border-dashed border-white/10 rounded-xl bg-black/40 backdrop-blur-md">
                        <CheckCircle2 className="w-8 h-8 text-orange-500/50" />
                        <span className="font-mono text-sm uppercase tracking-widest text-zinc-400">Zero Issues Detected</span>
                    </div>
                ) : (
                    filteredIssues.map((issue, idx) => (
                        <div key={idx} className={`p-4 rounded-xl border backdrop-blur-md ${getSeverityStyles(issue.severity)} flex flex-col gap-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:brightness-110`}>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className={`p-1.5 rounded-lg border ${getSeverityStyles(issue.severity)}`}>
                                        {getCategoryIcon(issue.category)}
                                    </div>
                                    <span className="font-mono text-[10px] uppercase font-bold tracking-widest opacity-80 backdrop-blur-md">
                                        [{issue.category}]
                                    </span>
                                </div>
                                {issue.line && (
                                    <span className="font-mono text-xs opacity-70 border border-current/20 px-2 py-0.5 rounded bg-black/20">
                                        Line {issue.line}
                                    </span>
                                )}
                            </div>

                            <div className="text-sm font-semibold text-zinc-200 mt-1">{issue.message}</div>

                            <div className="bg-black/40 border border-current/10 rounded-lg p-3 text-sm opacity-90 shadow-inner">
                                <strong className="font-mono text-[11px] text-white uppercase tracking-wider block mb-1">Fix Suggestion:</strong>
                                <span className="text-zinc-300">{issue.suggestion}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
