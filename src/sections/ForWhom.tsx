import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ShoppingCart, Building2, UserCheck, ArrowRight } from 'lucide-react';

const segments = [
  {
    icon: ShoppingCart,
    title: 'Клиенты',
    subtitle: 'Заказать производство',
    desc: 'Ищете надёжного производителя? Размещайте заказы у наших резидентов и получите готовую продукцию в короткие сроки.',
    points: [
      'Гидравлические рукава и карданные валы',
      'Металлоконструкции любой сложности',
      'Пищевое производство под заказ',
    ],
    cta: 'Найти производителя',
    hash: 'residents',
    accentBg: 'bg-sky-600',
    lightBg: 'bg-sky-50',
    border: 'border-sky-100 hover:border-sky-300',
    iconBg: 'bg-sky-100',
    iconColor: 'text-sky-600',
  },
  {
    icon: Building2,
    title: 'Бизнес',
    subtitle: 'Стать резидентом',
    desc: 'Откройте производство без многомиллионных вложений в инфраструктуру. Готовые площади, коммуникации и поддержка ждут вас.',
    points: [
      'Аренда от 50 м² до 500 м²',
      'Производственные и складские помещения',
      'Полный сервис и управление',
    ],
    cta: 'Стать резидентом',
    hash: 'contacts',
    accentBg: 'bg-slate-900',
    lightBg: 'bg-slate-50',
    border: 'border-slate-100 hover:border-slate-300',
    iconBg: 'bg-slate-100',
    iconColor: 'text-slate-600',
  },
  {
    icon: UserCheck,
    title: 'Специалисты',
    subtitle: 'Найти работу',
    desc: 'Технопарк 1219 — это стабильные рабочие места в разных отраслях. Сварщики, механики, технологи, операторы — мы ищем профессионалов.',
    points: [
      'Официальное трудоустройство',
      'Конкурентная зарплата',
      'Профессиональный рост',
    ],
    cta: 'Смотреть вакансии',
    hash: 'contacts',
    accentBg: 'bg-blue-600',
    lightBg: 'bg-blue-50',
    border: 'border-blue-100 hover:border-blue-300',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-500',
  },
];

export default function ForWhom() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="for-whom" ref={ref} className="bg-slate-50 py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }}
          >
            <span className="section-badge inline-flex">Для кого</span>
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 leading-[1.1] tracking-tight mb-4">
              Мы работаем
              <br />
              <span className="text-sky-600">для вас</span>
            </h2>
            <p className="text-slate-500 text-base">
              Клиенты, партнёры и специалисты — каждому найдётся своя роль в Технопарке 1219.
            </p>
          </motion.div>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {segments.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.7,
                  ease: [0.22, 1, 0.36, 1] as [number,number,number,number],
                  delay: 0.1 + i * 0.12,
                }}
                className={`group flex flex-col p-8 rounded-2xl bg-white border transition-all duration-300 ${s.border} hover:shadow-[0_12px_40px_rgba(0,0,0,0.09)]`}
              >
                {/* Icon */}
                <div className={`w-14 h-14 ${s.iconBg} rounded-2xl flex items-center justify-center mb-6`}>
                  <Icon className={`w-7 h-7 ${s.iconColor}`} />
                </div>

                {/* Tag */}
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  {s.subtitle}
                </div>

                {/* Title */}
                <h3 className="text-2xl font-black text-slate-900 mb-4">{s.title}</h3>

                {/* Desc */}
                <p className="text-slate-500 text-sm leading-relaxed mb-6">{s.desc}</p>

                {/* Points */}
                <ul className="space-y-2 mb-8 flex-1">
                  {s.points.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-sm text-slate-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-600 mt-1.5 shrink-0" />
                      {p}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  onClick={() =>
                    document.getElementById(s.hash)?.scrollIntoView({ behavior: 'smooth' })
                  }
                  className={`flex items-center justify-center gap-2 w-full py-3.5 ${s.accentBg} text-white font-semibold rounded-xl text-sm transition-all duration-200 hover:opacity-90 hover:shadow-lg`}
                >
                  {s.cta}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}



