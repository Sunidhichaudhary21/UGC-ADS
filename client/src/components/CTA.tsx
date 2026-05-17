import { ArrowRightIcon } from 'lucide-react';
import { GhostButton } from './Buttons';
import { motion } from 'framer-motion';

export default function CTA() {
    return (
        <section className="py-20 2xl:pb-32 px-4 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/10 to-transparent pointer-events-none" />
            <div className="container mx-auto max-w-4xl relative z-10">
                <div className="rounded-[2.5rem] bg-gradient-to-br from-[#0f172a]/80 via-[#1e1b4b]/60 to-[#030712]/80 backdrop-blur-2xl border border-indigo-500/20 shadow-[0_0_50px_rgba(99,102,241,0.15)] p-12 md:p-20 text-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-10 mix-blend-overlay" />
                    <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <div className="relative z-20">
                        <motion.h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-6"
                            initial={{ y: 60, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1 }}
                        >
                            Ready to transform your <span className="text-gradient">Content?</span>
                        </motion.h2>
                        <motion.p className="text-base sm:text-lg text-white/60 mb-10 max-w-xl mx-auto leading-relaxed"
                            initial={{ y: 60, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1, delay: 0.2 }}
                        >
                            Join thousands of brands creating viral UGC with AI. No
                            credit card required. Start creating Now!
                        </motion.p>
                        <motion.div
                            initial={{ y: 60, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1, delay: 0.3 }}
                        >
                            <a href="/generate" className="inline-block">
                                <GhostButton className="px-10 py-4 gap-3 text-base shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] group-hover:bg-white/10">
                                    Start creating now <ArrowRightIcon size={20} className="group-hover:translate-x-1 transition-transform" />
                                </GhostButton>
                            </a>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};