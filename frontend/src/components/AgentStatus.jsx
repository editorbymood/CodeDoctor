import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ShieldAlert, Cpu, Search, Wrench, Clock } from 'lucide-react';

const AGENT_CONFIGS = {
    auditor: { label: 'Code Auditor', icon: Search, color: 'text-cyan-400', border: 'border-cyan-400/40', shadow: 'shadow-[0_0_20px_rgba(6,182,212,0.15)]' },
    style: { label: 'Style Critic', icon: CheckCircle2, color: 'text-amber-400', border: 'border-amber-400/40', shadow: 'shadow-[0_0_20px_rgba(245,158,11,0.15)]' },
    security: { label: 'Security Scanner', icon: ShieldAlert, color: 'text-red-400', border: 'border-red-400/40', shadow: 'shadow-[0_0_20px_rgba(248,113,113,0.15)]' },
    performance: { label: 'Perf Analyst', icon: Cpu, color: 'text-orange-500', border: 'border-orange-500/40', shadow: 'shadow-[0_0_20px_rgba(249,115,22,0.15)]' },
    refactor: { label: 'Refactor Engine', icon: Wrench, color: 'text-fuchsia-400', border: 'border-fuchsia-400/40', shadow: 'shadow-[0_0_20px_rgba(232,121,249,0.15)]' },
};

export default function AgentStatus({ statuses }) {
    // statuses is an object like: { auditor: 'running', style: 'completed', security: 'pending', ... }

    return (
        <div className="glass-panel w-full relative overflow-hidden">
            {/* Ambient Background Gradient */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-orange-500/5 blur-[80px] rounded-full pointer-events-none" />

            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10 relative z-10">
                <h3 className="font-semibold text-white tracking-widest text-sm uppercase">Agent Orchestrator</h3>
                <div className="flex items-center gap-2 font-mono text-xs text-orange-500/80 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
                    <Clock className="w-3 h-3 animate-pulse" />
                    <span>ASYNC_GATHER</span>
                </div>
            </div>

            <div className="grid grid-cols-5 gap-4 relative z-10">
                {Object.entries(AGENT_CONFIGS).map(([key, config]) => {
                    const status = statuses[key] || 'pending';
                    const Icon = config.icon;

                    const isRunning = status === 'running';
                    const isCompleted = status === 'completed';

                    return (
                        <div
                            key={key}
                            className={`relative flex flex-col items-center p-4 rounded-xl border backdrop-blur-md transition-all duration-500 transform ${isRunning
                                    ? `bg-white/5 ${config.border} ${config.shadow} scale-[1.02]`
                                    : isCompleted
                                        ? 'bg-black/60 border-orange-500/30 opacity-90'
                                        : 'bg-black/40 border-white/5 opacity-50'
                                }`}
                        >
                            {isRunning && (
                                <motion.div
                                    className="absolute inset-0 rounded-xl"
                                    animate={{ boxShadow: ['inset 0 0 0px 0px rgba(255,255,255,0)', `inset 0 0 15px 1px rgba(255,255,255,0.1)`, 'inset 0 0 0px 0px rgba(255,255,255,0)'] }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                                />
                            )}

                            <div className={`mb-3 p-3 rounded-full bg-black/60 border border-white/10 ${isRunning ? config.color : isCompleted ? 'text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.6)]' : 'text-zinc-600'}`}>
                                <Icon className="w-5 h-5" />
                            </div>

                            <span className="text-xs font-bold tracking-wide text-center text-zinc-200 mb-1">{config.label}</span>

                            <span className={`font-mono text-[10px] font-bold uppercase tracking-widest ${isRunning ? config.color : isCompleted ? 'text-orange-500/80' : 'text-zinc-600'
                                }`}>
                                [{status}]
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
