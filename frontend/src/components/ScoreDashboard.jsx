import React from 'react';

export default function ScoreDashboard({ score, breakdown }) {
    // Map score to color
    const getBgColor = (val) => {
        if (val >= 90) return 'bg-[#27c93f]';
        if (val >= 70) return 'bg-[#ffbd2e]';
        return 'bg-[#ff5f56]';
    };

    return (
        <div className="bg-white border-4 border-black shadow-[6px_6px_0px_#000] p-6 relative overflow-hidden w-full flex flex-col md:flex-row gap-8 items-center hover:-translate-y-1 hover:shadow-[8px_8px_0px_#000] transition-all duration-200">
            {/* Ambient Background Glow - Removed */}

            {/* Solid Score Badge */}
            <div className={`relative flex items-center justify-center w-36 h-36 shrink-0 border-8 border-black rounded-full shadow-[6px_6px_0px_#000] transform -rotate-3 ${getBgColor(score)}`}>
                <div className="flex flex-col items-center justify-center bg-white w-24 h-24 rounded-full border-4 border-black">
                    <span className="font-mono text-4xl font-black text-black tracking-tighter" style={{textShadow: "2px 2px 0px #ccc"}}>{score}</span>
                    <span className="text-[10px] text-black font-black tracking-widest uppercase mt-1">SCORE</span>
                </div>
            </div>

            {/* Breakdown Metrics */}
            <div className="flex-1 w-full grid grid-cols-2 lg:grid-cols-4 gap-4 z-10 mt-4 md:mt-0">
                {[
                    { label: 'Bugs', value: breakdown?.bugs || 0, weight: '40%', bg: 'bg-[var(--accent-pink)]' },
                    { label: 'Security', value: breakdown?.security || 0, weight: '30%', bg: 'bg-[#ff5f56]' },
                    { label: 'Style', value: breakdown?.style || 0, weight: '15%', bg: 'bg-[var(--accent-cyan)]' },
                    { label: 'Perf', value: breakdown?.performance || 0, weight: '15%', bg: 'bg-[var(--accent-amber)]' },
                ].map((stat, i) => (
                    <div key={i} className={`p-4 border-4 border-black flex flex-col justify-between transition-all duration-200 hover:scale-105 hover:-translate-y-1 shadow-[4px_4px_0px_#000] ${stat.bg}`}>
                        <div className="flex items-center justify-between mb-3 border-b-4 border-black pb-2 bg-white px-2 border-2 -mx-2 -mt-2">
                            <span className="text-xs font-black uppercase tracking-wider text-black">{stat.label}</span>
                            <span className="text-[10px] font-black font-mono text-black">{stat.weight}</span>
                        </div>
                        <div className="flex items-end gap-2 text-black bg-white border-2 border-black px-2 py-1 transform rotate-1 inline-block w-max self-center mt-2 shadow-[2px_2px_0px_#000]">
                            <span className="font-mono text-3xl font-black leading-none">{stat.value}</span>
                            <span className="text-[10px] uppercase font-black tracking-widest text-black/70 mb-1">Issues</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
