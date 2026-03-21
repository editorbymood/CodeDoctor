import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
    {
        q: "Is my codebase securely analyzed?",
        a: "Yes. Code Doctor accesses your repositories with strict read-only permissions via temporary OAuth tokens. No proprietary code is ever persisted or used for training AI models."
    },
    {
        q: "Which programming languages do you support?",
        a: "Our universal AST parser natively supports 50+ languages including TypeScript, Python, Rust, Go, C++, and Java, continuously updating definitions."
    },
    {
        q: "How does Code Doctor differ from GitHub Copilot?",
        a: "While Copilot acts as an autocomplete assistant during development, Code Doctor is an autonomous CI/CD agent that asynchronously audits, critiques, and refactors entire codebases to eliminate technical debt globally."
    },
    {
        q: "Can I self-host the analysis engines?",
        a: "Yes, our Enterprise tier offers VPC peeling and fully air-gapped on-premise deployments to meet the strictest compliance regulations."
    }
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section id="faq" className="w-full py-32 border-t border-white/[0.03] relative bg-[#09090b]">
            <div className="w-full max-w-[800px] mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-[#fafafa] mb-4">Frequently Asked Questions</h2>
                    <p className="text-base text-zinc-400">Everything you need to know about integrating Code Doctor.</p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, i) => (
                        <div key={i} className="border border-white/[0.03] rounded-[24px] bg-[#0c0c0e] overflow-hidden transition-colors hover:border-white/[0.08] relative z-10">
                            <button 
                                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                className="w-full text-left px-6 py-5 flex justify-between items-center focus:outline-none"
                            >
                                <span className="text-zinc-200 font-medium text-base pr-8">{faq.q}</span>
                                <svg 
                                    className={`w-5 h-5 text-zinc-500 transform transition-transform duration-300 flex-shrink-0 ${openIndex === i ? 'rotate-180' : ''}`} 
                                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            
                            <AnimatePresence>
                                {openIndex === i && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="px-6 pb-6 text-zinc-400 text-sm leading-relaxed pt-2">
                                            {faq.a}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
