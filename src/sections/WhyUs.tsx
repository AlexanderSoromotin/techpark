import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Zap, ShieldCheck, Handshake, TruckIcon, Clock, Users } from 'lucide-react';

const benefits = [
	{
		icon: Clock,
		title: 'Быстрый запуск производства',
		desc: 'Готовые площади с коммуникациями — начните производить уже через несколько дней после подписания договора.',
	},
	{
		icon: ShieldCheck,
		title: 'Надёжная инфраструктура',
		desc: 'Электроснабжение, газ, вода, интернет, охрана и видеонаблюдение 24/7 включены в стоимость.',
	},
	{
		icon: Handshake,
		title: 'Поддержка на каждом шагу',
		desc: 'Помогаем с документами, сертификацией, бухгалтерией и юридическими вопросами — вы не один.',
	},
	{
		icon: TruckIcon,
		title: 'Выгодная логистика',
		desc: 'Удобные подъездные пути для грузового транспорта, собственные погрузочные зоны и склады.',
	},
	{
		icon: Zap,
		title: 'Синергия резидентов',
		desc: 'Соседи-производители — ваши потенциальные партнёры. Находите клиентов и поставщиков внутри технопарка.',
	},
	{
		icon: Users,
		title: 'Квалифицированные кадры',
		desc: 'Содействие в подборе персонала благодаря общей HR-сети технопарка и связям с учебными заведениями.',
	},
];

export default function WhyUs() {
	const ref = useRef<HTMLElement>(null);
	const inView = useInView(ref, { once: true, margin: '-80px' });

	return (
		<section
			id="why-us"
			ref={ref}
			className="bg-[#2B2F36] py-24 lg:py-32 relative overflow-hidden"
		>
			{/* Diagonal pattern overlay */}
			<div className="absolute inset-0 pointer-events-none">
				<div className="absolute top-0 left-[10%] w-px h-full bg-gradient-to-b from-transparent via-[#2F6FED]/8 to-transparent rotate-[8deg]" />
				<div className="absolute top-0 right-[15%] w-px h-full bg-gradient-to-b from-transparent via-[#2F6FED]/6 to-transparent -rotate-[10deg]" />
				<div className="absolute top-0 right-[40%] w-px h-full bg-gradient-to-b from-transparent via-[#2F6FED]/4 to-transparent rotate-[5deg]" />
			</div>

			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="text-center max-w-2xl mx-auto mb-16">
					<motion.div
						initial={{ opacity: 0, y: 25 }}
						animate={inView ? { opacity: 1, y: 0 } : {}}
						transition={{
							duration: 0.7,
							ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
						}}
					>
						<span className="section-badge inline-flex !bg-[#2F6FED]/15 !border-[#2F6FED]/25 !text-[#4A7FF0]">
							Преимущества
						</span>
						<h2 className="text-4xl sm:text-5xl font-black text-white leading-[1.1] tracking-tight mb-4">
							Почему выбирают
							<br />
							<span className="bg-gradient-to-r from-[#2F6FED] to-[#4A7FF0] bg-clip-text text-transparent">
								Технопарк 1219
							</span>
						</h2>
						<p className="text-white/50 text-base leading-relaxed">
							Всё, что нужно успешному производству, — уже здесь.
						</p>
					</motion.div>
				</div>

				{/* Grid */}
				<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
					{benefits.map((b, i) => {
						const Icon = b.icon;
						return (
							<motion.div
								key={b.title}
								initial={{ opacity: 0, y: 30 }}
								animate={inView ? { opacity: 1, y: 0 } : {}}
								transition={{
									duration: 0.6,
									ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
									delay: 0.1 + i * 0.09,
								}}
								className="group p-7 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06] hover:border-[#2F6FED]/30 transition-all duration-250"
							>
								<div className="w-12 h-12 bg-[#2F6FED]/15 group-hover:bg-[#2F6FED] rounded-lg flex items-center justify-center mb-5 transition-all duration-250">
									<Icon className="w-6 h-6 text-[#4A7FF0] group-hover:text-white transition-colors duration-250" />
								</div>
								<h3 className="text-white font-bold text-base mb-3">
									{b.title}
								</h3>
								<p className="text-white/50 text-sm leading-relaxed">
									{b.desc}
								</p>
							</motion.div>
						);
					})}
				</div>
			</div>
		</section>
	);
}

