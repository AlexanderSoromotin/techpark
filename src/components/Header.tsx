import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || !isHome
          ? 'bg-[#2B2F36]/95 backdrop-blur-xl border-b border-white/10 shadow-[0_2px_20px_rgba(0,0,0,0.15)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/logo.png"
              alt="Логотип Технопарка 1219"
              className="h-9 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
            />
            <div className="leading-tight">
              <span className="text-white font-bold text-base block tracking-tight">Технопарк</span>
              <span className="text-white font-bold text-base block -mt-[5px] tracking-tight">1219</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((l) => (
              <button
                key={l.hash}
                onClick={() => scrollTo(l.hash)}
                className="text-white/70 hover:text-white transition-colors duration-200 text-sm font-medium relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-[#2F6FED] after:transition-all after:duration-200 hover:after:w-full"
              >
                {l.label}
              </button>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:block">
            <button
              onClick={() => scrollTo('contacts')}
              className="px-5 py-2.5 bg-[#2F6FED] hover:bg-[#4A7FF0] text-white text-sm font-semibold rounded-lg transition-all duration-200 hover:shadow-[0_4px_20px_rgba(47,111,237,0.35)]"
            >
              Стать резидентом
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Меню"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#2B2F36] border-t border-white/10 px-4 py-6 space-y-1">
          {navLinks.map((l) => (
            <button
              key={l.hash}
              onClick={() => scrollTo(l.hash)}
              className="w-full text-left text-white/80 hover:text-white font-medium py-3 px-3 rounded-lg hover:bg-white/5 transition-all duration-200 text-sm"
            >
              {l.label}
            </button>
          ))}
          <div className="pt-3">
            <button
              onClick={() => scrollTo('contacts')}
              className="w-full py-3 bg-[#2F6FED] hover:bg-[#4A7FF0] text-white font-semibold rounded-lg transition-all duration-200 text-sm"
            >
              Стать резидентом
            </button>
          </div>
        </div>
      )}
    </header>
  );
}



