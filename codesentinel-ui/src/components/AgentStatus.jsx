import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ShieldAlert, Cpu, Search, Wrench, Clock } from 'lucide-react';

const AGENT_CONFIGS = {
    auditor: { label: 'Code Auditor', icon: Search, color: 'text-orange-500', border: 'border-orange-500/30' },
    style: { label: 'Style Critic', icon: CheckCircle2, color: 'text-fuchsia-400', border: 'border-fuchsia-400/30' },
    security: { label: 'Security Scanner', icon: ShieldAlert, color: 'text-red-400', border: 'border-red-400/30' },
    performance: { label: 'Perf Analyst', icon: Cpu, color: 'text-amber-400', border: 'border-amber-400/30' },
    refactor: { label: 'Refactor Engine', icon: Wrench, color: 'text-amber-400', border: 'border-amber-400/30' },
};

export default function AgentStatus({ statuses }) {
    // statuses is an object like: { auditor: 'running', style: 'completed', security: 'pending', ... }

    return (
        <div className="glass-panel w-full">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                <h3 className="font-semibold text-white tracking-tight text-sm uppercase">Agent Orchestrator</h3>
                <div className="flex items-center gap-2 font-mono text-xs text-zinc-500">
                    <Clock className="w-3 h-3" />
                    <span>ASYNC_GATHER</span>
                </div>
            </div>

            <div className="grid grid-cols-5 gap-4">
                {Object.entries(AGENT_CONFIGS).map(([key, config]) => {
                    const status = statuses[key] || 'pending';
                    const Icon = config.icon;

                    const isRunning = status === 'running';
                    const isCompleted = status === 'completed';

                    return (
                        <div
                            key={key}
                            className={`relative flex flex-col items-center p-4 rounded-xl border transition-all duration-500 ${isRunning
                                    ? `bg-white/5 ${config.border} shadow-[0_0_20px_-5px_rgba(255,255,255,0.1)]`
                                    : isCompleted
                                        ? 'bg-black/40 border-amber-500/20 opacity-80'
                                        : 'bg-black/20 border-white/5 opacity-40'
                                }`}
                        >
                            {isRunning && (
                                <motion.div
                                    className="absolute inset-0 rounded-xl"
                                    animate={{ boxShadow: ['inset 0 0 0px 0px rgba(255,255,255,0)', `inset 0 0 20px 2px rgba(255,255,255,0.05)`, 'inset 0 0 0px 0px rgba(255,255,255,0)'] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                            )}

                            <div className={`mb-3 p-3 rounded-full bg-black/50 border border-white/5 ${isRunning ? config.color : isCompleted ? 'text-amber-500' : 'text-zinc-600'}`}>
                                <Icon className="w-5 h-5" />
                            </div>

                            <span className="text-xs font-semibold text-center text-zinc-300 mb-1">{config.label}</span>

                            <span className={`font-mono text-[10px] uppercase tracking-wider ${isRunning ? config.color : isCompleted ? 'text-amber-500/70' : 'text-zinc-600'
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
