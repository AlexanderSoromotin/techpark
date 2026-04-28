import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Play } from 'lucide-react';

const galleryItems = [
	{
		id: 1,
		label: 'Производственный цех',
		cat: 'Гидравлика',
		image: 'https://severest.ru/sites/default/files/content/about/nashi-preimuschestva/3.jpg',
		gradient: 'from-[#2B2F36] to-[#1F2933]',
		size: 'lg:col-span-2 lg:row-span-2',
	},
	{
		id: 2,
		label: 'Сварочный участок',
		cat: 'Металлоконструкции',
		image: 'https://truba-sale.ru/upload/iblock/303/cjy17z9m8p11yy4r0vmf0c96t4ek4u18.jpg',
		gradient: 'from-[#2B2F36] to-[#6B7C8F]',
		size: '',
	},
	{
		id: 3,
		label: '3D-принтеры',
		cat: 'Аддитивные технологии',
		image: 'https://damassets.autodesk.net/content/dam/autodesk/draftr/19187/cropped-1711549292.jpg',
		gradient: 'from-[#2F6FED] to-[#2B2F36]',
		size: '',
	},
	{
		id: 4,
		label: 'Линия фасовки',
		cat: 'Автохимия',
		image: 'https://llc-bs.ru/wp-content/uploads/2020/06/tradeboard4tfGqc_pre.jpg',
		gradient: 'from-[#4A7FF0] to-[#2B2F36]',
		size: '',
	},
	{
		id: 5,
		label: 'Карданный стенд',
		cat: 'Карданные валы',
		image: 'https://volgograd.kardanbalans.ru/storage/2023/07/31/7395b46f81854f15db8f12a49f31a1f9580ed22b.jpg',
		gradient: 'from-[#6B7C8F] to-[#2B2F36]',
		size: '',
	},
	{
		id: 6,
		label: 'Монтаж конструкций',
		cat: 'Контейнерные дома',
		image: 'https://gejzer.ru//wp-content/uploads/2013/12/41481b9c988d40f5d982b1d59e16a8b2.jpg',
		gradient: 'from-[#2F6FED] to-[#6B7C8F]',
		size: 'lg:col-span-2',
	},
	{
		id: 7,
		label: 'Крепёжное производство',
		cat: 'Крепёж',
		image: 'https://www.rlfasteners.com/wp-content/uploads/2025/06/image.jpeg',
		gradient: 'from-[#2B2F36] to-[#4A7FF0]',
		size: '',
	},
	// {
	// 	id: 8,
	// 	label: 'Пищевой цех',
	// 	cat: 'Мясное производство',
	// 	image: 'https://www.mos.ru/upload/newsfeed/pressevents/NOV_4937.jpg',
	// 	gradient: 'from-[#1F2933] to-[#2F6FED]',
	// 	size: '',
	// },
];

export default function Gallery() {
	const ref = useRef<HTMLElement>(null);
	const inView = useInView(ref, { once: true, margin: '-80px' });

	return (
		<section id="gallery" ref={ref} className="bg-[#F5F7F9] py-24 lg:py-32 relative">
			<div className="absolute inset-0 diagonal-pattern pointer-events-none" />

			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
					<motion.div
						initial={{ opacity: 0, y: 25 }}
						animate={inView ? { opacity: 1, y: 0 } : {}}
						transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
					>
						<span className="section-badge">Галерея</span>
						<h2 className="text-4xl sm:text-5xl font-black text-[#1F2933] leading-[1.1] tracking-tight">
							Жизнь
							<br />
							<span className="bg-gradient-to-r from-[#2F6FED] to-[#4A7FF0] bg-clip-text text-transparent">
								технопарка
							</span>
						</h2>
					</motion.div>
					<motion.p
						initial={{ opacity: 0 }}
						animate={inView ? { opacity: 1 } : {}}
						transition={{ duration: 0.7, delay: 0.2 }}
						className="text-[#6B7C8F] text-sm max-w-xs leading-relaxed"
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
								ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
								delay: 0.05 + i * 0.07,
							}}
							className={`gallery-item relative rounded-xl overflow-hidden group cursor-pointer ${item.size}`}
						>
							{/* Background image */}
							<img
								src={item.image}
								alt={item.label}
								loading="lazy"
								className="gallery-img absolute inset-0 w-full h-full object-cover"
							/>

							{/* Industrial gradient tint */}
							<div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-50`} />

							{/* Diagonal accent */}
							<div
								className="absolute top-0 right-0 w-16 h-16 opacity-25"
								style={{
									background: 'linear-gradient(135deg, transparent 50%, rgba(47,111,237,0.5) 50%)',
								}}
							/>

							{/* Pattern overlay */}
							<div
								className="absolute inset-0 opacity-5"
								style={{
									backgroundImage:
										'repeating-linear-gradient(135deg, transparent, transparent 20px, rgba(255,255,255,0.3) 20px, rgba(255,255,255,0.3) 21px)',
								}}
							/>

							{/* Hover overlay */}
							<div className="absolute inset-0 bg-[#2B2F36]/0 group-hover:bg-[#2B2F36]/30 transition-colors duration-250" />

							{/* Play button hint */}
							<div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-250">
								<div className="w-12 h-12 bg-white/15 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/25">
									<Play className="w-5 h-5 text-white fill-white ml-0.5" />
								</div>
							</div>

							{/* Label */}
							<div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#1F2933]/80 to-transparent translate-y-1 group-hover:translate-y-0 transition-transform duration-250">
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

