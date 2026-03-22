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
    { id: 'csharp', name: 'C#' },
    { id: 'php', name: 'PHP' },
    { id: 'ruby', name: 'Ruby' },
    { id: 'kotlin', name: 'Kotlin' },
    { id: 'swift', name: 'Swift' },
];

export default function LanguageSelector({ selected, onChange }) {
    return (
        <div className="relative group">
            <select
                value={selected}
                onChange={(e) => onChange(e.target.value)}
                className="appearance-none bg-white border-2 border-black text-black font-mono text-xs font-bold uppercase py-1.5 pl-3 pr-8 cursor-pointer hover:bg-[var(--accent-amber)] focus:outline-none focus:ring-2 focus:ring-black shadow-[2px_2px_0px_#000] transition-colors"
            >
                {languages.map((lang) => (
                    <option key={lang.id} value={lang.id}>
                        {lang.name}
                    </option>
                ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-black pointer-events-none" />
        </div>
    );
}
