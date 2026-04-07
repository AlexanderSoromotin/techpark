import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Zap, ShieldCheck, Handshake, TruckIcon, Clock, Users } from 'lucide-react';

const benefits = [
  {
    icon: Clock,
    title: 'Быстрый запуск производства',
    desc: 'Готовые площади с коммуникациями — начните производить уже через несколько дней после подписания договора.',
  },
  {
    icon: ShieldCheck,
    title: 'Надёжная инфраструктура',
    desc: 'Электроснабжение, газ, вода, интернет, охрана и видеонаблюдение 24/7 включены в стоимость.',
  },
  {
    icon: Handshake,
    title: 'Поддержка на каждом шагу',
    desc: 'Помогаем с документами, сертификацией, бухгалтерией и юридическими вопросами — вы не один.',
  },
  {
    icon: TruckIcon,
    title: 'Выгодная логистика',
    desc: 'Удобные подъездные пути для грузового транспорта, собственные погрузочные зоны и склады.',
  },
  {
    icon: Zap,
    title: 'Синергия резидентов',
    desc: 'Соседи-производители — ваши потенциальные партнёры. Находите клиентов и поставщиков внутри технопарка.',
  },
  {
    icon: Users,
    title: 'Квалифицированные кадры',
    desc: 'Содействие в подборе персонала благодаря общей HR-сети технопарка и связям с учебными заведениями.',
  },
];

export default function WhyUs() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="why-us" ref={ref} className="bg-[#0b1426] py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }}
          >
            <span className="section-badge inline-flex">Преимущества</span>
            <h2 className="text-4xl sm:text-5xl font-black text-white leading-[1.1] tracking-tight mb-4">
              Почему выбирают
              <br />
              <span className="text-sky-600">Технопарк 1219</span>
            </h2>
            <p className="text-slate-400 text-base leading-relaxed">
              Всё, что нужно успешному производству, — уже здесь.
            </p>
          </motion.div>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((b, i) => {
            const Icon = b.icon;
            return (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1] as [number,number,number,number],
                  delay: 0.1 + i * 0.09,
                }}
                className="group p-7 rounded-2xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:border-sky-600/30 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-sky-600/15 group-hover:bg-sky-600 rounded-xl flex items-center justify-center mb-5 transition-all duration-300">
                  <Icon className="w-6 h-6 text-sky-500 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-white font-bold text-base mb-3">{b.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{b.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}



