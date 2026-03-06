import React, { useState } from 'react';
import { AlertTriangle, AlertCircle, Info, Bug, Shield, SearchCode, Zap } from 'lucide-react';

export default function IssuesList({ issues }) {
    const [filter, setFilter] = useState('all');

    const filteredIssues = filter === 'all' ? issues : issues.filter(i => i.severity === filter);

    const getSeverityStyles = (severity) => {
        switch (severity) {
            case 'critical': return 'border-red-500/30 bg-red-500/10 text-red-400';
            case 'warning': return 'border-amber-500/30 bg-amber-500/10 text-amber-400';
            case 'info': return 'border-orange-600/30 bg-orange-600/10 text-orange-500';
            default: return 'border-zinc-500/30 bg-zinc-500/10 text-zinc-400';
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
        <div className="glass-panel w-full border border-white/5 p-6 flex flex-col h-full">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                <h3 className="font-semibold text-white tracking-tight uppercase text-sm">Detected Anomalies</h3>

                {/* Filters */}
                <div className="flex gap-2 font-mono text-xs">
                    {['all', 'critical', 'warning', 'info'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3 py-1.5 rounded-md border transition-colors uppercase ${filter === f
                                    ? 'bg-white/10 border-white/20 text-white'
                                    : 'bg-black/20 border-white/5 text-zinc-500 hover:text-zinc-300'
                                }`}
                        >
                            {f} {f !== 'all' && `(${issues.filter(i => i.severity === f).length})`}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                {filteredIssues.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 text-zinc-500 space-y-3 border border-dashed border-white/10 rounded-xl bg-black/20">
                        <CheckCircle2 className="w-8 h-8 text-amber-500/50" />
                        <span className="font-mono text-sm uppercase tracking-widest">Zero Issues Detected</span>
                    </div>
                ) : (
                    filteredIssues.map((issue, idx) => (
                        <div key={idx} className={`p-4 rounded-xl border ${getSeverityStyles(issue.severity)} flex flex-col gap-3 transition-colors hover:bg-black/40`}>

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

                            <div className="bg-black/30 border border-current/10 rounded-lg p-3 text-sm opacity-90">
                                <strong className="font-mono text-xs uppercase tracking-wider block mb-1">Fix Suggestion:</strong>
                                <span className="text-zinc-300">{issue.suggestion}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
// Include CheckCircle2 missing import
import { CheckCircle2 } from 'lucide-react';
