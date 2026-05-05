import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { faqSchema, toJsonLd } from '../utils/schema';
import { faqItems } from '../data/faqData';

export default function FAQSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {toJsonLd(faqSchema(faqItems))}
        </script>
      </Helmet>
      <section
        id="faq"
        ref={ref}
        className="bg-white py-24 lg:py-32 relative"
        aria-labelledby="faq-heading"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            >
              <span className="section-badge inline-flex">FAQ</span>
              <h2
                id="faq-heading"
                className="text-4xl sm:text-5xl font-black text-[#1F2933] leading-[1.1] tracking-tight mb-4"
              >
                Часто задаваемые
                <br />
                <span className="bg-gradient-to-r from-[#2F6FED] to-[#4A7FF0] bg-clip-text text-transparent">
                  вопросы
                </span>
              </h2>
              <p className="text-[#6B7C8F] text-base">
                Ответы на самые распространённые вопросы об аренде помещений и работе технопарка.
              </p>
            </motion.div>
          </div>

          {/* Accordion */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number], delay: 0.15 }}
            className="space-y-3"
          >
            {faqItems.map((item, i) => (
              <div
                key={i}
                className={`rounded-xl border transition-all duration-200 ${
                  openIndex === i
                    ? 'border-[#2F6FED]/30 shadow-[0_4px_20px_rgba(47,111,237,0.08)]'
                    : 'border-[#D9E1E8] hover:border-[#2F6FED]/20'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                  aria-expanded={openIndex === i}
                >
                  <span className="font-semibold text-[#1F2933] text-base">{item.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#2F6FED] shrink-0 transition-transform duration-200 ${
                      openIndex === i ? 'rotate-180' : ''
                    }`}
                    aria-hidden="true"
                  />
                </button>
                <AnimatePresence initial={false}>
                  {openIndex === i && (
                    <motion.div
                      key="answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-5 text-[#6B7C8F] text-sm leading-relaxed border-t border-[#D9E1E8] pt-4">
                        {item.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </motion.div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 text-center"
          >
            <p className="text-[#6B7C8F] text-sm mb-4">Не нашли ответ на свой вопрос?</p>
            <a
              href="/#contacts"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('contacts')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#2F6FED] hover:bg-[#4A7FF0] text-white font-semibold rounded-lg transition-all duration-200 hover:shadow-[0_8px_25px_rgba(47,111,237,0.3)] text-sm"
            >
              Задать вопрос
            </a>
          </motion.div>
        </div>
      </section>
    </>
  );
}


