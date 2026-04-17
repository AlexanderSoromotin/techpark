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
    <section id="residents" ref={ref} className="bg-slate-50 py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }}
          >
            <span className="section-badge inline-flex">Резиденты</span>
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 leading-[1.1] tracking-tight mb-4">
              Направления
              <br />
              <span className="text-sky-600">производства</span>
            </h2>
            <p className="text-slate-500 text-base leading-relaxed">
              Девять производственных компаний под одной крышей. Нажмите на карточку, чтобы узнать больше.
            </p>
          </motion.div>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {residents.map((r, i) => {
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
                className="card-hover group bg-white rounded-2xl border border-slate-100 overflow-hidden cursor-pointer"
                onClick={() => navigate(`/resident/${r.slug}`)}
              >
                {/* Photo header */}
                <div className="relative h-44 overflow-hidden bg-slate-900">
                  <img
                    src={r.image}
                    alt={r.imageAlt}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        'linear-gradient(180deg, rgba(15,23,42,0.06) 0%, rgba(15,23,42,0.18) 44%, rgba(15,23,42,0.78) 100%)',
                    }}
                  />

                  <div
                    className="absolute inset-0 mix-blend-multiply opacity-65"
                    style={{
                      background: `linear-gradient(135deg, ${r.gradientFrom}, ${r.gradientTo})`,
                    }}
                  />

                  <div className="absolute inset-0 opacity-[0.14]"
                    style={{
                      backgroundImage:
                        'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.95) 0, transparent 18%), radial-gradient(circle at 78% 16%, rgba(255,255,255,0.8) 0, transparent 16%), linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
                      backgroundSize: '240px 240px, 220px 220px, 42px 42px, 42px 42px',
                    }}
                  />

                  <div className="absolute -top-10 -right-10 h-28 w-28 rounded-full bg-white/12 blur-2xl" />
                  <div className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-white/10 blur-xl" />

                  <div className="absolute inset-x-0 bottom-0 z-10 p-5">
                    <div className="mb-2 inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/85 backdrop-blur-sm">
                      {r.category}
                    </div>
                    <h3 className="text-lg font-bold leading-tight text-white drop-shadow-sm">
                      {r.name}
                    </h3>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-slate-500 text-sm leading-relaxed mb-5">{r.description}</p>
                  <button className="flex items-center gap-1.5 text-sky-600 hover:text-sky-700 font-semibold text-sm transition-colors group/btn">
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



