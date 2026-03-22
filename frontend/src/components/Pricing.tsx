import { motion } from 'framer-motion';

const tiers = [
    {
        name: "Scrub",
        price: "Free",
        desc: "Because you can't afford anything else.",
        features: ["Up to 5 repos", "Standard AST insults", "50 scans/mo", "No support (we don't care)"],
        buttonProps: { text: "Start Free", bgColor: "var(--accent-amber)" },
        popular: false
    },
    {
        name: "Tryhard",
        price: "$29",
        period: "/mo",
        desc: "For devs who pretend to care about quality.",
        features: ["Unlimited repos", "Deep security roasting", "Unlimited scans", "Priority SSE insults", "Automated PRs you won't read"],
        buttonProps: { text: "Take My Money", bgColor: "var(--accent-pink)" },
        popular: true
    },
    {
        name: "Whale",
        price: "Custom",
        desc: "For teams with more budget than sense.",
        features: ["Dedicated insult clusters", "Custom CVE rulesets", "SAML SSO", "SLA guarantees", "A manager to yell at"],
        buttonProps: { text: "Bribe Sales", bgColor: "var(--accent-cyan)" },
        popular: false
    }
];

export default function Pricing() {
    return (
        <section id="pricing" className="w-full py-32 relative bg-[#fffceb] border-t-4 border-black">
            <div className="w-full max-w-[1200px] mx-auto px-6 xl:px-0 relative z-10">
                <div className="text-center mb-20 flex flex-col items-center">
                    <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tight text-black mb-4 bg-[var(--accent-amber)] border-4 border-black px-6 py-2 rotate-2 shadow-[6px_6px_0px_#000] inline-block">Pay Us To Fix Your Mess</h2>
                    <p className="text-xl font-bold text-black max-w-xl mx-auto border-4 border-black p-4 bg-white shadow-[6px_6px_0px_#000] transform -rotate-1 mt-6">Cheaper than hiring another 10x dev to rewrite everything.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                    {tiers.map((tier, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ delay: i * 0.1, duration: 0.2 }}
                            className={`relative border-4 border-black p-8 bg-white ${tier.popular ? 'shadow-[12px_12px_0px_var(--accent-pink)] -translate-y-4' : 'shadow-[8px_8px_0px_#000]'} hover:-translate-y-2 hover:shadow-[12px_12px_0px_#000] transition-all duration-200`}
                        >
                            {tier.popular && (
                                <div className="absolute top-0 right-4 -translate-y-1/2 bg-black text-white text-xs font-black px-4 py-2 uppercase tracking-widest border-2 border-dashed border-white transform rotate-3 z-10">
                                    Most Gullible
                                </div>
                            )}

                            <h3 className="text-2xl font-black uppercase text-black mb-2">{tier.name}</h3>
                            <p className="text-base font-bold text-black mb-6 h-12">{tier.desc}</p>
                            
                            <div className="mb-8 flex items-baseline gap-1">
                                <span className="text-4xl font-black text-black">{tier.price}</span>
                                {tier.period && <span className="text-black font-bold text-xl">{tier.period}</span>}
                            </div>

                            <button className="w-full py-4 border-4 border-black font-black uppercase tracking-wider transition-all duration-100 mb-8 text-base text-black shadow-[4px_4px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[0px_0px_0px_#000]" style={{ backgroundColor: tier.buttonProps.bgColor }}>
                                {tier.buttonProps.text}
                            </button>

                            <div className="space-y-4 border-t-4 border-dashed border-black pt-6">
                                {tier.features.map((feature, j) => (
                                    <div key={j} className="flex items-center gap-3">
                                        <svg className="w-6 h-6 text-black flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="text-base font-bold text-black">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
