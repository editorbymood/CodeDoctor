import React from 'react';

export default function ScoreDashboard({ score, breakdown }) {
    // Map score to color
    const getColor = (val) => {
        if (val >= 90) return 'text-amber-400 border-amber-400/30 bg-amber-400/10';
        if (val >= 70) return 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10';
        return 'text-red-400 border-red-400/30 bg-red-400/10';
    };

    const getStroke = (val) => {
        if (val >= 90) return '#fbbf24';
        if (val >= 70) return '#facc15';
        return '#f87171';
    };

    const circumference = 2 * Math.PI * 45;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
        <div className="glass-panel relative overflow-hidden w-full flex flex-col md:flex-row gap-8 items-center">
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-32 h-32 bg-orange-500/10 blur-[50px] rounded-full pointer-events-none" />

            {/* Radial Score */}
            <div className="relative flex items-center justify-center w-36 h-36 shrink-0 mix-blend-screen">
                <svg className="w-full h-full -rotate-90 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]" viewBox="0 0 100 100">
                    <circle
                        className="stroke-white/5"
                        cx="50" cy="50" r="45"
                        fill="transparent" strokeWidth="6"
                    />
                    <circle
                        className="transition-all duration-1000 ease-out"
                        cx="50" cy="50" r="45"
                        fill="transparent"
                        strokeWidth="6"
                        stroke={getStroke(score)}
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-mono text-4xl font-black text-white tracking-tighter drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{score}</span>
                    <span className="text-[9px] text-zinc-400 font-bold tracking-[0.2em] uppercase mt-1">QUALITY</span>
                </div>
            </div>

            {/* Breakdown Metrics */}
            <div className="flex-1 w-full grid grid-cols-2 lg:grid-cols-4 gap-4 z-10">
                {[
                    { label: 'Bugs', value: breakdown?.bugs || 0, weight: '40%' },
                    { label: 'Security', value: breakdown?.security || 0, weight: '30%' },
                    { label: 'Style', value: breakdown?.style || 0, weight: '15%' },
                    { label: 'Performance', value: breakdown?.performance || 0, weight: '15%' },
                ].map((stat, i) => (
                    <div key={i} className={`p-4 rounded-xl border backdrop-blur-md flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-lg ${getColor(100 - stat.value * 10)}`}>
                        <div className="flex items-center justify-between mb-3 border-b border-current pb-2 border-opacity-20">
                            <span className="text-[11px] font-bold uppercase tracking-wider">{stat.label}</span>
                            <span className="text-[10px] opacity-60 font-mono">[{stat.weight}]</span>
                        </div>
                        <div className="flex items-end gap-2 text-white drop-shadow-md">
                            <span className="font-mono text-3xl font-black leading-none">{stat.value}</span>
                            <span className="text-[10px] uppercase font-bold opacity-60 mb-1 tracking-widest text-current">Issues</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
