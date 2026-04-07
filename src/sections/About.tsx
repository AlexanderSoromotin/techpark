import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Zap, Shield, TruckIcon, LayoutGrid } from 'lucide-react';

const advantages = [
  {
    icon: Zap,
    title: 'Быстрый запуск',
    desc: 'Готовые производственные площади с подведёнными коммуникациями. Запуск производства — за дни, не за месяцы.',
  },
  {
    icon: LayoutGrid,
    title: 'Готовая инфраструктура',
    desc: 'Электроснабжение, газ, вода, канализация, интернет и охрана — всё включено в арендную ставку.',
  },
  {
    icon: Shield,
    title: 'Поддержка бизнеса',
    desc: 'Помогаем с оформлением документации, сертификацией продукции, бухгалтерскими и юридическими вопросами.',
  },
  {
    icon: TruckIcon,
    title: 'Удобная логистика',
    desc: 'Удобный въезд для грузовых автомобилей, собственные погрузочные зоны и складские помещения.',
  },
];

const statItems = [
  { value: '9', label: 'Резидентов', sub: 'действующих компаний' },
  { value: '5 000', label: 'м² площадей', sub: 'производственных и складских' },
  { value: '6+', label: 'Отраслей', sub: 'от металла до еды' },
  { value: '2019', label: 'Год основания', sub: 'работаем стабильно' },
];

function Counter({ value }: { value: string }) {
  return <span className="stat-number">{value}</span>;
}

export default function About() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="about" ref={ref} className="bg-white py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start mb-20">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }}
          >
            <span className="section-badge">О технопарке</span>
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 leading-[1.1] tracking-tight">
              Промышленный центр
              <br />
              <span className="text-sky-600">полного цикла</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number,number,number,number], delay: 0.15 }}
            className="space-y-4 text-slate-600 text-base leading-relaxed"
          >
            <p>
              Технопарк 1219 — это современный промышленный комплекс в Троицке Челябинской области,
              объединяющий девять производственных предприятий разных отраслей.
            </p>
            <p>
              Здесь созданы все условия для эффективного бизнеса: готовые площади, инженерные
              коммуникации, опытная команда управляющей компании и синергия резидентов, которые
              помогают друг другу расти.
            </p>
            <p className="font-semibold text-slate-800">
              От ремонта гидравлики до производства натуральных снеков — под одной крышей.
            </p>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number,number,number,number], delay: 0.25 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
        >
          {statItems.map((s) => (
            <div
              key={s.label}
              className="bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:border-sky-200 hover:bg-sky-50/30 transition-all duration-300"
            >
              <div className="text-4xl font-black text-slate-900 mb-1">
                <Counter value={s.value} />
              </div>
              <div className="text-sky-600 font-semibold text-sm mb-1">{s.label}</div>
              <div className="text-slate-500 text-xs">{s.sub}</div>
            </div>
          ))}
        </motion.div>

        {/* Advantages */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {advantages.map((adv, i) => {
            const Icon = adv.icon;
            return (
              <motion.div
                key={adv.title}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1] as [number,number,number,number],
                  delay: 0.35 + i * 0.1,
                }}
                className="group p-6 rounded-2xl border border-slate-100 hover:border-sky-200 hover:shadow-[0_8px_30px_rgba(2,132,199,0.12)] transition-all duration-300"
              >
                <div className="w-12 h-12 bg-sky-100 group-hover:bg-sky-600 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300">
                  <Icon className="w-6 h-6 text-sky-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2 text-base">{adv.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{adv.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}



