import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { residents } from '../data/residents';

export default function ResidentsGrid() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const navigate = useNavigate();

  return (
    <section id="residents" ref={ref} className="bg-white py-24 lg:py-32 relative">
      {/* Subtle directional lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-0 right-0 w-[400px] h-[400px]" style={{
          background: 'radial-gradient(circle at top right, rgba(47,111,237,0.05) 0%, transparent 60%)'
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }}
          >
            <span className="section-badge inline-flex">Резиденты</span>
            <h2 className="text-4xl sm:text-5xl font-black text-[#1F2933] leading-[1.1] tracking-tight mb-4">
              Направления
              <br />
              <span className="bg-gradient-to-r from-[#2F6FED] to-[#4A7FF0] bg-clip-text text-transparent">производства</span>
            </h2>
            <p className="text-[#6B7C8F] text-base leading-relaxed">
              Десять актуальных направлений под одной крышей. Нажмите на карточку, чтобы узнать больше.
            </p>
          </motion.div>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {residents.filter((r) => !r.is_hidden).map((r, i) => {
            return (
              <motion.article
                key={r.id}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1] as [number,number,number,number],
                  delay: 0.1 + i * 0.07,
                }}
                className="card-hover group bg-white rounded-xl border border-[#D9E1E8] overflow-hidden cursor-pointer"
                onClick={() => navigate(`/resident/${r.slug}`)}
              >
                {/* Photo header */}
                <div className="relative h-44 overflow-hidden bg-[#2B2F36]">
                  <img
                    src={r.image}
                    alt={r.imageAlt}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-105"
                  />

                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        'linear-gradient(180deg, rgba(43,47,54,0.05) 0%, rgba(43,47,54,0.15) 44%, rgba(43,47,54,0.75) 100%)',
                    }}
                  />

                  <div
                    className="absolute inset-0 mix-blend-multiply opacity-50"
                    style={{
                      background: `linear-gradient(135deg, ${r.gradientFrom}, ${r.gradientTo})`,
                    }}
                  />

                  {/* Diagonal accent line */}
                  <div className="absolute top-0 right-0 w-20 h-20 opacity-20"
                    style={{
                      background: 'linear-gradient(135deg, transparent 50%, rgba(47,111,237,0.4) 50%)',
                    }}
                  />

                  <div className="absolute inset-x-0 bottom-0 z-10 p-5">
                    <div className="mb-2 inline-flex rounded-md border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/90 backdrop-blur-sm">
                      {r.category}
                    </div>
                    <h3 className="text-lg font-bold leading-tight text-white drop-shadow-sm">
                      {r.name}
                    </h3>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-[#6B7C8F] text-sm leading-relaxed mb-5">{r.description}</p>
                  <button className="flex items-center gap-1.5 text-[#2F6FED] hover:text-[#4A7FF0] font-semibold text-sm transition-colors group/btn">
                    Подробнее
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
                  </button>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
