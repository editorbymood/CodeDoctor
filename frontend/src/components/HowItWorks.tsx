import { motion } from 'framer-motion';

const steps = [
    {
        num: "01",
        title: "Hook Up Your Trash",
        desc: "Give us read-only access to your repos so our agents can immediately start judging you."
    },
    {
        num: "02",
        title: "The Roasting Phase",
        desc: "Our agents rip your AST apart and flag all the terrible decisions you've made since the initial commit."
    },
    {
        num: "03",
        title: "Accept the Fixes",
        desc: "Blindly merge our god-tier PRs because let's be honest, you're not going to read them anyway."
    }
];

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="w-full py-32 border-t-4 border-black relative bg-[#fffceb]">
            <div className="w-full max-w-[1200px] mx-auto px-6 xl:px-0 relative z-10">
                <div className="text-center mb-20">
                    <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tight text-white !text-black shadow-none mb-4" style={{textShadow: "4px 4px 0px var(--accent-pink)"}}>How to Fix Your Junk</h2>
                    <p className="text-xl font-bold text-black max-w-xl mx-auto border-4 border-black p-4 bg-white shadow-[6px_6px_0px_#000] transform -rotate-1">Three violently simple steps to making your code suck less.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                    {/* Connecting Line removed for Neo-brutalism style (blocks are better) */}

                    {steps.map((step, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ delay: i * 0.1, duration: 0.2 }}
                            className="bg-white border-4 border-black p-8 hover:-translate-y-2 hover:translate-x-[-2px] hover:shadow-[10px_10px_0px_#000] shadow-[6px_6px_0px_#000] transition-all duration-200 flex flex-col items-start relative text-left"
                        >
                            <div className="w-16 h-16 bg-[var(--accent-cyan)] border-4 border-black flex items-center justify-center text-xl font-bold text-black mb-6 relative z-10 shadow-[4px_4px_0px_#000] rotate-3">
                                {step.num}
                            </div>
                            <h3 className="text-2xl font-black uppercase text-black mb-2">{step.title}</h3>
                            <p className="text-black font-bold text-base leading-relaxed p-2 border-2 border-dashed border-black">{step.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
