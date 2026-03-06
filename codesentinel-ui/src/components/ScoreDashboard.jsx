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
        <div className="glass-panel w-full flex flex-col md:flex-row gap-8 items-center border border-white/5">

            {/* Radial Score */}
            <div className="relative flex items-center justify-center w-32 h-32 shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                        className="stroke-white/10"
                        cx="50" cy="50" r="45"
                        fill="transparent" strokeWidth="8"
                    />
                    <circle
                        className="transition-all duration-1000 ease-out"
                        cx="50" cy="50" r="45"
                        fill="transparent"
                        strokeWidth="8"
                        stroke={getStroke(score)}
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-mono text-3xl font-bold text-white tracking-tighter">{score}</span>
                    <span className="text-[10px] text-zinc-500 font-semibold tracking-widest uppercase mt-1">QUALITY</span>
                </div>
            </div>

            {/* Breakdown Metrics */}
            <div className="flex-1 w-full grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Bugs', value: breakdown?.bugs || 0, weight: '40%' },
                    { label: 'Security', value: breakdown?.security || 0, weight: '30%' },
                    { label: 'Style', value: breakdown?.style || 0, weight: '15%' },
                    { label: 'Performance', value: breakdown?.performance || 0, weight: '15%' },
                ].map((stat, i) => (
                    <div key={i} className={`p-4 rounded-xl border flex flex-col justify-between ${getColor(100 - stat.value * 10)}`}>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold uppercase opacity-70">{stat.label}</span>
                            <span className="text-[10px] opacity-40 font-mono tracking-wider">[{stat.weight}]</span>
                        </div>
                        <div className="flex items-end gap-2">
                            <span className="font-mono text-3xl font-bold leading-none">{stat.value}</span>
                            <span className="text-xs uppercase opacity-60 mb-1">Issues</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
