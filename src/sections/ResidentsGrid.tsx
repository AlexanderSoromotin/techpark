import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Wrench, Settings, Building2, Package, Droplets,
  Printer, Home, Beef, Apple, ArrowRight,
} from 'lucide-react';
import { residents } from '../data/residents';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Wrench, Settings, Building2, Package, Droplets,
  Printer, Home, Beef, Apple,
};

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
            const Icon = iconMap[r.iconName] ?? Wrench;
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
                {/* Gradient header */}
                <div
                  className="h-36 flex items-center justify-center relative overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${r.gradientFrom}, ${r.gradientTo})`,
                  }}
                >
                  {/* Decorative circles */}
                  <div className="absolute -top-8 -right-8 w-28 h-28 bg-white/10 rounded-full" />
                  <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-white/10 rounded-full" />
                  <Icon className="w-12 h-12 text-white relative z-10 group-hover:scale-110 transition-transform duration-300" />
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    {r.category}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-sky-600 transition-colors">
                    {r.name}
                  </h3>
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



