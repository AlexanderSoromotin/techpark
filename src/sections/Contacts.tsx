import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';
import { useContactForm } from '../context/useContactForm';

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
	const { prefillMessage, setPrefillMessage } = useContactForm();

	// Подставляем сообщение из контекста (отклик на вакансию)
	useEffect(() => {
		if (prefillMessage) {
			setForm((f) => ({ ...f, message: prefillMessage }));
			setPrefillMessage('');
		}
	}, [prefillMessage, setPrefillMessage]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// In production: send to backend / CRM
		setSent(true);
	};

	return (
		<section
			id="contacts"
			ref={ref}
			className="bg-[#F5F7F9] py-24 lg:py-32 relative"
		>
			<div className="absolute inset-0 diagonal-pattern pointer-events-none" />

			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="text-center max-w-xl mx-auto mb-16">
					<motion.div
						initial={{ opacity: 0, y: 25 }}
						animate={inView ? { opacity: 1, y: 0 } : {}}
						transition={{
							duration: 0.7,
							ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
						}}
					>
						<span className="section-badge inline-flex">Контакты</span>
						<h2 className="text-4xl sm:text-5xl font-black text-[#1F2933] leading-[1.1] tracking-tight mb-4">
							Свяжитесь
							<br />
							<span className="bg-gradient-to-r from-[#2F6FED] to-[#4A7FF0] bg-clip-text text-transparent">
								с нами
							</span>
						</h2>
						<p className="text-[#6B7C8F] text-base">
							Оставьте заявку или напишите — мы ответим в течение рабочего дня.
						</p>
					</motion.div>
				</div>

				<div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
					{/* Left: info */}
					<motion.div
						initial={{ opacity: 0, x: -40 }}
						animate={inView ? { opacity: 1, x: 0 } : {}}
						transition={{
							duration: 0.8,
							ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
							delay: 0.1,
						}}
						className="space-y-5"
					>
						{contactInfo.map((c) => {
							const Icon = c.icon;
							return (
								<div
									key={c.label}
									className="flex items-start gap-4 p-5 rounded-xl bg-white border border-[#D9E1E8] hover:border-[#2F6FED]/30 hover:shadow-[0_4px_20px_rgba(47,111,237,0.06)] transition-all duration-250"
								>
									<div className="w-11 h-11 bg-[#E6EEF8] rounded-lg flex items-center justify-center shrink-0">
										<Icon className="w-5 h-5 text-[#2F6FED]" />
									</div>
									<div>
										<div className="text-xs text-[#6B7C8F] font-semibold uppercase tracking-wider mb-0.5">
											{c.label}
										</div>
										{c.href ? (
											<a
												href={c.href}
												className="text-[#1F2933] font-semibold hover:text-[#2F6FED] transition-colors"
											>
												{c.value}
											</a>
										) : (
											<span className="text-[#1F2933] font-semibold">
												{c.value}
											</span>
										)}
									</div>
								</div>
							);
						})}

						{/* Yandex Map */}
						<div className="rounded-xl overflow-hidden border border-[#D9E1E8] h-64">
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
						transition={{
							duration: 0.8,
							ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
							delay: 0.2,
						}}
					>
						{sent ? (
							<div className="h-full flex flex-col items-center justify-center text-center p-12 rounded-xl bg-[#E6EEF8] border border-[#2F6FED]/20">
								<div className="w-16 h-16 bg-[#2F6FED]/15 rounded-xl flex items-center justify-center mb-4">
									<Send className="w-8 h-8 text-[#2F6FED]" />
								</div>
								<h3 className="text-xl font-bold text-[#1F2933] mb-2">
									Заявка отправлена!
								</h3>
								<p className="text-[#6B7C8F] text-sm">
									Мы свяжемся с вами в ближайшее рабочее время.
								</p>
							</div>
						) : (
							<form
								onSubmit={handleSubmit}
								className="space-y-5 p-8 bg-white rounded-xl border border-[#D9E1E8]"
							>
								<h3 className="text-xl font-bold text-[#1F2933] mb-6">
									Оставить заявку
								</h3>

								<div>
									<label className="block text-sm font-semibold text-[#1F2933] mb-1.5">
										Ваше имя *
									</label>
									<input
										type="text"
										required
										value={form.name}
										onChange={(e) =>
											setForm({ ...form, name: e.target.value })
										}
										placeholder="Иван Петров"
										className="form-input w-full px-4 py-3 bg-[#F5F7F9] border border-[#D9E1E8] rounded-lg text-[#1F2933] placeholder:text-[#6B7C8F] text-sm"
									/>
								</div>

								<div>
									<label className="block text-sm font-semibold text-[#1F2933] mb-1.5">
										Телефон *
									</label>
									<input
										type="tel"
										required
										value={form.phone}
										onChange={(e) =>
											setForm({ ...form, phone: e.target.value })
										}
										placeholder="+7 (___) ___-__-__"
										className="form-input w-full px-4 py-3 bg-[#F5F7F9] border border-[#D9E1E8] rounded-lg text-[#1F2933] placeholder:text-[#6B7C8F] text-sm"
									/>
								</div>

								<div>
									<label className="block text-sm font-semibold text-[#1F2933] mb-1.5">
										Сообщение
									</label>
									<textarea
										rows={4}
										value={form.message}
										onChange={(e) =>
											setForm({ ...form, message: e.target.value })
										}
										placeholder="Расскажите, чем мы можем помочь..."
										className="form-input w-full px-4 py-3 bg-[#F5F7F9] border border-[#D9E1E8] rounded-lg text-[#1F2933] placeholder:text-[#6B7C8F] text-sm resize-none"
									/>
								</div>

								<button
									type="submit"
									className="w-full flex items-center justify-center gap-2 py-4 bg-[#2F6FED] hover:bg-[#4A7FF0] text-white font-bold rounded-lg transition-all duration-200 hover:shadow-[0_8px_25px_rgba(47,111,237,0.3)] text-sm"
								>
									<Send className="w-4 h-4" />
									Отправить заявку
								</button>

								<p className="text-xs text-[#6B7C8F] text-center">
									Нажимая кнопку, вы соглашаетесь с обработкой персональных
									данных.
								</p>
							</form>
						)}
					</motion.div>
				</div>
			</div>
		</section>
	);
}

