import { useEffect, useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Phone,
  Mail,
  Globe,
  ArrowRight,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { getResidentBySlug } from '../data/residents';
import {
  getResidentPortalContent,
  type ArticleContentBlock,
  type ResidentCatalogItem,
  type ResidentKnowledgeArticle,
  type ResidentNewsItem,
  type ResidentPortalContent,
  type ResidentServiceItem,
} from '../data/residentPortalContent';
import Header from '../components/Header';
import Footer from '../components/Footer';

type SelectedItemState =
  | { kind: 'product'; item: ResidentCatalogItem }
  | { kind: 'service'; item: ResidentServiceItem };

const EMPTY_PORTAL_CONTENT: ResidentPortalContent = {
  residentSlug: 'unknown',
  intro: '',
  productCategories: [],
  products: [],
  services: [],
  news: [],
  knowledgeBase: [],
  gallery: [],
};

export default function ResidentPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const resident = getResidentBySlug(slug ?? '');
  const portal = useMemo(
    () => (resident ? getResidentPortalContent(resident) : EMPTY_PORTAL_CONTENT),
    [resident],
  );
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<SelectedItemState | null>(null);
  const [selectedItemPhotoIndex, setSelectedItemPhotoIndex] = useState(0);
  const [openArticleId, setOpenArticleId] = useState<string | null>(null);
  const [openNewsId, setOpenNewsId] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openArticle: ResidentKnowledgeArticle | null = useMemo(
    () => portal.knowledgeBase.find((a) => a.id === openArticleId) ?? null,
    [portal.knowledgeBase, openArticleId],
  );

  const openNews: ResidentNewsItem | null = useMemo(
    () => portal.news.find((n) => n.id === openNewsId) ?? null,
    [portal.news, openNewsId],
  );

  const openNewsBlocks: ArticleContentBlock[] = useMemo(() => {
    if (!openNews) return [];
    if (openNews.contentBlocks) return openNews.contentBlocks;
    return [{ type: 'text' as const, text: openNews.excerpt }];
  }, [openNews]);

  const openArticleBlocks: ArticleContentBlock[] = useMemo(() => {
    if (!openArticle) return [];
    if (openArticle.contentBlocks) return openArticle.contentBlocks;
    return [
      { type: 'text' as const, text: openArticle.content },
    ];
  }, [openArticle]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (openArticleId) {
          setOpenArticleId(null);
          return;
        }
        if (openNewsId) {
          setOpenNewsId(null);
          return;
        }
        setSelectedItem(null);
        setLightboxIndex(null);
      }

      if (lightboxIndex !== null) {
        if (event.key === 'ArrowRight') {
          setLightboxIndex((prev) => {
            if (prev === null) {
              return 0;
            }
            return (prev + 1) % portal.gallery.length;
          });
        }
        if (event.key === 'ArrowLeft') {
          setLightboxIndex((prev) => {
            if (prev === null) {
              return 0;
            }
            return (prev - 1 + portal.gallery.length) % portal.gallery.length;
          });
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightboxIndex, portal.gallery.length, openArticleId, openNewsId]);

  const visibleProducts = useMemo(() => {
    if (!activeCategoryId) {
      return portal.products;
    }
    return portal.products.filter((item) => item.categoryId === activeCategoryId);
  }, [activeCategoryId, portal.products]);

  const articleById = useMemo(
    () => Object.fromEntries(portal.knowledgeBase.map((article) => [article.id, article])),
    [portal.knowledgeBase],
  );

  const allItems = useMemo(
    () => [
      ...portal.products.map((item) => ({ id: item.id, title: item.title })),
      ...portal.services.map((item) => ({ id: item.id, title: item.title })),
    ],
    [portal.products, portal.services],
  );

  const openArticleRelatedItems = useMemo(
    () =>
      openArticle
        ? openArticle.relatedItemIds
            .map((id) => allItems.find((entry) => entry.id === id))
            .filter(Boolean)
        : [],
    [openArticle, allItems],
  );

  const selectedItemRelatedArticles =
    selectedItem?.item.relatedArticleIds
      .map((id) => articleById[id])
      .filter((article): article is ResidentKnowledgeArticle => Boolean(article)) ?? [];

  const openProduct = (item: ResidentCatalogItem) => {
    setSelectedItem({ kind: 'product', item });
    setSelectedItemPhotoIndex(0);
  };

  const openService = (item: ResidentServiceItem) => {
    setSelectedItem({ kind: 'service', item });
    setSelectedItemPhotoIndex(0);
  };

  const prevGallerySlide = () => {
    setLightboxIndex((prev) => {
      if (prev === null) {
        return null;
      }
      return (prev - 1 + portal.gallery.length) % portal.gallery.length;
    });
  };

  const nextGallerySlide = () => {
    setLightboxIndex((prev) => {
      if (prev === null) {
        return null;
      }
      return (prev + 1) % portal.gallery.length;
    });
  };

  if (!resident) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-600">
        <p className="text-2xl font-bold mb-4">Резидент не найден</p>
        <Link to="/" className="text-sky-600 hover:underline font-medium">← На главную</Link>
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="bg-slate-50 min-h-screen">
        <div
          className="relative pt-32 pb-20 overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${resident.gradientFrom}, ${resident.gradientTo})`,
          }}
        >
          <img
            src={resident.image}
            alt={resident.imageAlt}
            className="absolute inset-0 w-full h-full object-cover opacity-28"
          />
          <div className="absolute inset-0 bg-slate-900/30" />

          <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/10 rounded-full pointer-events-none" />
          <div className="absolute -bottom-32 -left-20 w-96 h-96 bg-white/5 rounded-full pointer-events-none" />

          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
              backgroundSize: '50px 50px',
            }}
          />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium mb-10 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Назад к резидентам
            </motion.button>

            <div className="flex flex-col lg:flex-row lg:items-end gap-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                className="w-28 h-28 bg-white/15 backdrop-blur-sm border border-white/25 rounded-2xl p-1.5 shrink-0"
              >
                <img
                  src={resident.image}
                  alt={resident.imageAlt}
                  className="w-full h-full object-cover rounded-xl"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number], delay: 0.1 }}
              >
                <span className="inline-block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2 bg-white/10 px-3 py-1 rounded-full">
                  {resident.category}
                </span>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.05] tracking-tight mb-3">
                  {resident.name}
                </h1>
                <p className="text-white/70 text-lg max-w-xl">{resident.description}</p>
                <p className="text-white/70 text-sm mt-4 max-w-2xl leading-relaxed">{portal.intro}</p>

                <div className="flex flex-wrap gap-2 mt-6">
                  {portal.products.length > 0 && (
                    <a href="#resident-products" className="px-4 py-2 rounded-lg bg-white/12 hover:bg-white/20 text-white text-xs font-semibold uppercase tracking-wider transition-colors">
                      Товары
                    </a>
                  )}
                  {portal.services.length > 0 && (
                    <a href="#resident-services" className="px-4 py-2 rounded-lg bg-white/12 hover:bg-white/20 text-white text-xs font-semibold uppercase tracking-wider transition-colors">
                      Услуги
                    </a>
                  )}
                  <a href="#resident-news" className="px-4 py-2 rounded-lg bg-white/12 hover:bg-white/20 text-white text-xs font-semibold uppercase tracking-wider transition-colors">
                    Новости
                  </a>
                  <a href="#resident-knowledge" className="px-4 py-2 rounded-lg bg-white/12 hover:bg-white/20 text-white text-xs font-semibold uppercase tracking-wider transition-colors">
                    База знаний
                  </a>
                  <a href="#resident-gallery" className="px-4 py-2 rounded-lg bg-white/12 hover:bg-white/20 text-white text-xs font-semibold uppercase tracking-wider transition-colors">
                    Фото
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-10">
              <motion.section
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number], delay: 0.2 }}
                className="bg-white rounded-2xl p-8 border border-slate-100"
              >
                <h2 className="text-2xl font-black text-slate-900 mb-4">О компании</h2>
                <p className="text-slate-600 leading-relaxed">{resident.fullDescription}</p>
              </motion.section>

              {portal.products.length > 0 && (
                <motion.section
                  id="resident-products"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number], delay: 0.3 }}
                  className="bg-white rounded-2xl p-8 border border-slate-100 scroll-mt-24"
                >
                  <div className="mb-6">
                    <h2 className="text-2xl font-black text-slate-900">Товары</h2>
                    {/*<p className="text-slate-500 text-sm mt-1">Карточки с фото, характеристиками и связанными статьями.</p>*/}
                  </div>

                  {portal.productCategories.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-5">
                      <button
                        type="button"
                        onClick={() => setActiveCategoryId(null)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wide transition-colors ${
                          activeCategoryId === null
                            ? 'bg-sky-600 text-white'
                            : 'bg-sky-50 text-sky-700 hover:bg-sky-100'
                        }`}
                      >
                        Все
                      </button>
                      {portal.productCategories.map((category) => (
                        <button
                          key={category.id}
                          type="button"
                          onClick={() => setActiveCategoryId(category.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wide transition-colors ${
                            activeCategoryId === category.id
                              ? 'bg-sky-600 text-white'
                              : 'bg-sky-50 text-sky-700 hover:bg-sky-100'
                          }`}
                        >
                          {category.title}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="grid sm:grid-cols-2 gap-4">
                    {visibleProducts.map((item) => (
                      <article
                        key={item.id}
                        className="group rounded-2xl border border-slate-100 overflow-hidden bg-white shadow-sm hover:shadow-md hover:border-sky-200 transition-all duration-200 cursor-pointer"
                        onClick={() => openProduct(item)}
                      >
                        <div className="h-36 overflow-hidden">
                          <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                        </div>
                        <div className="p-4">
                          <h3 className="text-base font-bold text-slate-900 mb-1">{item.title}</h3>
                          <p className="text-slate-500 text-sm leading-relaxed mb-3">{item.shortDescription}</p>
                          <span className="text-sky-600 group-hover:text-sky-700 text-sm font-semibold inline-flex items-center gap-1 transition-colors">
                            Подробнее
                            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                          </span>
                        </div>
                      </article>
                    ))}
                  </div>
                </motion.section>
              )}

              {portal.services.length > 0 && (
                <motion.section
                  id="resident-services"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number], delay: 0.35 }}
                  className="bg-white rounded-2xl p-8 border border-slate-100 scroll-mt-24"
                >
                  <div className="mb-6">
                    <h2 className="text-2xl font-black text-slate-900">Услуги</h2>
                    {/*<p className="text-slate-500 text-sm mt-1">Карточки с фото, характеристиками и связанными статьями.</p>*/}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {portal.services.map((item) => (
                      <article
                        key={item.id}
                        className="group rounded-2xl border border-slate-100 overflow-hidden bg-white shadow-sm hover:shadow-md hover:border-sky-200 transition-all duration-200 cursor-pointer"
                        onClick={() => openService(item)}
                      >
                        <div className="h-36 overflow-hidden">
                          <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                        </div>
                        <div className="p-4">
                          <h3 className="text-base font-bold text-slate-900 mb-1">{item.title}</h3>
                          <p className="text-slate-500 text-sm leading-relaxed mb-3">{item.shortDescription}</p>
                          <span className="text-sky-600 group-hover:text-sky-700 text-sm font-semibold inline-flex items-center gap-1 transition-colors">
                            Подробнее
                            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                          </span>
                        </div>
                      </article>
                    ))}
                  </div>
                </motion.section>
              )}

              <motion.section
                id="resident-news"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number], delay: 0.4 }}
                className="bg-white rounded-2xl p-8 border border-slate-100 scroll-mt-24"
              >
                <h2 className="text-2xl font-black text-slate-900 mb-6">Лента новостей</h2>
                <div className="space-y-4">
                  {portal.news.map((entry) => (
                    <article
                      key={entry.id}
                      className="group rounded-2xl border border-slate-100 hover:border-sky-200 p-4 sm:p-5 grid sm:grid-cols-[160px_1fr] gap-4 cursor-pointer transition-all duration-200 hover:shadow-md"
                      onClick={() => setOpenNewsId(entry.id)}
                    >
                      <div className="overflow-hidden rounded-xl">
                        <img src={entry.image} alt={entry.title} className="w-full h-28 sm:h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wider font-semibold text-sky-600 mb-2">{entry.date}</p>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">{entry.title}</h3>
                        <p className="text-slate-600 text-sm leading-relaxed mb-3">{entry.excerpt}</p>
                        <span className="text-sky-600 group-hover:text-sky-700 text-sm font-semibold inline-flex items-center gap-1 transition-colors">
                          Читать
                          <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              </motion.section>

              <motion.section
                id="resident-knowledge"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number], delay: 0.5 }}
                className="bg-white rounded-2xl p-8 border border-slate-100 scroll-mt-24"
              >
                <h2 className="text-2xl font-black text-slate-900 mb-6">База знаний</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {portal.knowledgeBase.map((article) => (
                    <article
                      key={article.id}
                      className="group rounded-2xl border border-slate-100 hover:border-sky-200 overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                      onClick={() => setOpenArticleId(article.id)}
                    >
                      <div className="h-36 overflow-hidden">
                        <img src={article.image} alt={article.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] uppercase tracking-wider font-semibold text-sky-600">{article.readTime}</span>
                          <span className="text-[11px] text-slate-400">{article.tags.slice(0, 2).join(' • ')}</span>
                        </div>
                        <h3 className="font-bold text-slate-900 text-sm mb-1">{article.title}</h3>
                        <p className="text-slate-500 text-xs leading-relaxed mb-3">{article.excerpt}</p>
                        <span className="text-sky-600 group-hover:text-sky-700 text-sm font-semibold inline-flex items-center gap-1 transition-colors">
                          Читать
                          <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              </motion.section>

              <motion.section
                id="resident-gallery"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number], delay: 0.6 }}
                className="bg-white rounded-2xl p-8 border border-slate-100 scroll-mt-24"
              >
                <h2 className="text-2xl font-black text-slate-900 mb-6">Фото производства</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {portal.gallery.map((photo, index) => (
                    <button
                      key={photo.id}
                      type="button"
                      onClick={() => setLightboxIndex(index)}
                      className="group relative h-40 rounded-xl overflow-hidden text-left"
                    >
                      <img src={photo.src} alt={photo.alt} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/20 to-transparent" />
                      {photo.caption && (
                        <div className="absolute left-3 right-3 bottom-3 text-white text-xs font-semibold tracking-wide">
                          {photo.caption}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </motion.section>

              <motion.section
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number], delay: 0.7 }}
                className="bg-white rounded-2xl p-8 border border-slate-100"
              >
                <h2 className="text-2xl font-black text-slate-900 mb-6">Преимущества</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {resident.advantages.map((a, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 bg-sky-50 rounded-xl border border-sky-100">
                      <div className="w-8 h-8 bg-sky-600 rounded-lg flex items-center justify-center shrink-0 text-white font-bold text-sm">
                        {i + 1}
                      </div>
                      <span className="text-slate-700 text-sm font-medium">{a}</span>
                    </div>
                  ))}
                </div>
              </motion.section>
            </div>

            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number], delay: 0.25 }}
                className="bg-white rounded-2xl p-6 border border-slate-100 sticky top-28"
              >
                <h3 className="text-lg font-black text-slate-900 mb-5">Связаться</h3>

                <div className="grid grid-cols-3 gap-2 mb-5">
                  <div className="rounded-xl bg-slate-50 border border-slate-100 p-2.5 text-center">
                    <div className="text-sm font-black text-slate-900">{portal.products.length}</div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider">Товаров</div>
                  </div>
                  <div className="rounded-xl bg-slate-50 border border-slate-100 p-2.5 text-center">
                    <div className="text-sm font-black text-slate-900">{portal.services.length}</div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider">Услуг</div>
                  </div>
                  <div className="rounded-xl bg-slate-50 border border-slate-100 p-2.5 text-center">
                    <div className="text-sm font-black text-slate-900">{portal.knowledgeBase.length}</div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider">Статей</div>
                  </div>
                </div>

                {resident.phone && (
                  <a
                    href={`tel:${resident.phone.replace(/\D/g, '')}`}
                    className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 hover:border-sky-200 hover:bg-sky-50/40 transition-all duration-200 mb-3 group"
                  >
                    <div className="w-9 h-9 bg-sky-100 group-hover:bg-sky-600 rounded-lg flex items-center justify-center transition-colors">
                      <Phone className="w-4 h-4 text-sky-600 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Телефон</div>
                      <div className="text-slate-900 font-semibold text-sm">{resident.phone}</div>
                    </div>
                  </a>
                )}

                {resident.email && (
                  <a
                    href={`mailto:${resident.email}`}
                    className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 hover:border-sky-200 hover:bg-sky-50/40 transition-all duration-200 mb-3 group"
                  >
                    <div className="w-9 h-9 bg-sky-100 group-hover:bg-sky-600 rounded-lg flex items-center justify-center transition-colors">
                      <Mail className="w-4 h-4 text-sky-600 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Email</div>
                      <div className="text-slate-900 font-semibold text-sm">{resident.email}</div>
                    </div>
                  </a>
                )}

                {resident.website && (
                  <a
                    href={resident.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 hover:border-sky-200 hover:bg-sky-50/40 transition-all duration-200 mb-3 group"
                  >
                    <div className="w-9 h-9 bg-sky-100 group-hover:bg-sky-600 rounded-lg flex items-center justify-center transition-colors">
                      <Globe className="w-4 h-4 text-sky-600 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Сайт</div>
                      <div className="text-slate-900 font-semibold text-sm truncate max-w-[160px]">
                        {resident.website}
                      </div>
                    </div>
                  </a>
                )}

                <div className="mt-6 space-y-3">
                  <a
                    href={resident.phone ? `tel:${resident.phone.replace(/\D/g, '')}` : '#'}
                    className="flex items-center justify-center gap-2 w-full py-3.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-sm transition-all duration-200 hover:shadow-[0_0_20px_rgba(2,132,199,0.28)]"
                  >
                    Связаться
                    <ArrowRight className="w-4 h-4" />
                  </a>
                  <a
                    href={resident.email ? `mailto:${resident.email}?subject=Запрос расчёта` : '#'}
                    className="flex items-center justify-center gap-2 w-full py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold rounded-xl text-sm transition-colors"
                  >
                    Получить расчёт
                  </a>
                </div>
              </motion.div>

              <Link
                to="/#residents"
                className="flex items-center justify-center gap-2 w-full py-3 text-slate-500 hover:text-sky-600 font-medium text-sm transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Все резиденты
              </Link>
            </div>
          </div>
        </div>

        {selectedItem && (
          <div className="fixed inset-0 z-[70] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-5xl max-h-[92vh] overflow-auto rounded-2xl bg-white border border-slate-200 shadow-2xl">
              <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-slate-100 p-4 flex items-center justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-wider font-semibold text-sky-600">
                    {selectedItem.kind === 'product' ? 'Карточка товара' : 'Карточка услуги'}
                  </p>
                  <h3 className="text-lg font-black text-slate-900">{selectedItem.item.title}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className="w-9 h-9 rounded-lg border border-slate-200 hover:border-sky-200 hover:text-sky-600 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 grid lg:grid-cols-[1.15fr_1fr] gap-6">
                <div>
                  <div className="relative rounded-2xl overflow-hidden mb-3">
                    <img
                      src={selectedItem.item.images[selectedItemPhotoIndex]}
                      alt={selectedItem.item.title}
                      className="w-full h-72 object-cover"
                    />
                    {selectedItem.item.images.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={() => setSelectedItemPhotoIndex((idx) => (idx - 1 + selectedItem.item.images.length) % selectedItem.item.images.length)}
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-slate-900 flex items-center justify-center"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedItemPhotoIndex((idx) => (idx + 1) % selectedItem.item.images.length)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-slate-900 flex items-center justify-center"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {selectedItem.item.images.map((image, imageIndex) => (
                      <button
                        key={`${image}-${imageIndex}`}
                        type="button"
                        onClick={() => setSelectedItemPhotoIndex(imageIndex)}
                        className={`h-20 rounded-lg overflow-hidden border ${
                          selectedItemPhotoIndex === imageIndex ? 'border-sky-400' : 'border-slate-200'
                        }`}
                      >
                        <img src={image} alt={`${selectedItem.item.title} ${imageIndex + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">{selectedItem.item.description}</p>
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-2">Характеристики</h4>
                  <div className="space-y-2 mb-6">
                    {selectedItem.item.specs.map((spec) => (
                      <div key={`${spec.label}-${spec.value}`} className="flex items-center justify-between gap-4 rounded-lg bg-slate-50 border border-slate-100 px-3 py-2">
                        <span className="text-xs text-slate-500">{spec.label}</span>
                        <span className="text-xs font-semibold text-slate-900 text-right">{spec.value}</span>
                      </div>
                    ))}
                  </div>

                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-2">Релевантные статьи</h4>
                  <div className="space-y-2">
                    {selectedItemRelatedArticles.map((article) => (
                      <button
                        key={article.id}
                        type="button"
                        onClick={() => {
                          setOpenArticleId(article.id);
                          setSelectedItem(null);
                        }}
                        className="w-full text-left rounded-xl border border-slate-100 hover:border-sky-200 px-3 py-2 transition-colors"
                      >
                        <div className="text-xs font-semibold text-sky-600 mb-0.5">{article.readTime}</div>
                        <div className="text-sm font-semibold text-slate-900">{article.title}</div>
                      </button>
                    ))}
                    {selectedItemRelatedArticles.length === 0 && (
                      <p className="text-xs text-slate-400">Для этой позиции статьи будут добавлены позже.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {openNews && (
          <div className="fixed inset-0 z-[75] bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-4xl max-h-[92vh] overflow-auto rounded-2xl bg-white border border-slate-200 shadow-2xl">
              <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-slate-100 p-4 flex items-center justify-between">
                <div className="min-w-0 mr-4">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-sky-600">{openNews.date}</span>
                  <h3 className="text-lg font-black text-slate-900 truncate">{openNews.title}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setOpenNewsId(null)}
                  className="w-9 h-9 rounded-lg border border-slate-200 hover:border-sky-200 hover:text-sky-600 flex items-center justify-center transition-colors shrink-0"
                  aria-label="Закрыть новость"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 sm:p-8">
                <img
                  src={openNews.image}
                  alt={openNews.title}
                  className="w-full h-56 sm:h-72 object-cover rounded-2xl mb-8"
                />

                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight mb-6">{openNews.title}</h2>

                <div className="space-y-5">
                  {openNewsBlocks.map((block, blockIndex) =>
                    block.type === 'text' ? (
                      <p key={`block-${blockIndex}`} className="text-slate-700 text-base leading-relaxed">
                        {block.text}
                      </p>
                    ) : (
                      <figure key={`block-${blockIndex}`} className="my-6">
                        <img
                          src={block.src}
                          alt={block.alt}
                          className="w-full h-48 sm:h-56 object-cover rounded-xl"
                          loading="lazy"
                        />
                        {block.caption && (
                          <figcaption className="text-xs text-slate-400 mt-2 text-center">{block.caption}</figcaption>
                        )}
                      </figure>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {openArticle && (
          <div className="fixed inset-0 z-[75] bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-4xl max-h-[92vh] overflow-auto rounded-2xl bg-white border border-slate-200 shadow-2xl">
              <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-slate-100 p-4 flex items-center justify-between">
                <div className="min-w-0 mr-4">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-sky-600">{openArticle.readTime}</span>
                    <span className="text-[11px] text-slate-400">{openArticle.tags.slice(0, 3).join(' • ')}</span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 truncate">{openArticle.title}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setOpenArticleId(null)}
                  className="w-9 h-9 rounded-lg border border-slate-200 hover:border-sky-200 hover:text-sky-600 flex items-center justify-center transition-colors shrink-0"
                  aria-label="Закрыть статью"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 sm:p-8">
                <img
                  src={openArticle.image}
                  alt={openArticle.title}
                  className="w-full h-56 sm:h-72 object-cover rounded-2xl mb-8"
                />

                <div className="flex flex-wrap gap-2 mb-6">
                  {openArticle.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-700">
                      {tag}
                    </span>
                  ))}
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight mb-6">{openArticle.title}</h2>

                <div className="space-y-5">
                  {openArticleBlocks.map((block, blockIndex) =>
                    block.type === 'text' ? (
                      <p key={`block-${blockIndex}`} className="text-slate-700 text-base leading-relaxed">
                        {block.text}
                      </p>
                    ) : (
                      <figure key={`block-${blockIndex}`} className="my-6">
                        <img
                          src={block.src}
                          alt={block.alt}
                          className="w-full h-48 sm:h-56 object-cover rounded-xl"
                          loading="lazy"
                        />
                        {block.caption && (
                          <figcaption className="text-xs text-slate-400 mt-2 text-center">{block.caption}</figcaption>
                        )}
                      </figure>
                    ),
                  )}
                </div>

                {openArticleRelatedItems.length > 0 && (
                  <div className="mt-10 pt-6 border-t border-slate-100">
                    <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                      Связанные товары и услуги
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {openArticleRelatedItems.map((item) =>
                        item ? (
                          <span key={item.id} className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium">
                            {item.title}
                          </span>
                        ) : null,
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {lightboxIndex !== null && portal.gallery[lightboxIndex] && (
          <div className="fixed inset-0 z-[80] bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
            <button
              type="button"
              onClick={() => setLightboxIndex(null)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 border border-white/25 text-white flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={prevGallerySlide}
              className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/15 hover:bg-white/25 border border-white/25 text-white flex items-center justify-center"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="max-w-6xl w-full">
              <img
                src={portal.gallery[lightboxIndex].src}
                alt={portal.gallery[lightboxIndex].alt}
                className="w-full max-h-[78vh] object-contain rounded-2xl"
              />
              <div className="mt-4 text-center text-white/90">
                <div className="text-sm font-medium">{portal.gallery[lightboxIndex].alt}</div>
                {portal.gallery[lightboxIndex].caption && (
                  <div className="text-xs text-white/70 mt-1">{portal.gallery[lightboxIndex].caption}</div>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={nextGallerySlide}
              className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/15 hover:bg-white/25 border border-white/25 text-white flex items-center justify-center"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}



