import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function CTASection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section ref={ref} className="relative overflow-hidden py-24 lg:py-32 bg-sky-600">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-sky-500/40 rounded-full blur-[80px]" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-sky-700/40 rounded-full blur-[80px]" />
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }}
        >
          {/* Tag */}
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 border border-white/30 rounded-full text-white text-sm font-semibold mb-8">
            <Sparkles className="w-4 h-4" />
            Готовы к сотрудничеству?
          </span>

          {/* Heading */}
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.05] tracking-tight mb-6">
            Начните работу
            <br />
            с Технопарком 1219
          </h2>

          {/* Sub */}
          <p className="text-sky-100 text-lg max-w-xl mx-auto mb-12 leading-relaxed">
            Хотите разместить производство, найти подрядчика или стать частью нашей команды?
            Оставьте заявку — мы ответим в течение дня.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => scrollTo('contacts')}
              className="group flex items-center gap-2 px-8 py-4 bg-white hover:bg-slate-50 text-sky-600 font-bold rounded-2xl transition-all duration-200 hover:shadow-[0_0_30px_rgba(0,0,0,0.15)] text-base"
            >
              Оставить заявку
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => scrollTo('contacts')}
              className="px-8 py-4 bg-white/15 hover:bg-white/25 border border-white/40 text-white font-bold rounded-2xl transition-all duration-200 backdrop-blur-sm text-base"
            >
              Связаться напрямую
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}



