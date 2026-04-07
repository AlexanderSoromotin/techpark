import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Phone, Mail, Globe, CheckCircle2, ArrowRight,
  Wrench, Settings, Building2, Package, Droplets,
  Printer, Home, Beef, Apple,
} from 'lucide-react';
import { getResidentBySlug } from '../data/residents';
import Header from '../components/Header';
import Footer from '../components/Footer';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Wrench, Settings, Building2, Package, Droplets,
  Printer, Home, Beef, Apple,
};

const galleryGradients = [
  'from-slate-600 to-slate-800',
  'from-slate-700 to-slate-900',
  'from-slate-500 to-slate-700',
  'from-slate-600 to-slate-900',
  'from-zinc-600 to-zinc-800',
  'from-zinc-700 to-zinc-900',
];

export default function ResidentPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const resident = getResidentBySlug(slug ?? '');

  if (!resident) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-600">
        <p className="text-2xl font-bold mb-4">Резидент не найден</p>
        <Link to="/" className="text-sky-600 hover:underline font-medium">← На главную</Link>
      </div>
    );
  }

  const Icon = iconMap[resident.iconName] ?? Wrench;

  return (
    <>
      <Header />
      <main className="bg-slate-50 min-h-screen">
        {/* Hero banner */}
        <div
          className="relative pt-32 pb-20 overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${resident.gradientFrom}, ${resident.gradientTo})`,
          }}
        >
          {/* Decorative circles */}
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/10 rounded-full pointer-events-none" />
          <div className="absolute -bottom-32 -left-20 w-96 h-96 bg-white/5 rounded-full pointer-events-none" />

          {/* Grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
              backgroundSize: '50px 50px',
            }}
          />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium mb-10 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Назад к резидентам
            </motion.button>

            <div className="flex flex-col lg:flex-row lg:items-end gap-8">
              {/* Icon */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }}
                className="w-24 h-24 bg-white/15 backdrop-blur-sm border border-white/25 rounded-2xl flex items-center justify-center shrink-0"
              >
                <Icon className="w-12 h-12 text-white" />
              </motion.div>

              {/* Text */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number,number,number,number], delay: 0.1 }}
              >
                <span className="inline-block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2 bg-white/10 px-3 py-1 rounded-full">
                  {resident.category}
                </span>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.05] tracking-tight mb-3">
                  {resident.name}
                </h1>
                <p className="text-white/70 text-lg max-w-xl">{resident.description}</p>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-10">
              {/* About */}
              <motion.section
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number,number,number,number], delay: 0.2 }}
                className="bg-white rounded-2xl p-8 border border-slate-100"
              >
                <h2 className="text-2xl font-black text-slate-900 mb-4">О компании</h2>
                <p className="text-slate-600 leading-relaxed">{resident.fullDescription}</p>
              </motion.section>

              {/* Services */}
              <motion.section
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number,number,number,number], delay: 0.3 }}
                className="bg-white rounded-2xl p-8 border border-slate-100"
              >
                <h2 className="text-2xl font-black text-slate-900 mb-6">Услуги и продукция</h2>
                <ul className="space-y-3">
                  {resident.services.map((s) => (
                    <li key={s} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-sky-600 mt-0.5 shrink-0" />
                      <span className="text-slate-700 text-sm leading-relaxed">{s}</span>
                    </li>
                  ))}
                </ul>
              </motion.section>

              {/* Gallery */}
              <motion.section
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number,number,number,number], delay: 0.4 }}
                className="bg-white rounded-2xl p-8 border border-slate-100"
              >
                <h2 className="text-2xl font-black text-slate-900 mb-6">Фото производства</h2>
                <div className="grid grid-cols-3 gap-3">
                  {galleryGradients.map((g, i) => (
                    <div
                      key={i}
                      className={`gallery-item h-32 rounded-xl bg-gradient-to-br ${g} cursor-pointer`}
                    >
                      <div className="gallery-img w-full h-full" />
                    </div>
                  ))}
                </div>
                <p className="text-slate-400 text-xs mt-3 text-center">
                  Фотографии производства — в ближайшее время
                </p>
              </motion.section>

              {/* Advantages */}
              <motion.section
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number,number,number,number], delay: 0.5 }}
                className="bg-white rounded-2xl p-8 border border-slate-100"
              >
                <h2 className="text-2xl font-black text-slate-900 mb-6">Преимущества</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {resident.advantages.map((a, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-4 bg-sky-50 rounded-xl border border-sky-100"
                    >
                      <div className="w-8 h-8 bg-sky-600 rounded-lg flex items-center justify-center shrink-0 text-white font-bold text-sm">
                        {i + 1}
                      </div>
                      <span className="text-slate-700 text-sm font-medium">{a}</span>
                    </div>
                  ))}
                </div>
              </motion.section>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact card */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number,number,number,number], delay: 0.25 }}
                className="bg-white rounded-2xl p-6 border border-slate-100 sticky top-28"
              >
                <h3 className="text-lg font-black text-slate-900 mb-5">Связаться</h3>

                {resident.phone && (
                  <a
                    href={`tel:${resident.phone.replace(/\D/g, '')}`}
                    className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 hover:border-sky-200 hover:bg-sky-50/40 transition-all duration-200 mb-3 group"
                  >
                    <div className="w-9 h-9 bg-sky-100 group-hover:bg-sky-600 rounded-lg flex items-center justify-center transition-colors">
                      <Phone className="w-4 h-4 text-sky-600 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Телефон</div>
                      <div className="text-slate-900 font-semibold text-sm">{resident.phone}</div>
                    </div>
                  </a>
                )}

                {resident.email && (
                  <a
                    href={`mailto:${resident.email}`}
                    className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 hover:border-sky-200 hover:bg-sky-50/40 transition-all duration-200 mb-3 group"
                  >
                    <div className="w-9 h-9 bg-sky-100 group-hover:bg-sky-600 rounded-lg flex items-center justify-center transition-colors">
                      <Mail className="w-4 h-4 text-sky-600 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Email</div>
                      <div className="text-slate-900 font-semibold text-sm">{resident.email}</div>
                    </div>
                  </a>
                )}

                {resident.website && (
                  <a
                    href={resident.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 hover:border-sky-200 hover:bg-sky-50/40 transition-all duration-200 mb-3 group"
                  >
                    <div className="w-9 h-9 bg-sky-100 group-hover:bg-sky-600 rounded-lg flex items-center justify-center transition-colors">
                      <Globe className="w-4 h-4 text-sky-600 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Сайт</div>
                      <div className="text-slate-900 font-semibold text-sm truncate max-w-[160px]">
                        {resident.website}
                      </div>
                    </div>
                  </a>
                )}

                {/* CTA buttons */}
                <div className="mt-6 space-y-3">
                  <a
                    href={resident.phone ? `tel:${resident.phone.replace(/\D/g, '')}` : '#'}
                    className="flex items-center justify-center gap-2 w-full py-3.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-sm transition-all duration-200 hover:shadow-[0_0_20px_rgba(2,132,199,0.28)]"
                  >
                    Связаться
                    <ArrowRight className="w-4 h-4" />
                  </a>
                  <a
                    href={resident.email ? `mailto:${resident.email}?subject=Запрос расчёта` : '#'}
                    className="flex items-center justify-center gap-2 w-full py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold rounded-xl text-sm transition-colors"
                  >
                    Получить расчёт
                  </a>
                </div>
              </motion.div>

              {/* Back to all */}
              <Link
                to="/#residents"
                className="flex items-center justify-center gap-2 w-full py-3 text-slate-500 hover:text-sky-600 font-medium text-sm transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Все резиденты
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}



