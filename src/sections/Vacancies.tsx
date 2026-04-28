import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Clock, Wallet, ChevronDown, ChevronUp, Mail } from 'lucide-react';
import { vacancies } from '../data/vacancies';
import { useContactForm } from '../context/useContactForm';

const INITIAL_COUNT = 3;

export default function Vacancies() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [expanded, setExpanded] = useState(false);
  const { setPrefillMessage } = useContactForm();

  const handleApply = (v: typeof vacancies[number]) => {
    setPrefillMessage(
      `Здравствуйте! Хочу откликнуться на вакансию «${v.position}» (${v.residentName}, ${v.residentCategory}).`
    );
    document.getElementById('contacts')?.scrollIntoView({ behavior: 'smooth' });
  };

  const visible = expanded ? vacancies : vacancies.slice(0, INITIAL_COUNT);

  return (
    <section
      id="vacancies"
      ref={ref}
      className="bg-[#F5F7F9] py-24 lg:py-32 relative"
    >
      {/* subtle accent */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-0 right-0 w-[600px] h-[400px]"
          style={{
            background:
              'radial-gradient(circle at top right, rgba(47,111,237,0.05) 0%, transparent 60%)',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="section-badge inline-flex">Карьера</span>
            <h2 className="text-4xl sm:text-5xl font-black text-[#1F2933] leading-[1.1] tracking-tight mb-4">
              Открытые{' '}
              <span className="bg-gradient-to-r from-[#2F6FED] to-[#4A7FF0] bg-clip-text text-transparent">
                вакансии
              </span>
            </h2>
            <p className="text-[#6B7C8F] text-base">
              Резиденты Технопарка 1219 ищут профессионалов. Официальное
              трудоустройство, конкурентная зарплата, стабильность.
            </p>
          </motion.div>
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence initial={false}>
            {visible.map((v, i) => (
              <motion.div
                key={v.id}
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                transition={{
                  duration: 0.55,
                  ease: [0.22, 1, 0.36, 1],
                  delay: expanded ? (i < INITIAL_COUNT ? 0 : (i - INITIAL_COUNT) * 0.07) : i * 0.1,
                }}
                className="flex flex-col bg-white border border-[#D9E1E8] hover:border-[#2F6FED]/30 rounded-xl p-6 hover:shadow-[0_12px_40px_rgba(43,47,54,0.08)] transition-all duration-250"
              >
                {/* Resident badge */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-2.5 py-1 bg-[#E6EEF8] text-[#2F6FED] text-[11px] font-semibold rounded-full uppercase tracking-wide">
                    {v.residentCategory}
                  </span>
                </div>

                {/* Resident name */}
                <p className="text-xs font-semibold text-[#6B7C8F] uppercase tracking-wider mb-1">
                  {v.residentName}
                </p>

                {/* Position */}
                <h3 className="text-lg font-black text-[#1F2933] mb-4 leading-snug">
                  {v.position}
                </h3>

                {/* Meta */}
                <div className="space-y-2 mb-5 flex-1">
                  <div className="flex items-center gap-2 text-sm text-[#6B7C8F]">
                    <Wallet className="w-4 h-4 text-[#2F6FED] shrink-0" />
                    <span>{v.salary}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#6B7C8F]">
                    <Clock className="w-4 h-4 text-[#2F6FED] shrink-0" />
                    <span>{v.schedule}</span>
                  </div>
                </div>

                {/* Requirements */}
                <ul className="space-y-1.5 mb-6">
                  {v.requirements.map((r) => (
                    <li
                      key={r}
                      className="flex items-start gap-2 text-sm text-[#1F2933]"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2F6FED] mt-1.5 shrink-0" />
                      {r}
                    </li>
                  ))}
                </ul>

                {/* Contact */}
                <button
                  onClick={() => handleApply(v)}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-[#2F6FED] hover:bg-[#4A7FF0] text-white font-semibold rounded-lg text-sm transition-all duration-200 hover:shadow-[0_4px_20px_rgba(47,111,237,0.35)]"
                >
                  <Mail className="w-4 h-4" />
                  Откликнуться
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Show more / less */}
        {vacancies.length > INITIAL_COUNT && (
          <div className="mt-10 text-center">
            <button
              onClick={() => setExpanded((v) => !v)}
              className="inline-flex items-center gap-2 px-6 py-3 border border-[#D9E1E8] hover:border-[#2F6FED]/40 bg-white hover:bg-[#F0F5FF] text-[#1F2933] font-semibold rounded-lg text-sm transition-all duration-200"
            >
              {expanded ? (
                <>
                  Скрыть <ChevronUp className="w-4 h-4" />
                </>
              ) : (
                <>
                  Все вакансии ({vacancies.length - INITIAL_COUNT} ещё){' '}
                  <ChevronDown className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}






