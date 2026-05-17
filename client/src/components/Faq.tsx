import { ChevronDownIcon } from 'lucide-react';
import Title from './Title';
import { faqData } from '../assets/dummy-data';
import { useRef } from 'react';
import { motion } from 'framer-motion';

export default function Faq() {
    const refs = useRef<(HTMLDetailsElement | null)[]>([]);
    return (
        <section id="faq" className="py-20 2xl:py-32">
            <div className="max-w-3xl mx-auto px-4">

                <Title
                    title="FAQ"
                    heading="Frequently asked questions"
                    description="Everything you need to know about using the platform.
                    If you have any question,feel free to contact us."
                />

                <div className="space-y-3">
                    {faqData.map((faq, i) => (
                        <motion.details
                            ref={(el) => {
                                refs.current[i] = el;
                            }}
                            initial={{ y: 100, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1, delay: 0.1 + i * 0.1 }}
                            key={i}
                            onAnimationComplete={() => {
                                const card = refs.current[i];
                                if (card) {
                                    card.classList.add("transition", "duration-300");
                                }
                            }}
                            className="group glass-panel rounded-2xl select-none border border-white/10 shadow-inner mb-4 overflow-hidden"
                        >
                            <summary className="flex items-center justify-between p-5 cursor-pointer bg-white/5 hover:bg-white/10 transition-colors">
                                <h4 className="font-medium text-white/90 text-lg tracking-wide">{faq.question}</h4>
                                <ChevronDownIcon className="w-5 h-5 text-indigo-400 group-open:rotate-180 transition-transform duration-300" />
                            </summary>
                            <p className="p-5 text-sm text-white/60 leading-relaxed bg-[#030712]/50 border-t border-white/5">
                                {faq.answer}
                            </p>
                        </motion.details>
                    ))}
                </div>
            </div>
        </section>
    );
};