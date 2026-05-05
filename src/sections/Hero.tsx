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
  { value: '7', label: 'Направлений' },
  { value: '2019', label: 'Год основания' },
];

export default function Hero() {
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section className="relative flex flex-col justify-center overflow-hidden bg-[#2B2F36]" style={{ minHeight: '100dvh' }}>
      {/* Subtle gradient blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="blob-animate absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-[0.08]"
          style={{ background: 'radial-gradient(circle, #2F6FED 0%, transparent 70%)' }}
        />
        <div
          className="blob-animate-delayed absolute -bottom-48 -left-32 w-[400px] h-[400px] rounded-full opacity-[0.06]"
          style={{ background: 'radial-gradient(circle, #4A7FF0 0%, transparent 70%)' }}
        />
      </div>

      {/* Diagonal tech grid overlay */}
      <div className="hero-grid absolute inset-0 pointer-events-none" />

      {/* Decorative diagonal lines - направленные формы */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-[20%] w-px h-full bg-gradient-to-b from-transparent via-[#2F6FED]/10 to-transparent rotate-[12deg] origin-top-left" />
        <div className="absolute top-0 left-[40%] w-px h-full bg-gradient-to-b from-transparent via-[#2F6FED]/8 to-transparent rotate-[6deg] origin-top-left" />
        <div className="absolute top-0 left-[60%] w-px h-full bg-gradient-to-b from-transparent via-[#2F6FED]/6 to-transparent -rotate-[8deg] origin-top-right" />
        <div className="absolute top-0 right-[20%] w-px h-full bg-gradient-to-b from-transparent via-[#2F6FED]/10 to-transparent -rotate-[15deg] origin-top-right" />
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
            <span className="inline-flex items-center gap-2.5 px-4 py-2 bg-white/[0.06] backdrop-blur-sm border border-white/12 rounded-lg text-sm text-white/80 font-medium mb-8">
              <span className="w-2 h-2 bg-[#2F6FED] rounded-full pulse-subtle" />
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
            <span className="bg-gradient-to-r from-[#2F6FED] to-[#4A7FF0] bg-clip-text text-transparent">1219</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={fadeUp}
            className="text-lg sm:text-xl text-white/60 max-w-2xl mb-12 leading-relaxed"
          >
            Промышленный технопарк полного цикла.
            <br className="hidden sm:block" />
            Производство, технологии и люди — в одном месте.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
            <a
              href="/#contacts"
              onClick={(e) => { e.preventDefault(); scrollTo('contacts'); }}
              className="group flex items-center gap-2 px-8 py-4 bg-[#2F6FED] hover:bg-[#4A7FF0] text-white font-bold rounded-lg transition-all duration-250 hover:shadow-[0_8px_30px_rgba(47,111,237,0.35)] text-base"
            >
              Стать резидентом
              <ArrowRight className="w-4 h-4 transition-transform duration-250 group-hover:translate-x-1" />
            </a>
            <a
              href="/#residents"
              onClick={(e) => { e.preventDefault(); scrollTo('residents'); }}
              className="px-8 py-4 bg-white/[0.08] hover:bg-white/[0.12] border border-white/15 text-white font-bold rounded-lg transition-all duration-250 backdrop-blur-sm text-base"
            >
              Найти производство
            </a>
            <a
              href="/#contacts"
              onClick={(e) => { e.preventDefault(); scrollTo('contacts'); }}
              className="px-6 py-4 text-white/50 hover:text-white font-medium transition-colors duration-200 text-base flex items-center gap-1"
            >
              Связаться
              <ArrowRight className="w-4 h-4" />
            </a>
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
              <div className="text-white/40 text-sm mt-1 font-medium">{s.label}</div>
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
        className="absolute bottom-14 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 hover:text-white/60 transition-colors"
      >
        <span className="text-[10px] font-semibold tracking-[0.2em] uppercase">Прокрутите</span>
        <ChevronDown className="w-5 h-5 animate-bounce" />
      </motion.button>
    </section>
  );
}



