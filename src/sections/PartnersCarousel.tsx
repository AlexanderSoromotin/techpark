import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { partners } from '../data/partners';

export default function PartnersCarousel() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: '-80px' });

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = () => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  };

  // Инициализируем состояние прокрутки после монтирования
  useEffect(() => {
    updateScrollState();
    const el = trackRef.current;
    if (!el) return;
    const ro = new ResizeObserver(updateScrollState);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const scroll = (dir: 'left' | 'right') => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === 'left' ? -280 : 280, behavior: 'smooth' });
    setTimeout(updateScrollState, 350);
  };

  return (
    <section
      id="partners"
      ref={sectionRef}
      className="w-full bg-[#F5F7F9] py-20 lg:py-28 relative"
    >
      {/* Subtle diagonal pattern */}
      <div className="absolute inset-0 diagonal-pattern pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <span className="section-badge inline-flex">Партнёры</span>
          <h2 className="text-4xl sm:text-5xl font-black text-[#1F2933] leading-[1.1] tracking-tight mb-4">
            Наши партнёры
          </h2>
          <p className="text-[#6B7C8F] text-base leading-relaxed">
            Технопарк 1219 сотрудничает с ведущими компаниями в области промышленного оборудования и технологий.
          </p>
        </motion.div>

        {/* Arrows row */}
        <div className="flex justify-center gap-2 mb-8">
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            aria-label="Предыдущий партнёр"
            className="w-11 h-11 rounded-lg border border-[#D9E1E8] bg-white flex items-center justify-center text-[#6B7C8F] hover:border-[#2F6FED]/40 hover:text-[#2F6FED] hover:shadow-[0_4px_16px_rgba(47,111,237,0.12)] transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            aria-label="Следующий партнёр"
            className="w-11 h-11 rounded-lg border border-[#D9E1E8] bg-white flex items-center justify-center text-[#6B7C8F] hover:border-[#2F6FED]/40 hover:text-[#2F6FED] hover:shadow-[0_4px_16px_rgba(47,111,237,0.12)] transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Carousel track */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number], delay: 0.15 }}
          className="relative"
        >
          {/* Left fade */}
          <div
            className="absolute left-0 top-0 bottom-0 w-8 z-10 pointer-events-none transition-opacity duration-200"
            style={{
              background: 'linear-gradient(to right, #F5F7F9, transparent)',
              opacity: canScrollLeft ? 1 : 0,
            }}
          />
          {/* Right fade */}
          <div
            className="absolute right-0 top-0 bottom-0 w-8 z-10 pointer-events-none transition-opacity duration-200"
            style={{
              background: 'linear-gradient(to left, #F5F7F9, transparent)',
              opacity: canScrollRight ? 1 : 0,
            }}
          />

          <div
            ref={trackRef}
            onScroll={updateScrollState}
            className="scrollbar-none flex justify-center gap-5 overflow-x-auto pb-2"
          >
            {partners.map((partner) => (
              <a
                key={partner.id}
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex-shrink-0 w-80 bg-white rounded-xl border border-[#D9E1E8] hover:border-[#2F6FED]/40 hover:shadow-[0_8px_30px_rgba(47,111,237,0.10)] transition-all duration-250 p-6 flex flex-col items-center text-center"
              >
                {/* Logo area */}
                <div className="w-full h-28 flex items-center justify-center mb-4 rounded-lg bg-[#F5F7F9] group-hover:bg-[#E6EEF8] transition-colors duration-250 overflow-hidden">
                  {partner.logo ? (
                    <img
                      src={partner.logo}
                      alt={`${partner.name} логотип`}
                      className="max-h-20 max-w-[80%] object-contain"
                    />
                  ) : (
                    <span className="text-3xl font-black tracking-widest text-[#1F2933] group-hover:text-[#2F6FED] transition-colors duration-250 select-none">
                      {partner.name}
                    </span>
                  )}
                </div>

                {/* Partner name */}
                <p className="text-base font-bold text-[#1F2933] mb-3 tracking-tight">{partner.name}</p>

                {/* Info */}
                <p className="text-[#6B7C8F] text-sm leading-relaxed flex-1">{partner.description}</p>

                {/* Link hint */}
                <div className="mt-4 flex items-center gap-1.5 text-[#2F6FED] text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  Перейти на сайт
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}


