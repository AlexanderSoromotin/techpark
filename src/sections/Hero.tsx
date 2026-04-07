import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13, delayChildren: 0.2 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const statsData = [
  { value: '9', label: 'Резидентов' },
  { value: '5 000+', label: 'м² площадей' },
  { value: '6', label: 'Направлений' },
  { value: '2019', label: 'Год основания' },
];

export default function Hero() {
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section className="relative flex flex-col justify-center overflow-hidden bg-[#0b1426]" style={{ minHeight: '100dvh' }}>
      {/* Animated gradient blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="blob-animate absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full opacity-[0.07]"
          style={{ background: 'radial-gradient(circle, #0284c7 0%, transparent 70%)' }}
        />
        <div
          className="blob-animate-delayed absolute -bottom-48 -left-32 w-[500px] h-[500px] rounded-full opacity-[0.06]"
          style={{ background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)' }}
        />
        <div
          className="absolute top-1/2 right-1/3 w-72 h-72 rounded-full opacity-[0.04]"
          style={{ background: 'radial-gradient(circle, #0284c7 0%, transparent 70%)' }}
        />
      </div>

      {/* Tech grid overlay */}
      <div className="hero-grid absolute inset-0 pointer-events-none" />

      {/* Decorative diagonal lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.03]">
        <div className="absolute top-0 left-1/4 w-px h-full bg-sky-500 rotate-[15deg] origin-top-left" />
        <div className="absolute top-0 left-1/2 w-px h-full bg-sky-500 rotate-[8deg] origin-top-left" />
        <div className="absolute top-0 right-1/4 w-px h-full bg-sky-500 -rotate-[12deg] origin-top-right" />
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-32 pb-24">
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="max-w-5xl"
        >
          {/* Badge */}
          <motion.div variants={fadeUp}>
            <span className="inline-flex items-center gap-2.5 px-4 py-2 bg-white/[0.07] backdrop-blur-sm border border-white/15 rounded-full text-sm text-slate-300 font-medium mb-8">
              <span className="w-2 h-2 bg-sky-600 rounded-full animate-pulse" />
              Промышленный технопарк · Троицк, Челябинская область
            </span>
          </motion.div>

          {/* H1 */}
          <motion.h1
            variants={fadeUp}
            className="text-5xl sm:text-6xl lg:text-8xl font-black text-white leading-[0.95] tracking-tight mb-8"
          >
            Технопарк
            <br />
            <span className="text-sky-600">1219</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={fadeUp}
            className="text-lg sm:text-xl text-slate-400 max-w-2xl mb-12 leading-relaxed"
          >
            Промышленный технопарк полного цикла.
            <br className="hidden sm:block" />
            Производство, технологии и люди — в одном месте.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
            <button
              onClick={() => scrollTo('contacts')}
              className="group flex items-center gap-2 px-8 py-4 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-2xl transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_40px_rgba(2,132,199,0.3)] text-base"
            >
              Стать резидентом
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => scrollTo('residents')}
              className="px-8 py-4 bg-white/[0.08] hover:bg-white/[0.14] border border-white/20 text-white font-bold rounded-2xl transition-all duration-300 backdrop-blur-sm text-base"
            >
              Найти производство
            </button>
            <button
              onClick={() => scrollTo('contacts')}
              className="px-6 py-4 text-slate-400 hover:text-white font-medium transition-colors duration-200 text-base"
            >
              Связаться →
            </button>
          </motion.div>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mt-20 pt-10 border-t border-white/[0.08] grid grid-cols-2 sm:grid-cols-4 gap-8"
        >
          {statsData.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl sm:text-4xl font-black text-white">{s.value}</div>
              <div className="text-slate-500 text-sm mt-1 font-medium">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.button
        onClick={() => scrollTo('about')}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-14 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-600 hover:text-slate-400 transition-colors"
      >
        <span className="text-[10px] font-semibold tracking-[0.2em] uppercase">Прокрутите</span>
        <ChevronDown className="w-5 h-5 animate-bounce" />
      </motion.button>
    </section>
  );
}



