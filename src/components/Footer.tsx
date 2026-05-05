import { Link, useNavigate } from 'react-router-dom';
import { Phone, Mail, MapPin, ChevronRight } from 'lucide-react';
import { residents } from '../data/residents';

export default function Footer() {
  const navigate = useNavigate();

  const handleAnchorClick = (e: React.MouseEvent, hash: string) => {
    e.preventDefault();
    const el = document.getElementById(hash);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/', { state: { scrollTo: hash } });
    }
  };

  return (
    <footer className="bg-[#2B2F36] text-white/60 relative overflow-hidden">
      {/* Diagonal accent lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-[15%] w-px h-full bg-gradient-to-b from-[#2F6FED]/10 via-transparent to-transparent rotate-[5deg]" />
        <div className="absolute top-0 right-[25%] w-px h-full bg-gradient-to-b from-[#2F6FED]/8 via-transparent to-transparent -rotate-[8deg]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-5 group">
              <img
                src="/logo.png"
                alt="Логотип Технопарка 1219"
                className="h-8 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
              />
              <div className="leading-tight">
                <span className="text-white font-bold text-base block tracking-tight">Технопарк</span>
                <span className="text-white font-bold text-base block -mt-[5px] tracking-tight">1219</span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed mb-6">
              Промышленный технопарк полного цикла. Производство, технологии и специалисты в одном месте.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#2F6FED] mt-0.5 shrink-0" aria-hidden="true" />
                <span>Троицк, Челябинская область</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#2F6FED] shrink-0" aria-hidden="true" />
                <a href="tel:+79080477030" className="hover:text-white transition-colors">
                  +7 (908) 047-70-30
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#2F6FED] shrink-0" aria-hidden="true" />
                <a href="tel:+79507215681" className="hover:text-white transition-colors">
                  +7 (950) 721-56-81
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#2F6FED] shrink-0" aria-hidden="true" />
                <a href="mailto:info@tp1219.ru" className="hover:text-white transition-colors">
                  info@tp1219.ru
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
                { label: 'Вакансии', hash: 'vacancies' },
                { label: 'Контакты', hash: 'contacts' },
              ].map((l) => (
                <li key={l.hash}>
                  <a
                    href={`/#${l.hash}`}
                    onClick={(e) => handleAnchorClick(e, l.hash)}
                    className="flex items-center gap-1 hover:text-[#2F6FED] transition-colors"
                  >
                    <ChevronRight className="w-3 h-3" aria-hidden="true" />
                    {l.label}
                  </a>
                </li>
              ))}
              <li>
                <Link to="/vacancies" className="flex items-center gap-1 hover:text-[#2F6FED] transition-colors">
                  <ChevronRight className="w-3 h-3" aria-hidden="true" />
                  Все вакансии
                </Link>
              </li>
            </ul>
          </div>

          {/* Residents */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">
              Производства
            </h3>
            <ul className="space-y-2 text-sm">
              {residents.map((r) => (
                <li key={r.id}>
                  <Link
                    to={`/resident/${r.slug}`}
                    className="flex items-center gap-1 hover:text-[#2F6FED] transition-colors"
                  >
                    <ChevronRight className="w-3 h-3" aria-hidden="true" />
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
              Хотите арендовать производственное помещение или стать резидентом? Свяжитесь с нами — ответим в течение рабочего дня.
            </p>
            <a
              href="/#contacts"
              onClick={(e) => handleAnchorClick(e, 'contacts')}
              className="w-full block text-center py-3 bg-[#2F6FED] hover:bg-[#4A7FF0] text-white font-semibold rounded-lg text-sm transition-all duration-200 hover:shadow-[0_4px_20px_rgba(47,111,237,0.3)]"
            >
              Оставить заявку
            </a>
            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-xs">Пн–Пт: 8:00–18:00</p>
              <p className="text-xs mt-1">Сб: 9:00–14:00</p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
          <p>© {new Date().getFullYear()} Технопарк 1219. Все права защищены.</p>
          <p>Троицк, Челябинская область, Россия</p>
          <p className="text-white/40">
            Разработано студией{' '}
            <a
              href="https://datary-dev.ru"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-[#2F6FED] transition-colors"
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
