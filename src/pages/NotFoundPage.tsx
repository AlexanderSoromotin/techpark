import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowRight } from 'lucide-react';
import { SITE_NAME } from '../utils/schema';

export default function NotFoundPage() {
  return (
    <>
      <Helmet>
        <title>Страница не найдена — 404 | {SITE_NAME}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="min-h-screen bg-[#F5F7F9] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-lg"
        >
          <div className="text-[120px] font-black text-[#D9E1E8] leading-none mb-4 select-none">
            404
          </div>
          <h1 className="text-3xl font-black text-[#1F2933] mb-4">Страница не найдена</h1>
          <p className="text-[#6B7C8F] text-base leading-relaxed mb-8">
            Запрашиваемая страница не существует или была удалена. Воспользуйтесь навигацией для перехода к нужному разделу.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-2 px-6 py-3 bg-[#2F6FED] hover:bg-[#4A7FF0] text-white font-semibold rounded-lg transition-all duration-200 hover:shadow-[0_8px_25px_rgba(47,111,237,0.3)] text-sm"
            >
              <Home className="w-4 h-4" />
              На главную
            </Link>
            <Link
              to="/vacancies"
              className="flex items-center gap-2 px-6 py-3 bg-white border border-[#D9E1E8] text-[#1F2933] hover:border-[#2F6FED]/30 font-semibold rounded-lg transition-all duration-200 text-sm"
            >
              Вакансии
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="mt-10 text-sm text-[#6B7C8F]">
            <p>Технопарк 1219 — промышленный технопарк в Троицке, Челябинская область</p>
            <a href="tel:+79080477030" className="text-[#2F6FED] hover:text-[#4A7FF0] transition-colors font-medium">
              +7 (908) 047-70-30
            </a>
          </div>
        </motion.div>
      </div>
    </>
  );
}

