import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';

const contactInfo = [
  {
    icon: Phone,
    label: 'Телефон',
    value: '+7 (351) 900-12-19',
    href: 'tel:+73519001219',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'info@techpark1219.ru',
    href: 'mailto:info@techpark1219.ru',
  },
  {
    icon: MapPin,
    label: 'Адрес',
    value: 'Троицк, Челябинская область',
    href: undefined,
  },
  {
    icon: Clock,
    label: 'Режим работы',
    value: 'Пн–Пт 8:00–18:00, Сб 9:00–14:00',
    href: undefined,
  },
];

export default function Contacts() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production: send to backend / CRM
    setSent(true);
  };

  return (
    <section id="contacts" ref={ref} className="bg-white py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }}
          >
            <span className="section-badge inline-flex">Контакты</span>
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 leading-[1.1] tracking-tight mb-4">
              Свяжитесь
              <br />
              <span className="text-sky-600">с нами</span>
            </h2>
            <p className="text-slate-500 text-base">
              Оставьте заявку или напишите — мы ответим в течение рабочего дня.
            </p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left: info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number,number,number,number], delay: 0.1 }}
            className="space-y-6"
          >
            {contactInfo.map((c) => {
              const Icon = c.icon;
              return (
                <div
                  key={c.label}
                  className="flex items-start gap-4 p-5 rounded-2xl border border-slate-100 hover:border-sky-200 hover:bg-sky-50/30 transition-all duration-300"
                >
                  <div className="w-11 h-11 bg-sky-100 rounded-xl flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-sky-600" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-0.5">
                      {c.label}
                    </div>
                    {c.href ? (
                      <a
                        href={c.href}
                        className="text-slate-900 font-semibold hover:text-sky-600 transition-colors"
                      >
                        {c.value}
                      </a>
                    ) : (
                      <span className="text-slate-900 font-semibold">{c.value}</span>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Yandex Map */}
            <div className="rounded-2xl overflow-hidden border border-slate-100 h-64">
              <iframe
                src="https://yandex.ru/map-widget/v1/?ll=61.5685%2C54.0836&z=13&pt=61.5685%2C54.0836,pm2rdl&text=%D0%A2%D1%80%D0%BE%D0%B8%D1%86%D0%BA%2C%20%D0%A7%D0%B5%D0%BB%D1%8F%D0%B1%D0%B8%D0%BD%D1%81%D0%BA%D0%B0%D1%8F%20%D0%BE%D0%B1%D0%BB%D0%B0%D1%81%D1%82%D1%8C"
                width="100%"
                height="100%"
                frameBorder="0"
                allowFullScreen
                title="Карта — Троицк, Челябинская область"
                style={{ display: 'block' }}
              />
            </div>
          </motion.div>

          {/* Right: form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number,number,number,number], delay: 0.2 }}
          >
            {sent ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 rounded-2xl bg-green-50 border border-green-100">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Send className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Заявка отправлена!</h3>
                <p className="text-slate-500 text-sm">
                  Мы свяжемся с вами в ближайшее рабочее время.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="space-y-5 p-8 bg-slate-50 rounded-2xl border border-slate-100"
              >
                <h3 className="text-xl font-bold text-slate-900 mb-6">Оставить заявку</h3>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Ваше имя *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Иван Петров"
                    className="form-input w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Телефон *
                  </label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+7 (___) ___-__-__"
                    className="form-input w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Сообщение
                  </label>
                  <textarea
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Расскажите, чем мы можем помочь..."
                    className="form-input w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 text-sm resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-4 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl transition-all duration-200 hover:shadow-[0_0_25px_rgba(2,132,199,0.3)] text-sm"
                >
                  <Send className="w-4 h-4" />
                  Отправить заявку
                </button>

                <p className="text-xs text-slate-400 text-center">
                  Нажимая кнопку, вы соглашаетесь с обработкой персональных данных.
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}



