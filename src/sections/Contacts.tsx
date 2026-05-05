import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';
import { useContactForm } from '../context/useContactForm';
import { submitFeedback } from '../services/feedbackApi';

const contactInfo = [
	{
		icon: Phone,
		label: 'Телефон',
		value: ['+7 (908) 047-70-30', '+7 (950) 721-56-81'],
		href: ['tel:+79080477030', 'tel:+79507215681'],
	},
	{
		icon: Mail,
		label: 'Email',
		value: 'info@tp1219.ru',
		href: 'mailto:info@tp1219.ru',
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

	type Status = 'idle' | 'loading' | 'success' | 'error';
	const [status, setStatus] = useState<Status>('idle');
	const [errorMsg, setErrorMsg] = useState('');
	const [form, setForm] = useState({ name: '', contact: '', message: '' });
	const [errors, setErrors] = useState({ name: '', contact: '', message: '' });
	const { prefillMessage, setPrefillMessage } = useContactForm();

	// Подставляем сообщение из контекста (отклик на вакансию) и сразу сбрасываем
	useEffect(() => {
		if (!prefillMessage) return;
		// Объединяем в один рендер через функциональное обновление
		setForm((f) => ({ ...f, message: prefillMessage }));
		// Откладываем сброс контекста, чтобы не вызывать каскадный рендер
		const id = setTimeout(() => setPrefillMessage(''), 0);
		return () => clearTimeout(id);
	}, [prefillMessage, setPrefillMessage]);

	const validate = () => {
		const e = { name: '', contact: '', message: '' };
		if (!form.name.trim()) e.name = 'Введите ваше имя';
		if (!form.contact.trim()) e.contact = 'Введите телефон или email';
		if (form.message.trim().length < 10) e.message = 'Сообщение должно быть не короче 10 символов';
		setErrors(e);
		return !e.name && !e.contact && !e.message;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!validate()) return;

		setStatus('loading');
		setErrorMsg('');
		try {
			await submitFeedback(form);
			setStatus('success');
			setForm({ name: '', contact: '', message: '' });
		} catch (err: unknown) {
			setStatus('error');
			setErrorMsg(
				err instanceof Error
					? err.message
					: 'Не удалось отправить сообщение. Попробуйте позже.'
			);
		}
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
											Array.isArray(c.href) ? (
												<div className="flex flex-col gap-0.5">
													{(c.href as string[]).map((h, i) => (
														<a
															key={h}
															href={h}
															className="text-[#1F2933] font-semibold hover:text-[#2F6FED] transition-colors"
														>
															{(c.value as string[])[i]}
														</a>
													))}
												</div>
											) : (
											<a
												href={c.href as string}
												className="text-[#1F2933] font-semibold hover:text-[#2F6FED] transition-colors"
											>
												{c.value as string}
											</a>
											)
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
								src="https://yandex.ru/map-widget/v1/?ll=61.602056%2C54.107308&z=15&pt=61.602056%2C54.107308,pm2rdl&text=%D0%A2%D1%80%D0%BE%D0%B8%D1%86%D0%BA%2C%20%D0%A7%D0%B5%D0%BB%D1%8F%D0%B1%D0%B8%D0%BD%D1%81%D0%BA%D0%B0%D1%8F%20%D0%BE%D0%B1%D0%BB%D0%B0%D1%81%D1%82%D1%8C"
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
					{status === 'success' ? (
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
							noValidate
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
									value={form.name}
									onChange={(e) => setForm({ ...form, name: e.target.value })}
									placeholder="Иван Петров"
									className="form-input w-full px-4 py-3 bg-[#F5F7F9] border border-[#D9E1E8] rounded-lg text-[#1F2933] placeholder:text-[#6B7C8F] text-sm"
								/>
								{errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
							</div>

							<div>
								<label className="block text-sm font-semibold text-[#1F2933] mb-1.5">
									Телефон или Email *
								</label>
								<input
									type="text"
									value={form.contact}
									onChange={(e) => setForm({ ...form, contact: e.target.value })}
									placeholder="+7 (___) ___-__-__ или email"
									className="form-input w-full px-4 py-3 bg-[#F5F7F9] border border-[#D9E1E8] rounded-lg text-[#1F2933] placeholder:text-[#6B7C8F] text-sm"
								/>
								{errors.contact && <p className="text-red-500 text-xs mt-1">{errors.contact}</p>}
							</div>

							<div>
								<label className="block text-sm font-semibold text-[#1F2933] mb-1.5">
									Сообщение
								</label>
								<textarea
									rows={4}
									value={form.message}
									onChange={(e) => setForm({ ...form, message: e.target.value })}
									placeholder="Расскажите, чем мы можем помочь..."
									className="form-input w-full px-4 py-3 bg-[#F5F7F9] border border-[#D9E1E8] rounded-lg text-[#1F2933] placeholder:text-[#6B7C8F] text-sm resize-none"
								/>
								{errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
							</div>

							{status === 'error' && (
								<p className="text-red-500 text-sm text-center">{errorMsg}</p>
							)}

							<button
								type="submit"
								disabled={status === 'loading'}
								className="w-full flex items-center justify-center gap-2 py-4 bg-[#2F6FED] hover:bg-[#4A7FF0] disabled:opacity-60 text-white font-bold rounded-lg transition-all duration-200 hover:shadow-[0_8px_25px_rgba(47,111,237,0.3)] text-sm"
							>
								<Send className="w-4 h-4" />
								{status === 'loading' ? 'Отправляем...' : 'Отправить заявку'}
							</button>

							<p className="text-xs text-[#6B7C8F] text-center">
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

