import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Factory } from 'lucide-react';

const navLinks = [
  { label: 'О технопарке', hash: 'about' },
  { label: 'Резиденты', hash: 'residents' },
  { label: 'Галерея', hash: 'gallery' },
  { label: 'Для кого', hash: 'for-whom' },
  { label: 'Контакты', hash: 'contacts' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (hash: string) => {
    setMobileOpen(false);
    if (!isHome) {
      navigate('/', { state: { scrollTo: hash } });
      return;
    }
    document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled || !isHome
          ? 'bg-slate-950/95 backdrop-blur-md shadow-[0_2px_20px_rgba(0,0,0,0.3)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-sky-600 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:bg-sky-500 group-hover:scale-105">
              <Factory className="w-5 h-5 text-white" />
            </div>
            <div className="leading-tight">
              <span className="text-white font-bold text-lg block">Технопарк</span>
              <span className="text-sky-500 font-black text-lg block -mt-1">1219</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((l) => (
              <button
                key={l.hash}
                onClick={() => scrollTo(l.hash)}
                className="text-slate-300 hover:text-sky-500 transition-colors duration-200 text-sm font-medium"
              >
                {l.label}
              </button>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:block">
            <button
              onClick={() => scrollTo('contacts')}
              className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white text-sm font-semibold rounded-xl transition-all duration-200 hover:shadow-[0_0_20px_rgba(2,132,199,0.35)]"
            >
              Стать резидентом
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Меню"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-slate-950 border-t border-slate-800 px-4 py-6 space-y-1">
          {navLinks.map((l) => (
            <button
              key={l.hash}
              onClick={() => scrollTo(l.hash)}
              className="w-full text-left text-slate-300 hover:text-sky-500 font-medium py-3 px-3 rounded-lg hover:bg-white/5 transition-all duration-200 text-sm"
            >
              {l.label}
            </button>
          ))}
          <div className="pt-3">
            <button
              onClick={() => scrollTo('contacts')}
              className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-xl transition-colors text-sm"
            >
              Стать резидентом
            </button>
          </div>
        </div>
      )}
    </header>
  );
}



