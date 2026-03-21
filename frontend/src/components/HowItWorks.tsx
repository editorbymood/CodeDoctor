import { motion } from 'framer-motion';

const steps = [
    {
        num: "01",
        title: "Connect Repository",
        desc: "Grant secure, read-only access to your GitHub or GitLab repositories. No code is stored permanently."
    },
    {
        num: "02",
        title: "Agent Pipeline Scan",
        desc: "Our multi-agent architecture executes a deep AST analysis, identifying vulnerabilities and technical debt in seconds."
    },
    {
        num: "03",
        title: "Merge Perfect Code",
        desc: "Review the generated fixes in our dashboard and deploy zero-debt, highly optimized code straight to production."
    }
];

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="w-full py-32 border-t border-white/[0.03] relative bg-[#09090b]">
            <div className="w-full max-w-[1200px] mx-auto px-6 xl:px-0 relative z-10">
                <div className="text-center mb-20">
                    <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-[#fafafa] mb-4">Pipeline execution</h2>
                    <p className="text-base text-zinc-400 max-w-xl mx-auto">From raw codebase to production-ready architecture in three automated steps.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                    {/* Connecting Line */}
                    <div className="hidden md:block absolute top-[28px] left-[15%] right-[15%] h-[1px] bg-white/10"></div>

                    {steps.map((step, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ delay: i * 0.1, duration: 0.4 }}
                            className="bg-[#0c0c0e] border border-white/[0.03] rounded-[24px] p-8 hover:border-white/[0.08] transition-all duration-300 flex flex-col items-start relative text-left"
                        >
                            <div className="w-14 h-14 bg-[#111113] border border-white/5 flex items-center justify-center text-sm font-medium text-zinc-400 mb-6 relative z-10 rounded-full">
                                {step.num}
                            </div>
                            <h3 className="text-lg font-medium text-[#fafafa] mb-2">{step.title}</h3>
                            <p className="text-zinc-500 text-sm leading-relaxed">{step.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
