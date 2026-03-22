import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
    {
        q: "Are you going to steal my garbage code?",
        a: "No. We request read-only access via OAuth. We don't want to store your spaghetti code, much less train AI on it. It would only make the AI dumber."
    },
    {
        q: "Do you support my obscure language?",
        a: "We parse 50+ languages including TS, Py, Rust, Go, C++ and Java. Yes, even PHP. Unfortunately."
    },
    {
        q: "Isn't this just GitHub Copilot?",
        a: "Copilot writes bugs faster. We actually fix them while passively-aggressively insulting your architecture."
    },
    {
        q: "Can I run this on my own potato server?",
        a: "Yeah, if you pay for the 'Whale' tier. We'll give you a Docker container and wish you the best of luck figuring it out."
    }
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section id="faq" className="w-full py-32 border-t-4 border-black relative bg-[#fffceb]">
            <div className="w-full max-w-[800px] mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tight text-black mb-4" style={{textShadow: "4px 4px 0px var(--accent-cyan)"}}>Stupid Questions</h2>
                    <p className="text-xl font-bold text-black border-4 border-black bg-white inline-block p-4 shadow-[6px_6px_0px_#000] rotate-1">Read this before bothering our nonexistent support team.</p>
                </div>

                <div className="space-y-6">
                    {faqs.map((faq, i) => (
                        <div key={i} className="border-4 border-black bg-white shadow-[6px_6px_0px_#000] overflow-hidden transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0px_#000] relative z-10">
                            <button 
                                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                className="w-full text-left px-6 py-6 flex justify-between items-center focus:outline-none bg-white hover:bg-[var(--accent-amber)] transition-colors"
                            >
                                <span className="text-black font-black text-xl uppercase pr-8">{faq.q}</span>
                                <svg 
                                    className={`w-8 h-8 text-black border-2 border-black rounded-full p-1 transform transition-transform duration-200 flex-shrink-0 ${openIndex === i ? 'rotate-180 bg-[var(--accent-pink)]' : ''}`} 
                                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            
                            <AnimatePresence>
                                {openIndex === i && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <div className="px-6 pb-6 text-black font-bold text-base leading-relaxed pt-4 border-t-4 border-dashed border-black bg-white">
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
