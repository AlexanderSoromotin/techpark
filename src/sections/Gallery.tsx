import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Play } from 'lucide-react';

const galleryItems = [
  {
    id: 1,
    label: 'Производственный цех',
    cat: 'Гидравлика',
    image: 'https://severest.ru/sites/default/files/content/about/nashi-preimuschestva/3.jpg',
    gradient: 'from-sky-700 to-slate-900',
    size: 'lg:col-span-2 lg:row-span-2',
  },
  {
    id: 2,
    label: 'Сварочный участок',
    cat: 'Металлоконструкции',
    image: 'https://truba-sale.ru/upload/iblock/303/cjy17z9m8p11yy4r0vmf0c96t4ek4u18.jpg',
    gradient: 'from-slate-600 to-slate-900',
    size: '',
  },
  {
    id: 3,
    label: '3D-принтеры',
    cat: 'Аддитивные технологии',
    image: 'https://damassets.autodesk.net/content/dam/autodesk/draftr/19187/cropped-1711549292.jpg',
    gradient: 'from-indigo-700 to-slate-900',
    size: '',
  },
  {
    id: 4,
    label: 'Линия фасовки',
    cat: 'Автохимия',
    image: 'https://llc-bs.ru/wp-content/uploads/2020/06/tradeboard4tfGqc_pre.jpg',
    gradient: 'from-cyan-700 to-slate-900',
    size: '',
  },
  {
    id: 5,
    label: 'Карданный стенд',
    cat: 'Карданные валы',
    image: 'https://volgograd.kardanbalans.ru/storage/2023/07/31/7395b46f81854f15db8f12a49f31a1f9580ed22b.jpg',
    gradient: 'from-slate-700 to-slate-900',
    size: '',
  },
  {
    id: 6,
    label: 'Монтаж конструкций',
    cat: 'Контейнерные дома',
    image: 'https://gejzer.ru//wp-content/uploads/2013/12/41481b9c988d40f5d982b1d59e16a8b2.jpg',
    gradient: 'from-teal-700 to-slate-900',
    size: 'lg:col-span-2',
  },
  {
    id: 7,
    label: 'Крепёжное производство',
    cat: 'Крепёж',
    image: 'https://www.rlfasteners.com/wp-content/uploads/2025/06/image.jpeg',
    gradient: 'from-sky-700 to-slate-900',
    size: '',
  },
  {
    id: 8,
    label: 'Пищевой цех',
    cat: 'Мясное производство',
    image: 'https://www.mos.ru/upload/newsfeed/pressevents/NOV_4937.jpg',
    gradient: 'from-blue-700 to-slate-900',
    size: '',
  },
];

export default function Gallery() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="gallery" ref={ref} className="bg-white py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }}
          >
            <span className="section-badge">Галерея</span>
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 leading-[1.1] tracking-tight">
              Жизнь
              <br />
              <span className="text-sky-600">технопарка</span>
            </h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-slate-500 text-sm max-w-xs leading-relaxed"
          >
            Реальные производства, современное оборудование и команды профессионалов.
          </motion.p>
        </div>

        {/* Masonry-style grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 auto-rows-[200px] gap-4">
          {galleryItems.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1] as [number,number,number,number],
                delay: 0.05 + i * 0.07,
              }}
              className={`gallery-item relative rounded-2xl overflow-hidden group cursor-pointer ${item.size}`}
            >
              {/* Video-poster background image */}
              <img
                src={item.image}
                alt={item.label}
                loading="lazy"
                className="gallery-img absolute inset-0 w-full h-full object-cover"
              />

              {/* Fallback cinematic tint */}
              <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-55`} />

              {/* Pattern overlay */}
              <div className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                }}
              />

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

              {/* Play button hint */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                  <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                </div>
              </div>

              {/* Label */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                <div className="text-[10px] text-white/60 font-semibold uppercase tracking-wider mb-0.5">
                  {item.cat}
                </div>
                <div className="text-white font-bold text-sm">{item.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}



