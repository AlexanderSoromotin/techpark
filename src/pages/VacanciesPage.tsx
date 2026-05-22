import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, Clock, DollarSign, ArrowRight, ArrowLeft } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { vacancies } from '../data/vacancies';
import { jobPostingSchema, breadcrumbSchema, toJsonLd, SITE_URL, SITE_NAME } from '../utils/schema';
import { useContactForm } from '../context/useContactForm';

// Извлечь числовое значение зарплаты из строки "от X ₽"
const parseSalary = (s: string): number => {
  const match = s.replace(/\s/g, '').match(/\d+/);
  return match ? parseInt(match[0], 10) : 40000;
};

export default function VacanciesPage() {
  const navigate = useNavigate();
  const { setPrefillMessage } = useContactForm();
  const industriesCount = new Set(vacancies.map((vacancy) => vacancy.residentSlug)).size;

  const handleApply = (position: string, company: string) => {
    setPrefillMessage(`Здравствуйте! Хочу откликнуться на вакансию «${position}» (${company}).`);
    navigate('/', { state: { scrollTo: 'contacts' } });
  };

  return (
    <>
      <Helmet>
        <title>Вакансии в Технопарке 1219 — Работа в Троицке | Производство и инженерные направления</title>
        <meta
          name="description"
          content="Актуальные вакансии в Технопарке 1219, Троицк, Челябинская область. Официальное трудоустройство, конкурентная зарплата, производственные и инженерные направления: металлообработка, гидравлика, вентиляция, 3D-печать, модульное строительство и другие." 
        />
        <link rel="canonical" href={`${SITE_URL}/vacancies`} />
        <meta property="og:title" content={`Вакансии — ${SITE_NAME}`} />
        <meta
          property="og:description"
          content="Работа в Технопарке 1219, Троицк. Официальное трудоустройство в производственных и инженерных направлениях."
        />
        <meta property="og:url" content={`${SITE_URL}/vacancies`} />
        <meta property="og:type" content="website" />
        {/* BreadcrumbList */}
        <script type="application/ld+json">
          {toJsonLd(breadcrumbSchema([
            { name: 'Главная', url: `${SITE_URL}/` },
            { name: 'Вакансии', url: `${SITE_URL}/vacancies` },
          ]))}
        </script>
        {/* JobPosting для каждой вакансии */}
        {vacancies.map((v) => (
          <script key={v.id} type="application/ld+json">
            {toJsonLd(jobPostingSchema({
              title: v.position,
              description: `${v.position} в компании ${v.residentName}, Технопарк 1219, Троицк. ${v.requirements.join('. ')}`,
              salaryMin: parseSalary(v.salary),
            }))}
          </script>
        ))}
      </Helmet>

      <Header />
      <main className="bg-[#F5F7F9] min-h-screen">
        {/* Hero */}
        <div className="bg-[#2B2F36] pt-32 pb-16 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-[20%] w-px h-full bg-gradient-to-b from-transparent via-[#2F6FED]/10 to-transparent rotate-[12deg]" />
            <div className="absolute top-0 right-[20%] w-px h-full bg-gradient-to-b from-transparent via-[#2F6FED]/8 to-transparent -rotate-[10deg]" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumbs */}
            <nav aria-label="Хлебные крошки" className="mb-8">
              <ol className="flex items-center gap-2 text-sm text-white/50">
                <li><Link to="/" className="hover:text-white transition-colors">Главная</Link></li>
                <li className="text-white/30">/</li>
                <li className="text-white/80" aria-current="page">Вакансии</li>
              </ol>
            </nav>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/[0.06] border border-white/12 rounded-lg text-sm text-white/80 font-medium mb-6">
                <Briefcase className="w-4 h-4 text-[#2F6FED]" />
                Работа в Технопарке 1219
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.05] tracking-tight mb-4">
                Вакансии
                <br />
                <span className="bg-gradient-to-r from-[#2F6FED] to-[#4A7FF0] bg-clip-text text-transparent">
                  в Троицке
                </span>
              </h1>
              <p className="text-white/60 text-lg max-w-2xl leading-relaxed">
                Официальное трудоустройство, конкурентная зарплата и профессиональный рост в стабильных производственных компаниях.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Vacancies list */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
            {[
              { value: String(vacancies.length), label: 'Открытых вакансий' },
              { value: String(industriesCount), label: 'Направлений с вакансиями' },
              { value: '100%', label: 'Официальное трудоустройство' },
              { value: 'Троицк', label: 'Челябинская область' },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-xl p-5 border border-[#D9E1E8] text-center">
                <div className="text-2xl font-black text-[#1F2933] mb-1">{s.value}</div>
                <div className="text-[#6B7C8F] text-xs">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {vacancies.map((v, i) => (
              <motion.article
                key={v.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.07 }}
                className="bg-white rounded-xl border border-[#D9E1E8] hover:border-[#2F6FED]/30 hover:shadow-[0_8px_30px_rgba(47,111,237,0.08)] transition-all duration-250 p-6"
              >
                {/* Category */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E6EEF8] rounded-lg text-[#2F6FED] text-xs font-semibold uppercase tracking-wider mb-4">
                  {v.residentCategory}
                </div>

                {/* Position */}
                <h2 className="text-xl font-black text-[#1F2933] mb-1">{v.position}</h2>
                <p className="text-[#6B7C8F] text-sm mb-4">
                  <Link
                    to={`/resident/${v.residentSlug}`}
                    className="text-[#2F6FED] hover:text-[#4A7FF0] font-medium transition-colors"
                  >
                    {v.residentName}
                  </Link>
                  {' '}— Технопарк 1219, Троицк
                </p>

                {/* Info row */}
                <div className="flex flex-wrap gap-3 mb-5">
                  <div className="flex items-center gap-1.5 text-sm text-[#6B7C8F]">
                    <DollarSign className="w-4 h-4 text-[#2F6FED]" aria-hidden="true" />
                    <span className="font-semibold text-[#1F2933]">{v.salary}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-[#6B7C8F]">
                    <Clock className="w-4 h-4 text-[#2F6FED]" aria-hidden="true" />
                    <span>{v.schedule}</span>
                  </div>
                </div>

                {/* Requirements */}
                <ul className="space-y-1.5 mb-6">
                  {v.requirements.map((req) => (
                    <li key={req} className="flex items-start gap-2 text-sm text-[#1F2933]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2F6FED] mt-1.5 shrink-0" aria-hidden="true" />
                      {req}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  onClick={() => handleApply(v.position, v.residentName)}
                  className="flex items-center gap-2 px-5 py-3 bg-[#2F6FED] hover:bg-[#4A7FF0] text-white font-semibold rounded-lg text-sm transition-all duration-200 hover:shadow-[0_8px_25px_rgba(47,111,237,0.3)]"
                >
                  Откликнуться
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.article>
            ))}
          </div>

          {/* Back link */}
          <div className="mt-12 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-[#6B7C8F] hover:text-[#2F6FED] font-medium text-sm transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              На главную
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}


