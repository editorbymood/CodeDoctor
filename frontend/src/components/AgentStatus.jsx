import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, ShieldAlert, Cpu, Search, Wrench, Clock, XCircle } from 'lucide-react';

const AGENT_CONFIGS = {
    auditor: { label: 'Nitpicker', icon: Search, bg: 'bg-[var(--accent-cyan)]' },
    style: { label: 'Style Snob', icon: CheckCircle2, bg: 'bg-[var(--accent-amber)]' },
    security: { label: 'Paranoid Scan', icon: ShieldAlert, bg: 'bg-[#ff5f56]' },
    performance: { label: 'Speed Freak', icon: Cpu, bg: 'bg-[#ffbd2e]' },
    refactor: { label: 'The Cleaner', icon: Wrench, bg: 'bg-[var(--accent-pink)]' },
};

function useElapsedTimer(isRunning) {
    const [elapsed, setElapsed] = useState(0);
    const intervalRef = useRef(null);

    useEffect(() => {
        if (isRunning) {
            setElapsed(0);
            intervalRef.current = setInterval(() => {
                setElapsed(prev => prev + 0.1);
            }, 100);
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
        }
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [isRunning]);

    return elapsed;
}

function AgentCard({ agentKey, config, status }) {
    const Icon = config.icon;
    const isRunning = status === 'running';
    const isCompleted = status === 'completed';
    const isError = status === 'error';
    const elapsed = useElapsedTimer(isRunning);

    return (
        <div
            className={`relative flex flex-col items-center p-3 rounded-none border-4 border-black transition-all duration-200 transform ${
                isRunning
                    ? `${config.bg} shadow-[4px_4px_0px_#000] scale-105 z-10`
                    : isCompleted
                        ? 'bg-zinc-200 shadow-[2px_2px_0px_#000] opacity-80'
                        : isError
                            ? 'bg-[#ff5f56] shadow-[2px_2px_0px_#000] opacity-90'
                            : 'bg-white shadow-[2px_2px_0px_#000] opacity-50'
            }`}
        >
            <div className={`mb-2 p-3 bg-white border-2 border-black rounded-full shadow-[2px_2px_0px_#000] ${isRunning ? 'text-black animate-bounce' : isError ? 'text-[#ff5f56]' : 'text-zinc-500'}`}>
                {isError ? <XCircle className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
            </div>

            <span className="text-xs font-black tracking-wide text-center text-black mb-1 uppercase leading-tight">{config.label}</span>

            <span className="font-mono text-[10px] font-black uppercase tracking-widest text-black bg-white px-1 border border-black mt-1">
                {isRunning ? 'WORKING' : isCompleted ? 'DONE' : isError ? 'FAILED' : 'WAITING'}
            </span>

            {/* Timer */}
            {(isRunning || isCompleted) && (
                <span className="font-mono text-[9px] font-bold text-black/60 mt-1">
                    {elapsed.toFixed(1)}s
                </span>
            )}
        </div>
    );
}

export default function AgentStatus({ statuses }) {
    return (
        <div className="bg-white border-4 border-black shadow-[6px_6px_0px_#000] w-full relative overflow-hidden p-6 hover:-translate-y-1 hover:shadow-[8px_8px_0px_#000] transition-all duration-200">
            <div className="flex items-center justify-between mb-6 pb-4 border-b-4 border-black relative z-10">
                <h3 className="font-black text-black tracking-widest text-lg uppercase bg-[var(--accent-amber)] px-3 py-1 border-2 border-black inline-block shadow-[2px_2px_0px_#000] -rotate-1">Bot Overlords</h3>
                <div className="flex items-center gap-2 font-mono text-xs text-black font-black uppercase bg-[var(--accent-pink)] px-3 py-1 border-2 border-black shadow-[2px_2px_0px_#000]">
                    <Clock className="w-4 h-4 animate-spin" />
                    <span>JUDGING YOU</span>
                </div>
            </div>

            <div className="grid grid-cols-5 gap-4 relative z-10">
                {Object.entries(AGENT_CONFIGS).map(([key, config]) => (
                    <AgentCard key={key} agentKey={key} config={config} status={statuses[key] || 'pending'} />
                ))}
            </div>
        </div>
    );
}
