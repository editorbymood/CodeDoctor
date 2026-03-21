import { motion } from 'framer-motion';
import { TargetIcon } from 'lucide-react'; // Can use our own SVG if needed

const tiers = [
    {
        name: "Developer",
        price: "Free",
        desc: "Perfect for indie hackers and individual developers.",
        features: ["Up to 5 repositories", "Standard AST analysis", "50 scans per month", "Community support"],
        buttonProps: { text: "Start Free", variant: "secondary" },
        popular: false
    },
    {
        name: "Pro",
        price: "$29",
        period: "/mo",
        desc: "For professional developers demanding excellence.",
        features: ["Unlimited repositories", "Deep security auditing", "Unlimited scans", "Priority SSE telemetry", "Automated PR generation"],
        buttonProps: { text: "Upgrade to Pro", variant: "primary" },
        popular: true
    },
    {
        name: "Enterprise",
        price: "Custom",
        desc: "For teams requiring zero-debt infrastructure.",
        features: ["Dedicated agent clusters", "Custom CVE rulesets", "SAML SSO", "SLA guarantees", "Dedicated account manager"],
        buttonProps: { text: "Contact Sales", variant: "secondary" },
        popular: false
    }
];

export default function Pricing() {
    return (
        <section id="pricing" className="w-full py-32 relative bg-[#09090b]">
            <div className="w-full max-w-[1200px] mx-auto px-6 xl:px-0 relative z-10">
                <div className="text-center mb-20">
                    <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-[#fafafa] mb-4">Invest in perfection</h2>
                    <p className="text-base text-zinc-400 max-w-xl mx-auto">Eliminate technical debt at a fraction of the cost of a senior engineer.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                    {tiers.map((tier, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ delay: i * 0.1, duration: 0.4 }}
                            className={`relative rounded-[24px] p-8 border ${tier.popular ? 'bg-[#0f0f12] border-white/10' : 'bg-[#0c0c0e] border-white/[0.03]'}`}
                        >
                            {tier.popular && (
                                <div className="absolute top-0 right-8 -translate-y-1/2 bg-white text-[#09090b] text-[11px] font-semibold px-3 py-1 rounded-sm uppercase tracking-wider">
                                    Most Popular
                                </div>
                            )}

                            <h3 className="text-lg font-medium text-[#fafafa] mb-2">{tier.name}</h3>
                            <p className="text-sm text-zinc-500 mb-6 h-10">{tier.desc}</p>
                            
                            <div className="mb-8 flex items-baseline gap-1">
                                <span className="text-3xl font-medium text-[#fafafa]">{tier.price}</span>
                                {tier.period && <span className="text-zinc-500 text-sm font-medium">{tier.period}</span>}
                            </div>

                            <button className={`w-full py-3 rounded-full font-medium transition-all duration-200 mb-8 text-sm ${tier.buttonProps.variant === 'primary' ? 'bg-white text-black hover:bg-zinc-200' : 'bg-zinc-900 text-white border border-zinc-800 hover:bg-zinc-800'}`}>
                                {tier.buttonProps.text}
                            </button>

                            <div className="space-y-4 border-t border-white/5 pt-6">
                                {tier.features.map((feature, j) => (
                                    <div key={j} className="flex items-center gap-3">
                                        <svg className={`w-4 h-4 ${tier.popular ? 'text-white' : 'text-zinc-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="text-sm text-zinc-400">{feature}</span>
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
