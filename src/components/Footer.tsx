import { Link } from 'react-router-dom';
import { Factory, Phone, Mail, MapPin, ChevronRight } from 'lucide-react';
import { residents } from '../data/residents';

export default function Footer() {
  const scrollTo = (hash: string) => {
    document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-sky-600 rounded-xl flex items-center justify-center">
                <Factory className="w-5 h-5 text-white" />
              </div>
              <div className="leading-tight">
                <span className="text-white font-bold text-base block">Технопарк</span>
                <span className="text-sky-500 font-black text-base block -mt-0.5">1219</span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed mb-6">
              Промышленный технопарк полного цикла. Производство, технологии и специалисты в одном месте.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-sky-600 mt-0.5 shrink-0" />
                <span>Троицк, Челябинская область</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-sky-600 shrink-0" />
                <a href="tel:+73519001219" className="hover:text-white transition-colors">
                  +7 (351) 900-12-19
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-sky-600 shrink-0" />
                <a href="mailto:info@techpark1219.ru" className="hover:text-white transition-colors">
                  info@techpark1219.ru
                </a>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">
              Навигация
            </h3>
            <ul className="space-y-2 text-sm">
              {[
                { label: 'О технопарке', hash: 'about' },
                { label: 'Резиденты', hash: 'residents' },
                { label: 'Галерея', hash: 'gallery' },
                { label: 'Для кого', hash: 'for-whom' },
                { label: 'Контакты', hash: 'contacts' },
              ].map((l) => (
                <li key={l.hash}>
                  <button
                    onClick={() => scrollTo(l.hash)}
                    className="flex items-center gap-1 hover:text-sky-500 transition-colors"
                  >
                    <ChevronRight className="w-3 h-3" />
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Residents */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">
              Резиденты
            </h3>
            <ul className="space-y-2 text-sm">
              {residents.map((r) => (
                <li key={r.id}>
                  <Link
                    to={`/resident/${r.slug}`}
                    className="flex items-center gap-1 hover:text-sky-500 transition-colors"
                  >
                    <ChevronRight className="w-3 h-3" />
                    {r.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA column */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">
              Сотрудничество
            </h3>
            <p className="text-sm mb-6 leading-relaxed">
              Хотите стать резидентом или разместить производство? Свяжитесь с нами.
            </p>
            <button
              onClick={() => scrollTo('contacts')}
              className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-xl text-sm transition-all duration-200 hover:shadow-[0_0_20px_rgba(2,132,199,0.28)]"
            >
              Оставить заявку
            </button>
            <div className="mt-8 pt-6 border-t border-slate-800">
              <p className="text-xs">Пн–Пт: 8:00–18:00</p>
              <p className="text-xs mt-1">Сб: 9:00–14:00</p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
          <p>© {new Date().getFullYear()} Технопарк 1219. Все права защищены.</p>
          <p>Троицк, Челябинская область, Россия</p>
          <p className="text-slate-500">
            Разработано студией{' '}
            <a
              href="https://datary-dev.ru"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-300 hover:text-sky-400 transition-colors"
              style={{ fontFamily: "'Space Grotesk', 'Manrope', sans-serif", fontWeight: 500 }}
            >
              Datary
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}



