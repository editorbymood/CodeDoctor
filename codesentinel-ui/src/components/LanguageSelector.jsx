import React from 'react';
import { ChevronDown } from 'lucide-react';

const languages = [
    { id: 'python', name: 'Python' },
    { id: 'javascript', name: 'JavaScript' },
    { id: 'typescript', name: 'TypeScript' },
    { id: 'java', name: 'Java' },
    { id: 'go', name: 'Go' },
    { id: 'rust', name: 'Rust' },
    { id: 'cpp', name: 'C++' },
];

export default function LanguageSelector({ selected, onChange }) {
    return (
        <div className="relative group">
            <select
                value={selected}
                onChange={(e) => onChange(e.target.value)}
                className="appearance-none bg-black/40 border border-white/10 text-zinc-300 font-mono text-xs py-1.5 pl-3 pr-8 rounded-md cursor-pointer hover:border-sky-400 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-colors"
            >
                {languages.map((lang) => (
                    <option key={lang.id} value={lang.id}>
                        {lang.name}
                    </option>
                ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-500 pointer-events-none group-hover:text-sky-400 transition-colors" />
        </div>
    );
}
