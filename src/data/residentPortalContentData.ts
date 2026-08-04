import type { Resident } from './residents';

export interface ResidentCategory {
  id: string;
  title: string;
}

export interface ResidentCatalogItem {
  id: string;
  title: string;
  categoryId: string;
  shortDescription: string;
  description: string;
  specs: Array<{ label: string; value: string }>;
  images: string[];
  relatedArticleIds: string[];
}

export interface ResidentServiceItem {
  id: string;
  title: string;
  categoryId?: string;
  shortDescription: string;
  description: string;
  specs: Array<{ label: string; value: string }>;
  images: string[];
  relatedArticleIds: string[];
}

export type ArticleContentBlock =
  | { type: 'text'; text: string }
  | { type: 'image'; src: string; alt: string; caption?: string };

export interface ResidentNewsItem {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  contentBlocks?: ArticleContentBlock[];
  image: string;
}

export interface ResidentKnowledgeArticle {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  contentBlocks?: ArticleContentBlock[];
  image: string;
  readTime: string;
  tags: string[];
  relatedItemIds: string[];
}

export interface ResidentGalleryItem {
  id: string;
  src: string;
  alt: string;
  caption?: string;
}

export interface ResidentPortalContent {
  residentSlug: string;
  intro: string;
  productCategories: ResidentCategory[];
  products: ResidentCatalogItem[];
  serviceCategories: ResidentCategory[];
  services: ResidentServiceItem[];
  news: ResidentNewsItem[];
  knowledgeBase: ResidentKnowledgeArticle[];
  gallery: ResidentGalleryItem[];
}

type SpecSeed = [label: string, value: string];

interface CatalogSeed {
  id: string;
  title: string;
  categoryId: string;
  shortDescription: string;
  description: string;
  specs: SpecSeed[];
  images?: string[];
  relatedArticleIds?: string[];
}

interface ServiceSeed {
  id: string;
  title: string;
  categoryId?: string;
  shortDescription: string;
  description: string;
  specs: SpecSeed[];
  images?: string[];
  relatedArticleIds?: string[];
}

interface PortalSeed {
  residentSlug: string;
  intro: string;
  productCategories: ResidentCategory[];
  products: CatalogSeed[];
  serviceCategories: ResidentCategory[];
  services: ServiceSeed[];
  galleryCaption?: string[];
  knowledgeArticles?: ResidentKnowledgeArticle[];
}

interface AtomicSeedGroup {
  categoryId: string;
  categoryTitle: string;
  items: string[];
  specs?: SpecSeed[];
}

const FALLBACK_VISUALS = [
  '/residents/metalworks.svg',
  '/residents/hydraulics.svg',
  '/residents/fasteners.svg',
];

const VISUALS_BY_SLUG: Record<string, string[]> = {
  metalworks: ['/residents/metalworks.svg', '/residents/fasteners.svg', '/residents/driveshafts.svg'],
  hydraulics: ['/residents/hydraulics.svg', '/residents/driveshafts.svg', '/residents/metalworks.svg'],
  driveshafts: ['/residents/driveshafts.svg', '/residents/metalworks.svg', '/residents/hydraulics.svg'],
  'construction-materials': ['/residents/metalworks.svg', '/residents/fasteners.svg', '/residents/container-homes.svg'],
  ventilation: ['/residents/hydraulics.svg', '/residents/metalworks.svg', '/residents/fasteners.svg'],
  fasteners: ['/residents/fasteners.svg', '/residents/metalworks.svg', '/residents/container-homes.svg'],
  'industrial-equipment': ['/residents/metalworks.svg', '/residents/3d-printing.svg', '/residents/hydraulics.svg'],
  recycling: ['/residents/container-homes.svg', '/residents/3d-printing.svg', '/residents/metalworks.svg'],
  tooling: ['/residents/metalworks.svg', '/residents/driveshafts.svg', '/residents/3d-printing.svg'],
  '3d-printing': ['/residents/3d-printing.svg', '/residents/metalworks.svg', '/residents/hydraulics.svg'],
  'container-homes': ['/residents/container-homes.svg', '/residents/metalworks.svg', '/residents/fasteners.svg'],
};

const getVisuals = (slug: string): string[] => VISUALS_BY_SLUG[slug] ?? FALLBACK_VISUALS;

const toSpecs = (specs: SpecSeed[]): Array<{ label: string; value: string }> =>
  specs.map(([label, value]) => ({ label, value }));

const createCategories = (categories: Array<[id: string, title: string]>): ResidentCategory[] =>
  categories.map(([id, title]) => ({ id, title }));

const decapitalize = (value: string) => (value.length > 0 ? `${value.charAt(0).toLowerCase()}${value.slice(1)}` : value);

const buildAtomicCatalogSeeds = (
  prefix: string,
  directionTitle: string,
  groups: AtomicSeedGroup[],
): CatalogSeed[] =>
  groups.flatMap((group) =>
    group.items.map((title, index) => ({
      id: `${prefix}-${group.categoryId}-${index + 1}`,
      title,
      categoryId: group.categoryId,
      shortDescription: `${group.categoryTitle}: ${decapitalize(title)}.`,
      description:
        `Изготавливаем и поставляем ${decapitalize(title)} в категории «${group.categoryTitle}» направления «${directionTitle}». Подбираем исполнение, материалы и размеры под задачу заказчика.`,
      specs: group.specs ?? [
        ['Категория', group.categoryTitle],
        ['Формат', 'Под заказ и серийно'],
        ['Основание', 'Чертёж, образец или ТЗ'],
      ],
    })),
  );

const buildAtomicServiceSeeds = (
  prefix: string,
  directionTitle: string,
  groups: AtomicSeedGroup[],
): ServiceSeed[] =>
  groups.flatMap((group) =>
    group.items.map((title, index) => ({
      id: `${prefix}-${group.categoryId}-${index + 1}`,
      title,
      categoryId: group.categoryId,
      shortDescription: `${group.categoryTitle}: ${decapitalize(title)}.`,
      description:
        `Оказываем услугу «${decapitalize(title)}» в категории «${group.categoryTitle}» направления «${directionTitle}». Согласовываем объём, сроки и технические требования под задачу заказчика.`,
      specs: group.specs ?? [
        ['Категория', group.categoryTitle],
        ['Формат', 'Разовые и серийные задачи'],
        ['Основание', 'ТЗ, образец или чертёж'],
      ],
    })),
  );

const getArticleIds = (slug: string) => ({
  overview: `${slug}-article-overview`,
  order: `${slug}-article-order`,
});

const getRotatedImages = (slug: string, index: number): string[] => {
  const visuals = getVisuals(slug);
  return [
    visuals[index % visuals.length],
    visuals[(index + 1) % visuals.length],
    visuals[(index + 2) % visuals.length],
  ];
};

const buildCatalogItems = (slug: string, items: CatalogSeed[]): ResidentCatalogItem[] => {
  const articleIds = getArticleIds(slug);
  return items.map((item, index) => ({
    ...item,
    specs: toSpecs(item.specs),
    images: item.images ?? getRotatedImages(slug, index),
    relatedArticleIds: item.relatedArticleIds ?? [articleIds.overview, articleIds.order],
  }));
};

const buildServiceItems = (slug: string, items: ServiceSeed[]): ResidentServiceItem[] => {
  const articleIds = getArticleIds(slug);
  return items.map((item, index) => ({
    ...item,
    specs: toSpecs(item.specs),
    images: item.images ?? getRotatedImages(slug, index),
    relatedArticleIds: item.relatedArticleIds ?? [articleIds.overview, articleIds.order],
  }));
};

const buildNews = (slug: string, intro: string): ResidentNewsItem[] => {
  const visuals = getVisuals(slug);
  return [
    {
      id: `${slug}-news-1`,
      title: 'Обновили производственную программу',
      date: '15.04.2026',
      excerpt: 'Уточнили ассортимент и сфокусировались на направлениях, которые дают быстрый и понятный результат для заказчика.',
      contentBlocks: [
        { type: 'text', text: intro },
        { type: 'text', text: 'Теперь в разделе собраны только актуальные товары и услуги по направлению. Это ускоряет подбор решения и упрощает согласование заявки.' },
        { type: 'image', src: visuals[0], alt: 'Актуализированное производственное направление', caption: 'Обновлённый каталог' },
      ],
      image: visuals[0],
    },
    {
      id: `${slug}-news-2`,
      title: 'Принимаем заказы по чертежам и образцам',
      date: '02.04.2026',
      excerpt: 'Собрали единый процесс для заявок с техническим заданием, образцом или эскизом.',
      image: visuals[1],
    },
    {
      id: `${slug}-news-3`,
      title: 'Ускорили подготовку коммерческих предложений',
      date: '19.03.2026',
      excerpt: 'Типовые запросы считаем быстрее, а по нестандартным задачам сразу даём список исходных данных для расчёта.',
      image: visuals[2],
    },
  ];
};

const buildKnowledgeBase = (
  slug: string,
  intro: string,
  products: ResidentCatalogItem[],
  services: ResidentServiceItem[],
): ResidentKnowledgeArticle[] => {
  const visuals = getVisuals(slug);
  const articleIds = getArticleIds(slug);
  const relatedIds = [...products, ...services].slice(0, 4).map((item) => item.id);

  return [
    {
      id: articleIds.overview,
      title: 'Как подготовить запрос, чтобы быстрее получить расчёт',
      excerpt: 'Минимальный набор данных, который экономит время на согласовании.',
      content:
        'Для быстрой оценки проекта подготовьте описание задачи, размеры, материал, желаемый срок, объём партии и требования к приёмке. Если есть чертёж, фото или образец, прикрепите их сразу — это сокращает число уточнений и ускоряет запуск в работу.',
      contentBlocks: [
        { type: 'text', text: intro },
        { type: 'text', text: 'Чем точнее исходные данные, тем быстрее можно подобрать технологию, материал и срок исполнения. Для серийных заказов полезно заранее указать ориентировочный объём и периодичность поставок.' },
        { type: 'image', src: visuals[0], alt: 'Подготовка технического запроса', caption: 'Что приложить к заявке' },
        { type: 'text', text: 'Если точных чертежей пока нет, достаточно описать задачу своими словами и приложить фото или образец. Этого хватит, чтобы сформировать корректный перечень уточняющих вопросов.' },
      ],
      image: visuals[0],
      readTime: '6 мин',
      tags: ['ТЗ', 'Расчёт', 'Подготовка заявки'],
      relatedItemIds: relatedIds,
    },
    {
      id: articleIds.order,
      title: 'Что согласовать до запуска заказа',
      excerpt: 'Чек-лист по срокам, материалам, контролю качества и логистике.',
      content:
        'До запуска заказа зафиксируйте спецификацию, материал, внешний вид, срок готовности, способ упаковки и формат приёмки. Для ответственных проектов полезно заранее договориться о промежуточных контрольных точках и фотоотчётах.',
      contentBlocks: [
        { type: 'text', text: 'Согласование до старта — лучший способ избежать доработок и спорных ситуаций на финальной приёмке.' },
        { type: 'image', src: visuals[1], alt: 'Контроль параметров и согласование перед запуском', caption: 'Фиксация параметров заказа' },
        { type: 'text', text: 'Отдельно стоит обсудить упаковку, маркировку и логистику. Для монтажных, ремонтных и сервисных задач заранее согласуйте условия доступа на объект и режим работы площадки.' },
      ],
      image: visuals[1],
      readTime: '5 мин',
      tags: ['Согласование', 'Качество', 'Логистика'],
      relatedItemIds: relatedIds.slice(0, 3),
    },
  ];
};

const buildGallery = (slug: string, captions?: string[]): ResidentGalleryItem[] => {
  const visuals = getVisuals(slug);
  const fallbackCaptions = ['Основной участок', 'Технологический процесс', 'Готовая продукция'];

  return visuals.map((src, index) => ({
    id: `${slug}-gallery-${index + 1}`,
    src,
    alt: captions?.[index] ?? fallbackCaptions[index] ?? src,
    caption: captions?.[index] ?? fallbackCaptions[index],
  }));
};

const buildPortalContent = (seed: PortalSeed): ResidentPortalContent => {
  const products = buildCatalogItems(seed.residentSlug, seed.products);
  const services = buildServiceItems(seed.residentSlug, seed.services);

  let knowledgeBase: ResidentKnowledgeArticle[];

  if (seed.knowledgeArticles && seed.knowledgeArticles.length > 0) {
    knowledgeBase = seed.knowledgeArticles;
    // Invert relatedItemIds → populate item.relatedArticleIds
    const articleIdsByItemId = new Map<string, string[]>();
    knowledgeBase.forEach((article) => {
      article.relatedItemIds.forEach((itemId) => {
        const existing = articleIdsByItemId.get(itemId) ?? [];
        existing.push(article.id);
        articleIdsByItemId.set(itemId, existing);
      });
    });
    products.forEach((p) => {
      const ids = articleIdsByItemId.get(p.id);
      if (ids) p.relatedArticleIds = ids;
    });
    services.forEach((s) => {
      const ids = articleIdsByItemId.get(s.id);
      if (ids) s.relatedArticleIds = ids;
    });
  } else {
    knowledgeBase = buildKnowledgeBase(seed.residentSlug, seed.intro, products, services);
  }

  return {
    residentSlug: seed.residentSlug,
    intro: seed.intro,
    productCategories: seed.productCategories,
    products,
    serviceCategories: seed.serviceCategories,
    services,
    news: buildNews(seed.residentSlug, seed.intro),
    knowledgeBase,
    gallery: buildGallery(seed.residentSlug, seed.galleryCaption),
  };
};

const portalSeeds: Record<string, PortalSeed> = {
  metalworks: {
    residentSlug: 'metalworks',
    intro: '',
    productCategories: createCategories([
      ['metal-furniture', 'Металлическая мебель'],
      ['metal-structures', 'Металлоконструкции и изделия'],
      ['sheet-products', 'Изделия из листового металла'],
      ['uzv-equipment', 'Оборудование для УЗВ и аквакультуры'],
    ]),
    products: [
      // --- Металлическая мебель ---
      {
        id: 'metal-product-furniture-1',
        title: 'Верстаки металлические',
        categoryId: 'metal-furniture',
        shortDescription: 'Производственные и слесарные верстаки под заказ',
        images: ['https://s3.datary-dev.ru/tp1219/metal/VP_4_ekran.970.jpg'],
        description: 'Изготавливаем металлические верстаки для мастерских, производств, гаражей и сервисных участков. Возможна комплектация полками, экранами, тумбами и усиленными столешницами. Конструкции производятся под размеры заказчика с порошковой или жидкой покраской.',
        specs: [
          ['Материал', 'Сталь'],
          ['Покраска', 'Порошковая или жидкая'],
          ['Длина', 'До 3000 мм'],
          ['Тип', 'Сварная конструкция'],
          ['Назначение', 'Производственные помещения'],
        ],
      },
      {
        id: 'metal-product-furniture-2',
        title: 'Сварочные столы',
        categoryId: 'metal-furniture',
        shortDescription: 'Сварочные столы с отверстиями и усиленной рамой',
        images: ['https://s3.datary-dev.ru/tp1219/metal/0608bb2764d27fe6b75d1d075ef7b4ef.jpg'],
        description: 'Производство сварочных столов для ручной и полуавтоматической сварки. Столы изготавливаются из толстолистового металла с усилением каркаса. Возможна установка отверстий, упоров, полок и колёсных опор.',
        specs: [
          ['Тип', 'Сварочный стол'],
          ['Материал', 'Конструкционная сталь'],
          ['Конструкция', 'Усиленная'],
          ['Изготовление', 'Под заказ'],
          ['Покрытие', 'Окраска'],
        ],
      },
      {
        id: 'metal-product-furniture-3',
        title: 'Металлические шкафы',
        categoryId: 'metal-furniture',
        shortDescription: 'Шкафы для инструмента и производственных помещений',
        images: ['https://s3.datary-dev.ru/tp1219/metal/un5w2tsjy987o0bmdg8dj0slez5wyy.png'],
        description: 'Изготавливаем металлические шкафы для хранения инструмента, оборудования, спецодежды и документации. Возможна разработка индивидуальной конструкции с различным количеством секций, полок и замков.',
        specs: [
          ['Материал', 'Листовая сталь'],
          ['Изготовление', 'Под заказ'],
          ['Тип дверей', 'Распашные'],
          ['Покраска', 'Порошковая'],
          ['Применение', 'Производство и склад'],
        ],
      },
      {
        id: 'metal-product-furniture-4',
        title: 'Металлические стеллажи',
        categoryId: 'metal-furniture',
        shortDescription: 'Стеллажи для склада, мастерской и производства',
        images: [
            'https://s3.datary-dev.ru/tp1219/metal/metallicheskie-stellazhi.jpg',
            'https://s3.datary-dev.ru/tp1219/metal/8kc0jw42z9z9n5jpt2hoeda3la5a82k9 (1).png'
        ],
        description: 'Производство металлических стеллажей различной конфигурации. Изготавливаются стойки, полки и усилители с рёбрами жёсткости. Подходят для складов, архивов, мастерских и производственных участков.',
        specs: [
          ['Тип', 'Сборные стеллажи'],
          ['Материал', 'Сталь'],
          ['Полки', 'Металлические'],
          ['Изготовление', 'Серийное и индивидуальное'],
          ['Покрытие', 'Окраска'],
        ],
      },
      // --- Металлоконструкции и изделия ---
      {
        id: 'metal-product-structures-1',
        title: 'Фасадные кассеты',
        categoryId: 'metal-structures',
        shortDescription: 'Металлические фасадные кассеты под размеры объекта',
        images: [
            'https://s3.datary-dev.ru/tp1219/metal/fasade_cassette_1.jpg',
            'https://s3.datary-dev.ru/tp1219/metal/ocin (1).png',
        ],
        description: 'Изготавливаем фасадные кассеты из листового металла для облицовки зданий и промышленных объектов. Производство выполняется на оборудовании для штамповки и гибки металла.',
        specs: [
          ['Материал', 'Оцинкованная сталь'],
          ['Тип', 'Фасадные элементы'],
          ['Толщина металла', 'До 0.8 мм'],
          ['Изготовление', 'Под заказ'],
          ['Покрытие', 'Окрашенное'],
        ],
      },

      {
        id: 'metal-product-structures-3',
        title: 'Хомуты для армирования',
        categoryId: 'metal-structures',
        shortDescription: 'Хомуты для армирования бетонных конструкций',
        images: ['https://s3.datary-dev.ru/tp1219/metal/507001139-21.webp'],
        description: 'Изготавливаем хомуты для армирования бетонных конструкций. Применяются при вязке арматурных каркасов для фиксации продольных и поперечных стержней. Производство выполняется на специализированном оборудовании.',
        specs: [
          ['Форма', 'П-образная, прямоугольная'],
          ['Материал', 'Арматурная сталь'],
          ['Тип', 'Элементы армирования'],
          ['Изготовление', 'Серийное'],
          ['Применение', 'Армирование бетона'],
        ],
      },

      {
        id: 'metal-product-structures-5',
        title: 'Аэраторы для водоёмов',
        categoryId: 'metal-structures',
        shortDescription: 'Аэраторы из нержавеющей стали для подачи кислорода',
        images: ['https://s3.datary-dev.ru/tp1219/metal/potok-ak-tor-prev.jpg'],
        description: 'Изготавливаем аэраторы из нержавеющей стали для насыщения воды кислородом в прудах, водоёмах и технологических ёмкостях. Конструкции производятся под задачи заказчика.',
        specs: [
          ['Материал', 'Нержавеющая сталь'],
          ['Назначение', 'Аэрация воды'],
          ['Изготовление', 'Индивидуальное'],
          ['Тип', 'Сварная конструкция'],
          ['Применение', 'Водоёмы и резервуары'],
        ],
      },
      // --- Изделия из листового металла ---
      {
        id: 'metal-product-sheet-1',
        title: 'Корпуса оборудования',
        categoryId: 'sheet-products',
        shortDescription: 'Металлические корпуса и кожухи под оборудование',
        images: ['https://s3.datary-dev.ru/tp1219/metal/metallicheskiy-korpus_03 (1).png'],
        description: 'Производство металлических корпусов, кожухов и защитных элементов для промышленного и электротехнического оборудования. Возможна лазерная резка, гибка, сварка и окраска изделий.',
        specs: [
          ['Материал', 'Листовая сталь'],
          ['Технология', 'Лазерная резка'],
          ['Обработка', 'Гибка и сварка'],
          ['Покраска', 'Порошковая'],
          ['Изготовление', 'По чертежам'],
        ],
      },
      {
        id: 'metal-product-sheet-2',
        title: 'Металлические тележки',
        categoryId: 'sheet-products',
        shortDescription: 'Тележки для сварочного и производственного оборудования',
        images: ['https://s3.datary-dev.ru/tp1219/metal/174177837767d147903c51e (1).png'],
        description: 'Изготавливаем металлические тележки для перевозки оборудования, инструмента и сварочных аппаратов. Возможна установка держателей баллонов, полок и колёс повышенной нагрузки.',
        specs: [
          ['Тип', 'Транспортировочная тележка'],
          ['Материал', 'Сталь'],
          ['Назначение', 'Сварочное оборудование'],
          ['Конструкция', 'Сварная'],
          ['Покрытие', 'Окраска'],
        ],
      },
      {
        id: 'metal-uzv-1',
        title: 'Промышленный оксигенатор-реактор «ОЗОН-ОКСИ 100»',
        categoryId: 'uzv-equipment',
        shortDescription: 'Двухступенчатая система растворения озоно-кислородной смеси и фотолитической деструкции для УЗВ с протоком до 100 м³/ч',
        description: 'Профессиональное двухмодульное оборудование для интенсивных индустриальных УЗВ, крупных форелевых и осетровых хозяйств. Установка разработана для высокоэффективного растворения кислорода и озоно-кислородной смеси в потоке технологической воды, с одновременным решением проблемы безопасности — полным уничтожением остаточного озона перед подачей воды в бассейны с рыбой.\n\nПринцип работы: комплекс состоит из двух последовательно соединённых вертикальных модулей. Первая ступень — напорно-контактный реактор: основной поток воды (до 100 м³/ч) и озоно-кислородная смесь подаются под напором в первую колонну. Специальная внутренняя геометрия реактора обеспечивает принудительное диспергирование газа. Озон мгновенно растворяется в воде, уничтожая патогенную микрофлору (бактерии, вирусы, грибки), окисляя растворённую органику и снижая уровень токсичных гуминовых веществ — вода становится кристально прозрачной. Вторая ступень — вертикальный фотолитический деструктор: из первого реактора вода поступает во вторую колонну со встроенным блоком УФ-излучения жёсткого спектра. УФ-свет разрушает молекулы остаточного свободного озона (O₃), превращая его в растворённый кислород (O₂). На выходе гарантированно безопасная вода, не способная обжечь жаберный аппарат рыбы.\n\nКлючевые преимущества: высокая производительность 100 м³/ч для магистральных линий очистки крупных рыбоводных модулей; фотолитический метод деструкции озона без угольных фильтров — никаких засорений, никакого угольного микропластика в бассейнах; дополнительное насыщение воды кислородом O₂ при распаде O₃ под УФ-лучами; герметичная конструкция из материалов с абсолютной стойкостью к озону и жёсткому УФ-излучению; отсутствие форсунок, сеток и джетов — аппарат работает стабильно без постоянной промывки; непрерывная эксплуатация 24/7.\n\nНазначение: стерилизация воды и борьба с бактериальными вспышками в УЗВ; обесцвечивание воды (удаление желтоватого оттенка от органики); насыщение газом больших объёмов оборотной воды; головные системы очистки форелевых цехов, инкубаторов и маточных участков. Для подбора мощности УФ-системы под конкретный проток свяжитесь с нашим инженерным отделом.',
        specs: [
          ['Проток', 'до 100 м³/ч'],
          ['Конструкция', 'Двухмодульная (две последовательные вертикальные колонны)'],
          ['Первая ступень', 'Напорно-контактный реактор (растворение озона)'],
          ['Вторая ступень', 'Вертикальный фотолитический деструктор (УФ-деструкция O₃ → O₂)'],
          ['Метод деструкции озона', 'УФ-фотолиз жёсткого спектра'],
          ['Расходники', 'Отсутствуют'],
          ['Режим работы', 'Непрерывный 24/7'],
          ['Назначение', 'УЗВ, форелевые и осетровые хозяйства'],
        ],
        images: ['https://s3.datary-dev.ru/tp1219/articles/ChatGPT%20Image%209%20%D0%B8%D1%8E%D0%BB.%202026%20%D0%B3.%2C%2014_52_31.png'],
      },
      {
        id: 'metal-uzv-2',
        title: 'Промышленный оксигенатор-реактор «ОЗОН-ОКСИ 100 ДИНАМИК»',
        categoryId: 'uzv-equipment',
        shortDescription: 'Двухступенчатая система с динамическим ротором для УЗВ с протоком до 100 м³/ч, совместимая с осевыми (прудовыми) насосами',
        description: 'Профессиональное двухмодульное оборудование для интенсивных индустриальных УЗВ, крупных форелевых, лососевых и осетровых комплексов. Разработан для высокоэффективного растворения технического кислорода или озоно-кислородной смеси в непрерывном потоке воды до 100 м³/ч. Главное отличие установки — активное смешивание газов с помощью внутреннего механического ротора и последующая деструкция остаточного озона методом жёсткого УФ-облучения.\n\nПринцип работы: комплекс состоит из двух последовательно соединённых вертикальных колонн. Первая ступень — динамический реактор-оксигенатор: основной поток воды под напором приводит во вращение внутренний барабан (динамический ротор), преобразующий сплошной поток в мелкодисперсный факел распыла — водяную пыль. В ту же камеру подаётся озоно-кислородная смесь; за счёт огромной площади контакта микрокапель воды с газом КПД растворения приближается к максимуму. Растворённый озон уничтожает патогенную микрофлору (бактерии, вирусы, грибки), окисляет органику и устраняет желтоватый оттенок воды. Вращение ротора контролируется через смотровое окно. Вторая ступень — вертикальный УФ-деструктор: вода направляется во вторую колонну со встроенным блоком жёсткого УФ-излучения. Фотолитическая деструкция снижает концентрацию остаточного свободного озона (O₃) до безопасных технологических минимумов — это критически важно для защиты нежного жаберного аппарата рыбы от химических ожогов. При распаде озона под УФ-лучами генерируются гидроксильные радикалы (OH⁻), производящие финальную стерилизацию и распадающиеся в чистый растворённый кислород (O₂), дополнительно обогащая воду на выходе.\n\nКлючевые преимущества: совместимость с осевыми (прудовыми) насосами — минимальное гидравлическое сопротивление позволяет отказаться от дорогих высоконапорных центробежных помп, снижая затраты на электроэнергию в несколько раз; динамический барабан имеет свободный проток и физически не может забиться чешуёй рыбы, остатками корма или бактериальной слизью; фотолитический метод деструкции работает без расходников и громоздких промежуточных контактных ёмкостей; корпуса и внутренние элементы из материалов с наивысшим классом стойкости к озону и УФ-излучению; режим работы 24/7.\n\nНазначение: головные узлы водоподготовки в УЗВ с высокой плотностью посадки рыбы; блоки карантина, инкубационные цеха и маточные участки форелевых хозяйств; обесцвечивание воды и удаление гуминовых веществ; экспресс-борьба с бактериальными вспышками. Для 100% контроля безопасности на ответственных форелевых модулях рекомендуется дополнительно устанавливать датчик ОВП (Redox) на выходе и направлять воду через капельное плато или открытый каскад.',
        specs: [
          ['Проток', 'до 100 м³/ч'],
          ['Конструкция', 'Двухмодульная (две последовательные вертикальные колонны)'],
          ['Первая ступень', 'Динамический реактор с механическим ротором (распыление + растворение O₂/O₃)'],
          ['Вторая ступень', 'Вертикальный УФ-деструктор (фотолиз O₃ → O₂)'],
          ['Совместимость с насосами', 'Осевые (прудовые) и низконапорные центробежные'],
          ['Метод деструкции озона', 'УФ-фотолиз жёсткого спектра'],
          ['Расходники', 'Отсутствуют'],
          ['Режим работы', 'Непрерывный 24/7'],
          ['Назначение', 'УЗВ, форелевые, лососевые и осетровые хозяйства'],
        ],
        images: ['https://s3.datary-dev.ru/tp1219/articles/ChatGPT%20Image%209%20%D0%B8%D1%8E%D0%BB.%202026%20%D0%B3.%2C%2014_51_08.png'],
      },
    ],
    serviceCategories: createCategories([
      ['laser-plasma', 'Лазерная и плазменная резка'],
      ['metal-processing', 'Обработка металла'],
      ['welding-fabrication', 'Сварка и изготовление'],
      ['coating', 'Покраска и финишная обработка'],
      ['design-prep', 'Проектирование и подготовка'],
    ]),
    services: [
      // --- Лазерная и плазменная резка ---
      {
        id: 'metal-service-laser-1',
        title: 'Лазерная резка металла',
        categoryId: 'laser-plasma',
        shortDescription: 'Резка листового металла на лазерных станках',
        images: ['https://s3.datary-dev.ru/tp1219/metal/laser-cutting.jpg'],
        description: 'Выполняем лазерную резку листового металла по чертежам заказчика. Производство позволяет обрабатывать детали различной сложности с высокой точностью. Возможна работа с серийными и единичными заказами.',
        specs: [
          ['Толщина металла', 'До 20 мм'],
          ['Тип обработки', 'Лазерная резка'],
          ['Материал', 'Сталь, нержавейка'],
          ['Формат листа', 'До 1500×3000 мм'],
          ['Точность', 'Высокая'],
        ],
      },
      {
        id: 'metal-service-laser-2',
        title: 'Плазменная резка металла',
        categoryId: 'laser-plasma',
        shortDescription: 'Плазменная резка листового металла под заказ',
        images: ['https://s3.datary-dev.ru/tp1219/metal/plazmennaya-rezka-2.jpg'],
        description: 'Плазменная резка применяется для раскроя металлических листов различной толщины. Подходит для изготовления деталей, заготовок и конструкционных элементов.',
        specs: [
          ['Тип обработки', 'Плазменная резка'],
          ['Материал', 'Чёрный металл'],
          ['Назначение', 'Заготовки и детали'],
          ['Изготовление', 'По чертежам'],
          ['Формат', 'Листовой металл'],
        ],
      },
      {
        id: 'metal-service-laser-3',
        title: 'Лазерная резка неметаллических материалов',
        categoryId: 'laser-plasma',
        shortDescription: 'Резка пластика, картона, кожи и других материалов',
        images: ['https://s3.datary-dev.ru/tp1219/metal/lazernaya-rezka3.jpg'],
        description: 'CO2-лазер используется для резки неметаллических материалов: пластика, картона, бумаги, кожи и композитов. Выполняем изготовление деталей, шаблонов и декоративных элементов.',
        specs: [
          ['Оборудование', 'CO2 лазер'],
          ['Рабочее поле', '1500×3000 мм'],
          ['Материалы', 'Пластик, картон, кожа'],
          ['Тип работ', 'Раскрой'],
          ['Точность', 'Высокая'],
        ],
      },
      {
        id: 'metal-service-laser-4',
        title: 'Лазерная резка труб',
        categoryId: 'laser-plasma',
        shortDescription: 'Резка профильных и круглых труб на труборезе',
        images: ['https://s3.datary-dev.ru/tp1219/metal/kh382ihqqstvip4fv3vcq25l80t582m8.jpg'],
        description: 'Выполняем лазерную резку круглых и профильных труб на автоматическом труборезе. Производство подходит для изготовления элементов каркасов, металлоконструкций и сварных изделий.',
        specs: [
          ['Макс. длина трубы', '3000 мм'],
          ['Макс. диаметр', '160 мм'],
          ['Тип обработки', 'Лазерный труборез'],
          ['Материал', 'Сталь'],
          ['Назначение', 'Металлоконструкции'],
        ],
      },
      // --- Обработка металла ---
      {
        id: 'metal-service-proc-1',
        title: 'Гибка листового металла',
        categoryId: 'metal-processing',
        shortDescription: 'Гибка металла на листогибочном оборудовании',
        images: ['https://s3.datary-dev.ru/tp1219/metal/6d8891113b7bb3402c68e438f43357dc.jpg'],
        description: 'Выполняем гибку листового металла для производства корпусов, фасадных элементов, вентиляции и металлоконструкций. Изготавливаем детали по чертежам заказчика.',
        specs: [
          ['Длина гибки', 'До 3000 мм'],
          ['Тип обработки', 'Гибка'],
          ['Материал', 'Листовая сталь'],
          ['Назначение', 'Металлоизделия'],
          ['Производство', 'Под заказ'],
        ],
      },
      {
        id: 'metal-service-proc-2',
        title: 'Вальцовка металла',
        categoryId: 'metal-processing',
        shortDescription: 'Вальцовка листового металла и изготовление цилиндров',
        images: ['https://s3.datary-dev.ru/tp1219/metal/valcovka-listovogo-metalla.jpg'],
        description: 'Выполняем вальцовку листового металла для изготовления труб, обечаек, цилиндрических и конических элементов. Производство подходит для вентиляции и металлоконструкций.',
        specs: [
          ['Тип обработки', 'Вальцовка'],
          ['Толщина металла', 'До 8 мм'],
          ['Длина листа', 'До 3200 мм'],
          ['Назначение', 'Цилиндрические изделия'],
          ['Материал', 'Сталь'],
        ],
      },
      {
        id: 'metal-service-proc-3',
        title: 'Рубка металла на гильотине',
        categoryId: 'metal-processing',
        shortDescription: 'Резка листового металла гильотинными ножницами',
        images: ['https://s3.datary-dev.ru/tp1219/metal/w5ryluri279c6gwe066trr0bo7a08ugl.jpg'],
        description: 'Выполняем прямолинейную рубку листового металла на гильотине. Услуга используется для подготовки заготовок перед гибкой, сваркой и дальнейшей обработкой.',
        specs: [
          ['Тип обработки', 'Гильотина'],
          ['Материал', 'Листовой металл'],
          ['Назначение', 'Раскрой'],
          ['Тип реза', 'Прямолинейный'],
          ['Производство', 'Серийное и единичное'],
        ],
      },
      // --- Сварка и изготовление ---
      {
        id: 'metal-service-weld-1',
        title: 'Сварочные работы',
        categoryId: 'welding-fabrication',
        shortDescription: 'Сварка металлоконструкций и изделий из металла',
        images: ['https://s3.datary-dev.ru/tp1219/metal/svarka_-_sposoby_raboty_s_metallami_i_ponyatie_polyarnosti.jpg'],
        description: 'Выполняем сварочные работы тремя методами. Дуговая сварка (MMA/MIG/MAG) — для конструкционных сталей, металлоконструкций и корпусных изделий. Аргонодуговая сварка (TIG) — для нержавеющих сталей, алюминия и цветных сплавов: исключает окисление в зоне термического влияния, применяется в пищевой и химической промышленности. Лазерная сварка — для тонколистовых деталей с жёсткими допусками, ширина шва от 0,2 мм, минимальные деформации заготовки.',
        specs: [
          ['Методы сварки', 'Дуговая (MMA/MIG/MAG), аргонодуговая (TIG), лазерная'],
          ['Материалы', 'Конструкционные и нержавеющие стали, алюминий, цветные сплавы'],
          ['Лазерная сварка', 'Ширина шва от 0,2 мм, минимальная ЗТВ'],
          ['TIG-сварка', 'Без окисления, для пищевой и химической промышленности'],
          ['Производство', 'Под заказ, единичное и серийное'],
        ],
      },
      {
        id: 'metal-service-weld-2',
        title: 'Изготовление металлоизделий под заказ',
        categoryId: 'welding-fabrication',
        shortDescription: 'Производство изделий по чертежам заказчика',
        images: ['https://s3.datary-dev.ru/tp1219/metal/chertezhi_bystro.jpg'],
        description: 'Изготавливаем металлоизделия по эскизам, чертежам и образцам заказчика. Возможен полный цикл производства: проектирование, резка, гибка, сварка и покраска.',
        specs: [
          ['Производство', 'Индивидуальное'],
          ['Материал', 'Металл'],
          ['Этапы', 'Полный цикл'],
          ['Документация', 'Чертежи заказчика'],
          ['Тип изделий', 'Различные'],
        ],
      },

      // --- Покраска и финишная обработка ---
      {
        id: 'metal-service-coat-1',
        title: 'Порошковая покраска металла',
        categoryId: 'coating',
        shortDescription: 'Порошковая окраска металлических изделий',
        images: ['https://s3.datary-dev.ru/tp1219/metal/pol-ar2.jpg'],
        description: 'Выполняем порошковую покраску металлических изделий после механической обработки и сварки. Покрытие обеспечивает защиту металла и устойчивость к внешним воздействиям.',
        specs: [
          ['Тип покрытия', 'Порошковое'],
          ['Материал', 'Металл'],
          ['Назначение', 'Защитное покрытие'],
          ['Обработка', 'Термокамера'],
          ['Применение', 'Металлоизделия'],
        ],
      },
      {
        id: 'metal-service-coat-2',
        title: 'Жидкая покраска металла',
        categoryId: 'coating',
        shortDescription: 'Окраска металлических изделий жидкими составами',
        images: ['https://s3.datary-dev.ru/tp1219/metal/kra-met-val.jpg'],
        description: 'Выполняем жидкую покраску металлоконструкций, изделий и производственного оборудования. Подходит для крупногабаритных и нестандартных конструкций.',
        specs: [
          ['Тип покрытия', 'Жидкая краска'],
          ['Материал', 'Металл'],
          ['Назначение', 'Защитная окраска'],
          ['Тип изделий', 'Конструкции и детали'],
          ['Изготовление', 'Под заказ'],
        ],
      },
      // --- Проектирование и подготовка ---
      {
        id: 'metal-service-design-1',
        title: 'Подготовка чертежей для производства',
        categoryId: 'design-prep',
        shortDescription: 'Подготовка файлов и чертежей для резки и гибки',
        images: ['https://s3.datary-dev.ru/tp1219/metal/raskroy.jpg'],
        description: 'Выполняем подготовку производственных чертежей и файлов для лазерной резки, гибки и изготовления металлоизделий. Возможна адаптация эскизов заказчика под производство.',
        specs: [
          ['Тип работ', 'Подготовка чертежей'],
          ['Назначение', 'Производство'],
          ['Форматы', 'CAD и DXF'],
          ['Обработка', 'Под оборудование'],
          ['Услуга', 'Для заказчика'],
        ],
      },
      {
        id: 'metal-service-design-2',
        title: 'Раскрой материала заказчика',
        categoryId: 'design-prep',
        shortDescription: 'Резка и обработка предоставленного материала',
        images: ['https://s3.datary-dev.ru/tp1219/metal/lazernaya-rezka-latuni-osobennosti.webp'],
        description: 'Выполняем лазерную резку, гибку и механическую обработку материала заказчика. Возможна работа с листовым металлом, трубами и другими заготовками.',
        specs: [
          ['Материал', 'Заказчика'],
          ['Тип обработки', 'Резка и гибка'],
          ['Оборудование', 'Лазер и листогиб'],
          ['Назначение', 'Производство деталей'],
          ['Формат', 'Индивидуальные заказы'],
        ],
      },
    ],
    galleryCaption: ['Производственный участок', 'Лазерная резка', 'Готовые изделия'],
    knowledgeArticles: [
      {
        id: 'metalworks-kb-1',
        title: 'Лазерная резка или плазменная: в чём разница и что выбрать',
        excerpt: 'Оба метода режут металл, но дают разный результат по точности, стоимости и толщине материала.',
        contentBlocks: [
          { type: 'text', text: 'Лазерная резка — это высокоточный метод раскроя металла сфокусированным лучом. Ширина реза составляет десятые доли миллиметра, кромка получается ровной и почти не требует доработки. Метод подходит для тонколистового металла до 20 мм, сложных контуров, отверстий и деталей с жёсткими допусками.' },
          { type: 'image', src: 'https://s3.datary-dev.ru/tp1219/metal/laser-cutting.jpg', alt: 'Лазерная и плазменная резка металла', caption: 'Лазерная резка металла — точный рез с чистой кромкой' },
          { type: 'text', text: 'Плазменная резка работает за счёт ионизированной струи газа, которая плавит металл. Она быстрее и дешевле лазера при толщине от 10–12 мм, но даёт более широкий рез и термически влияет на кромку. Оптимальна для грубого раскроя заготовок под сварку.' },
          { type: 'text', text: 'Вывод: для точных деталей и тонкого металла — лазер, для толстого листа и черновых заготовок — плазма. Правильный выбор метода экономит время на доработке и снижает себестоимость изделия.' },
        ],
        image: 'https://s3.datary-dev.ru/tp1219/metal/laser-cutting.jpg',
        readTime: '4 мин',
        tags: ['Лазерная резка', 'Плазма', 'Резка металла'],
        relatedItemIds: ['metal-service-laser-1', 'metal-service-laser-2', 'metal-service-proc-1'],
      },
      {
        id: 'metalworks-kb-2',
        title: 'Порошковая и жидкая покраска: какое покрытие выбрать для металла',
        excerpt: 'Два распространённых способа окраски металла дают разный результат по стойкости и применению.',
        contentBlocks: [
          { type: 'text', text: 'Порошковая покраска — нанесение сухого пигмента с последующим запеканием в печи при температуре 180–200°C. Полимерная плёнка, которая образуется в результате, не имеет подтёков, равномерна по толщине и устойчива к коррозии, истиранию и ультрафиолету. Идеальна для уличных конструкций, ограждений, металлической мебели.' },
          { type: 'image', src: 'https://s3.datary-dev.ru/tp1219/articles/poroshkovye_kraski_po_metallu_plyusy_i_minusy_33.jpg', alt: 'Порошковая покраска металлических изделий', caption: 'Нанесение порошкового покрытия на металл' },
          { type: 'text', text: 'Жидкая (эмалевая) покраска применяется там, где изделие не помещается в термокамеру из-за габаритов, или требуется многослойное покрытие с промежуточной сушкой. Также используется для локального восстановления покрытия при ремонте.' },
          { type: 'text', text: 'Главное отличие: порошок — долговечнее и прочнее, жидкая краска — гибче по условиям нанесения. Выбор зависит от размера изделия, условий эксплуатации и требований к внешнему виду.' },
        ],
        image: 'https://s3.datary-dev.ru/tp1219/articles/poroshkovye_kraski_po_metallu_plyusy_i_minusy_33.jpg',
        readTime: '4 мин',
        tags: ['Порошковая покраска', 'Покрытие металла', 'Финишная обработка'],
        relatedItemIds: ['metal-service-coat-1', 'metal-service-coat-2', 'metal-product-furniture-1'],
      },
      {
        id: 'metalworks-kb-3',
        title: 'Металлическая мебель для производства: заблуждения и реальность',
        excerpt: 'Почему металлические верстаки, стеллажи и шкафы — не просто «дорогой вариант».',
        contentBlocks: [
          { type: 'text', text: 'Деревянные верстаки и стеллажи в производственных помещениях быстро теряют форму: разбухают от влаги, впитывают масло, деформируются под нагрузкой и становятся источником пыли и пожарной опасности. Металлические аналоги в тех же условиях служат десятилетиями без потери прочности.' },
          { type: 'image', src: 'https://s3.datary-dev.ru/tp1219/metal/metallicheskie-stellazhi.jpg', alt: 'Металлические верстаки и стеллажи для производства', caption: 'Производственные металлические стеллажи под заказ' },
          { type: 'text', text: 'Изготовление под конкретные размеры позволяет вписать оборудование в любое пространство цеха или мастерской — нестандартные пролёты, низкие потолки, угловые зоны. Стандартные магазинные решения редко подходят для производственных помещений.' },
          { type: 'text', text: 'Металлическая мебель также проще в обслуживании: легко моется, не накапливает стружку в щелях, выдерживает статические нагрузки до нескольких тонн. Это не дороже — это выгоднее в перспективе.' },
        ],
        image: 'https://s3.datary-dev.ru/tp1219/metal/metallicheskie-stellazhi.jpg',
        readTime: '4 мин',
        tags: ['Верстаки', 'Металлическая мебель', 'Производство'],
        relatedItemIds: ['metal-product-furniture-1', 'metal-product-furniture-2', 'metal-product-furniture-3', 'metal-product-furniture-4'],
      },
      {
        id: 'metalworks-kb-4',
        title: 'TIG-сварка алюминия: почему это совсем не то же самое, что сварка стали',
        excerpt: 'Алюминий — второй по популярности конструкционный металл, но сварить его «как обычно» не получится. Всё дело в оксидной плёнке.',
        contentBlocks: [
          { type: 'text', text: 'Алюминий мгновенно покрывается оксидной плёнкой (Al₂O₃), как только соприкасается с воздухом. Эта плёнка плавится при 2050 °C — в три раза выше, чем сам алюминий (660 °C). Если просто поднести горелку, металл под плёнкой расплавится и вытечет, пока оксидный «панцирь» будет держать форму. Именно поэтому алюминий не варят на постоянном токе прямой полярности — так работают со сталью.' },
          { type: 'image', src: 'https://s3.datary-dev.ru/tp1219/articles/metalworks-kb-4-tig-welding.jpg', alt: 'TIG-сварка алюминия на переменном токе', caption: 'TIG-сварка на переменном токе: один полупериод чистит оксид, другой плавит металл' },
          { type: 'text', text: 'TIG на переменном токе (AC) решает проблему за счёт двух полупериодов. В полупериоде обратной полярности (DCEP) электрон бомбардировка поверхности разрушает оксидную плёнку — это видно визуально: перед дугой бежит светлая «дорожка очистки». В полупериоде прямой полярности (DCEN) идёт основной нагрев и плавление металла. Это уникальная особенность, которой нет при сварке стали.' },
          { type: 'text', text: 'Важно: для алюминия используется только инертный газ — аргон или аргон + гелий. CO₂ и его смеси, которые применяют для полуавтомата по стали, недопустимы — они окислят шов. Также обязательна тщательная зачистка поверхности (обезжириватель, щётка из нержавейки), иначе загрязнения попадут в шов. Сварка алюминия тоньше 2 мм — задача для опытного сварщика: металл перегревается мгновенно, и шов прогорает.' },
          { type: 'text', text: 'Вывод: если вам нужна сварка алюминиевых конструкций, рамок, корпусов или профилей — уточняйте у исполнителя, есть ли у него TIG на AC и опыт работы с алюминием. Это принципиально другое оборудование и принципиально другой навык.' },
        ],
        image: 'https://s3.datary-dev.ru/tp1219/articles/metalworks-kb-4-tig-welding.jpg',
        readTime: '5 мин',
        tags: ['Сварка алюминия', 'TIG', 'Аргонодуговая сварка'],
        relatedItemIds: ['metal-service-weld-1', 'metal-service-weld-2'],
      },
      {
        id: 'metalworks-kb-5',
        title: 'Гибка и вальцовка: в чём разница и как правильно поставить задачу',
        excerpt: 'Оба процесса изгибают металл, но дают принципиально разный результат. Путаница в терминах приводит к неверному расчёту и переделкам.',
        contentBlocks: [
          { type: 'text', text: 'Гибка (листогибочный пресс, press brake) — это создание чётких угловых изломов. Пуансон вдавливает лист в V-образную матрицу, получая угол: 90°, 45°, 135° или произвольный. Минимальный внутренний радиус при гибке равен примерно толщине металла. Итог — прямые грани со складкой. Это то, что нужно для коробов, корпусов, кронштейнов.' },
          { type: 'image', src: 'https://s3.datary-dev.ru/tp1219/articles/metalworks-kb-5-press-brake.jpg', alt: 'Листогибочный пресс — гибка металла под угол', caption: 'Листогибочный пресс формирует чёткие угловые сгибы' },
          { type: 'text', text: 'Вальцовка — это протяжка листа через три вала, что создаёт плавный равномерный изгиб по всей длине. Результат — цилиндр, конус, сегмент дуги. Использовать листогиб для получения дуги нельзя — он делает только угол. Вальцы дают минимальный диаметр цилиндра, зависящий от диаметра валов станка и толщины листа.' },
          { type: 'text', text: 'Самая частая ошибка в заявках: «согните лист в дугу» или «нужна полукруглая деталь». Это всегда вальцовка, не гибка. И наоборот: «загните уголок» или «нужна П-образная полочка» — это всегда гибка. Если в ТЗ написано просто «согнуть», исполнитель спросит уточнение, а это время. Правильная формулировка — «вальцовка в цилиндр диаметром 400 мм» или «гибка под 90° с отступом 50 мм».' },
          { type: 'text', text: 'Ещё один момент: трубы и профиль гнут на трубогибе — это третий инструмент. Листогиб и вальцы работают только с плоским листом. Если нужен изогнутый квадратный профиль — уточняйте, есть ли у мастерской трубогиб нужного типоразмера.' },
        ],
        image: 'https://s3.datary-dev.ru/tp1219/articles/metalworks-kb-5-press-brake.jpg',
        readTime: '4 мин',
        tags: ['Гибка металла', 'Вальцовка', 'Листогиб'],
        relatedItemIds: ['metal-service-proc-1', 'metal-service-proc-2', 'metal-service-laser-1'],
      },
      {
        id: 'metalworks-kb-6',
        title: 'Чёрный металл на улице без покрытия: сколько проживёт и почему это не вариант',
        excerpt: 'Необработанная сталь ржавеет быстрее, чем многие думают. Разбираем цифры по скорости коррозии и объясняем, почему ржавчина — не защитный слой.',
        contentBlocks: [
          { type: 'text', text: 'Ржавчина — не патина. Медь и бронза со временем покрываются плотным оксидом, который защищает металл от дальнейшего окисления. У железа всё иначе: оксид Fe₂O₃ рыхлый и пористый, он не защищает металл, а лишь задерживает воду внутри, ускоряя коррозию. Слой ржавчины продолжает расти, пока не съедает металл насквозь.' },
          { type: 'image', src: 'https://s3.datary-dev.ru/tp1219/articles/metalworks-kb-6-rust.jpg', alt: 'Коррозия незащищённого металла', caption: 'Незащищённая сталь в уличных условиях теряет до 0,3 мм в год' },
          { type: 'text', text: 'Скорость коррозии углеродистой стали без покрытия: в сельской местности — 0,01–0,05 мм/год, в городской и промышленной среде — 0,1–0,3 мм/год, в морском климате — до 0,5 мм/год. При стандартной толщине листа 3–4 мм это означает: через 10–15 лет в городе металл потеряет до 25–30% сечения. Конструктивная прочность при этом снижается непропорционально — особенно в сварных узлах и точках крепления.' },
          { type: 'text', text: 'Методы защиты по убыванию стойкости: горячее цинкование (покрытие 45–85 мкм, срок службы 25–50 лет), порошковая окраска по грунту (60–120 мкм, 10–20 лет), холодное цинкование + финишная эмаль (8–15 лет), грунт-эмаль в два слоя (5–10 лет). Выбор метода зависит от условий эксплуатации, бюджета и того, будет ли возможность перекрасить конструкцию через несколько лет.' },
          { type: 'text', text: 'Ни один из этих методов не даёт вечной защиты, но разница между «ничего» и «хотя бы грунт-эмаль» — это разница между 1–2 годами и 7–10 годами до первого серьёзного обслуживания. Для уличных конструкций, заборов, навесов, ворот — покрытие не опция, а часть изделия.' },
        ],
        image: 'https://s3.datary-dev.ru/tp1219/articles/metalworks-kb-6-rust.jpg',
        readTime: '5 мин',
        tags: ['Коррозия металла', 'Покрытие', 'Цинкование'],
        relatedItemIds: ['metal-service-coat-1', 'metal-service-coat-2', 'metal-product-structures-1', 'metal-product-structures-3'],
      },
      {
        id: 'metalworks-kb-7',
        title: 'Что должно быть в техзадании на металлоизделие: минимум для точного расчёта',
        excerpt: 'Без чёткого ТЗ мастер додумает недостающие параметры сам — и изделие выйдет технически правильным, но не тем, что вы имели в виду.',
        contentBlocks: [
          { type: 'text', text: 'Три уровня точности в ТЗ: описание словами («нужна металлическая полка»), эскиз с размерами на бумаге, и конструкторский чертёж с допусками по ГОСТ. Для большинства заказов достаточно второго уровня. Главное — понять, какие параметры обязательны, а какие мастер определит сам без потери качества.' },
          { type: 'image', src: 'https://s3.datary-dev.ru/tp1219/articles/metalworks-kb-7-blueprint.jpg', alt: 'Технический чертёж металлоизделия с размерами и допусками', caption: 'Эскиз с габаритами и материалом — минимум для точного расчёта' },
          { type: 'text', text: 'Обязательно указывайте: габаритные размеры (длина, ширина, высота) и допустимое отклонение (±1 мм или «примерно»), толщину металла или нагрузочные требования (из которых исполнитель подберёт толщину), наличие и диаметр отверстий, способ соединения (сварка, болтовое), финишное покрытие. Если изделие крепится к чему-то — укажите размер зоны крепления и межосевые расстояния.' },
          { type: 'text', text: 'Не обязательно указывать: технологию резки (лазер или плазма — мастер выбирает сам), порядок операций и последовательность гибок, марку стали (если не критично — подойдёт Ст3 или аналог), тип сварочного шва (если нет нагрузочных требований по ГОСТ). Перегруженное ТЗ с избыточными требованиями усложняет расчёт и может поднять цену без реальной пользы.' },
          { type: 'text', text: 'Классы точности по ГОСТ 30893.1: «грубый» (класс v) — ±0,5–4,0 мм, «средний» (класс m) — ±0,1–2,0 мм, «точный» (класс f) — ±0,05–0,5 мм. Большинство бытовых и промышленных конструкций — класс m. Если допуск не указан, мастер применит именно его. Если вам нужнее «грубый» — говорите, цена будет ниже; если «точный» — тоже говорите, иначе не получите.' },
        ],
        image: 'https://s3.datary-dev.ru/tp1219/articles/metalworks-kb-7-blueprint.jpg',
        readTime: '5 мин',
        tags: ['Техническое задание', 'Допуски', 'Металлоизделия'],
        relatedItemIds: ['metal-service-design-1', 'metal-service-design-2', 'metal-service-laser-1', 'metal-service-laser-2'],
      },
      {
        id: 'metalworks-kb-8',
        title: 'Почему деталь трескается на сгибе: минимальный радиус и направление проката',
        excerpt: '«Согните по линии» — недостаточно. Радиус гиба, направление проката и отступ отверстия решают, будет деталь целой или с трещиной.',
        contentBlocks: [
          { type: 'text', text: 'При гибке наружный слой металла растягивается, внутренний — сжимается. Если радиус гиба меньше допустимого для этой марки и толщины, наружные волокна не выдерживают деформации: появляется трещина или «апельсиновая корка». Практическое правило для конструкционной стали — минимальный внутренний радиус равен толщине листа (r ≥ s), для нержавеющей стали — 1–1,5s, для алюминиевых сплавов серий 5000 и 6000 — от 1,5 до 3s в зависимости от состояния поставки (отожжённый или нагартованный).' },
          { type: 'image', src: '', alt: 'Гибка листового металла на листогибочном прессе', caption: 'Радиус гиба и толщина листа определяют, выдержит ли наружный слой деформацию' },
          { type: 'text', text: 'Второй фактор — направление проката. Лист имеет волокнистую структуру, унаследованную от прокатки. Гиб поперёк волокна металл переносит нормально, гиб вдоль волокна — заметно хуже: именно так появляется большинство трещин на нержавейке и алюминии. Если деталь имеет несколько гибов в разных направлениях, ориентацию заготовки в раскрое подбирают компромиссно, а для ответственных изделий направление проката указывают прямо в чертеже.' },
          { type: 'text', text: 'Третья причина брака — отверстия и вырезы рядом с линией гиба. При деформации отверстие, попавшее в зону гиба, вытягивается в овал, а перемычка между отверстием и краем рвётся. Безопасный отступ от края отверстия до линии гиба — не менее 2,5 толщины листа плюс радиус гиба. Если по конструкции отверстие обязано быть ближе, его либо сверлят после гибки, либо делают технологическую просечку на линии гиба.' },
          { type: 'text', text: 'Наконец — развёртка. Длина заготовки не равна сумме длин полок: часть металла «уходит» на радиус. Расчёт ведётся через нейтральную линию и k-фактор (для стали обычно 0,33–0,45 в зависимости от отношения r/s). Плоский контур, экспортированный из CAD без учёта k-фактора для конкретного инструмента, даёт деталь на 0,5–2 мм короче или длиннее. Поэтому надёжнее передавать 3D-модель или чертёж с указанием гибов и радиусов — развёртку под наше оборудование мы построим сами.' },
        ],
        image: '',
        readTime: '5 мин',
        tags: ['Гибка', 'Радиус гиба', 'Развёртка'],
        relatedItemIds: ['metal-service-proc-1', 'metal-service-design-1', 'metal-service-weld-2'],
      },
      {
        id: 'metalworks-kb-9',
        title: 'Нержавейка «поржавела»: откуда рыжие точки после резки и сварки',
        excerpt: 'Нержавеющая сталь не корродирует только при целой оксидной плёнке. Разбираем, что разрушает её прямо на производстве.',
        contentBlocks: [
          { type: 'text', text: 'Коррозионная стойкость нержавеющей стали обеспечивается не составом как таковым, а тонкой плёнкой оксида хрома толщиной в несколько нанометров, которая самовосстанавливается на воздухе. Для её образования нужно не менее 10,5 % хрома в сплаве (в AISI 304 — около 18 %). Пока плёнка цела, металл пассивен. Как только она нарушена и не может восстановиться, начинается локальная коррозия — внешне это выглядит как рыжие точки и подтёки на «нержавейке».' },
          { type: 'image', src: '', alt: 'Рыжие точки коррозии на поверхности нержавеющей стали после обработки', caption: 'Точечная коррозия на нержавейке — почти всегда следствие нарушенной оксидной плёнки' },
          { type: 'text', text: 'Самая частая причина на производстве — занос частиц углеродистой стали. Достаточно резать нержавейку на том же столе, зачищать той же щёткой или хранить рядом с чёрным металлом: микроскопические частицы стали внедряются в поверхность, ржавеют сами и разрушают плёнку под собой. Поэтому для нержавеющей стали используют отдельный инструмент, щётки из нержавеющей проволоки и не кладут заготовки на стол, где резали чёрный металл.' },
          { type: 'text', text: 'Вторая причина — сварка. В зоне термического влияния при 450–850 °C хром связывается с углеродом в карбиды по границам зёрен, обедняя прилегающие участки хромом. Это межкристаллитная коррозия. Защита — стали с низким содержанием углерода (марки с индексом L: 304L, 316L) или стабилизированные титаном и ниобием (321, 347), плюс контроль погонной энергии и охлаждение шва. Цвета побежалости у шва — это уже утолщённый и неполноценный оксид, он тоже подлежит удалению.' },
          { type: 'text', text: 'Восстановление стойкости после обработки — травление и пассивация. Травильная паста снимает окалину и цвета побежалости, пассивирующий состав (на основе азотной или лимонной кислоты) ускоряет формирование новой плёнки хрома. Механическая зачистка без последующей пассивации даёт красивую поверхность, но не восстанавливает защиту в полной мере. Если изделие работает во влажной среде или на улице, эти операции стоит закладывать в заказ сразу.' },
        ],
        image: '',
        readTime: '5 мин',
        tags: ['Нержавеющая сталь', 'Коррозия', 'Сварка'],
        relatedItemIds: ['metal-service-laser-1', 'metal-service-weld-1', 'metal-service-weld-2'],
      },
      {
        id: 'metalworks-kb-10',
        title: 'Файл для лазерной резки: что такое ширина реза и почему деталь вышла на 0,2 мм меньше',
        excerpt: 'Отправить DXF недостаточно. Что проверить в файле, чтобы деталь получилась той, что задумана.',
        contentBlocks: [
          { type: 'text', text: 'Луч лазера имеет физическую ширину: он не «разделяет» металл по линии, а выжигает канавку шириной 0,1–0,4 мм в зависимости от толщины материала, мощности и фокуса. Эта канавка называется шириной реза (kerf). Станок компенсирует её автоматически, смещая траекторию на половину ширины реза наружу или внутрь контура — но только если в файле однозначно понятно, где деталь, а где отход.' },
          { type: 'image', src: '', alt: 'Подготовка DXF-файла для лазерной резки металла', caption: 'Замкнутые контуры и корректная геометрия — условие точного реза' },
          { type: 'text', text: 'Отсюда первое требование: все контуры должны быть замкнутыми, без разрывов, наложений и дублирующихся линий. Разомкнутый контур станок не может интерпретировать как границу детали, а два наложенных отрезка приводят к повторному проходу луча по одному месту. Второе требование — тексты и логотипы переводятся в кривые: шрифт, которого нет на рабочей станции, подставится другим или исчезнет.' },
          { type: 'text', text: 'Есть и геометрические ограничения самого процесса. Минимальный диаметр отверстия примерно равен толщине листа: в отверстии меньшего диаметра луч не успевает вывести расплав, край получается рваным. Минимальная ширина перемычки между вырезами — от 1 до 1,5 толщины, иначе узкий участок перегревается и деформируется. Острый внутренний угол всегда получает небольшой радиус — это физика пятна фокусировки, а не небрежность.' },
          { type: 'text', text: 'Что прислать, чтобы расчёт был точным: DXF или DWG в масштабе 1:1 в миллиметрах, отдельно — марку и толщину материала, количество, требования к кромке (нужна ли зачистка) и наличие гибов. Если деталь потом гнётся, присылайте 3D-модель или чертёж с гибами, а не готовую развёртку: развёртку под наше оборудование мы построим сами и учтём и ширину реза, и коэффициент гибки.' },
        ],
        image: '',
        readTime: '5 мин',
        tags: ['Лазерная резка', 'DXF', 'Подготовка файла'],
        relatedItemIds: ['metal-service-design-1', 'metal-service-laser-1', 'metal-service-design-2'],
      },
    ],
  },
  hydraulics: {
    residentSlug: 'hydraulics',
    intro: '',
    productCategories: [],
    products: [],
    serviceCategories: createCategories([
      ['manufacture', 'Изготовление РВД'],
      ['repair', 'Ремонт РВД'],
      ['auto-hose', 'Ремонт автомобильных шлангов'],
    ]),
    services: [
      // --- Изготовление РВД ---
      {
        id: 'hyd-service-manufacture-1',
        title: 'Изготовление РВД по образцу',
        categoryId: 'manufacture',
        shortDescription: 'Точное изготовление нового РВД по старому образцу',
        images: ['https://s3.datary-dev.ru/tp1219/main_content/6260433360.jpg'],
        description: 'Изготавливаем рукава высокого давления по предоставленному образцу с подбором совместимых фитингов и соблюдением параметров давления.',
        specs: [
          ['Срок', 'от 15 минут'],
          ['Диаметр', 'до 72 мм'],
          ['Типы РВД', 'стандартные и усиленные'],
          ['Фитинги', 'европейские и азиатские'],
          ['Совместимость', 'спецтехника и промышленность'],
        ],
      },
      {
        id: 'hyd-service-manufacture-2',
        title: 'Изготовление по чертежу',
        categoryId: 'manufacture',
        shortDescription: 'Производство РВД по чертежам и размерам',
        images: ['https://s3.datary-dev.ru/tp1219/main_content/832441-vms-Soedinenie-kontsevoe-razemnoe-rukavov-vyisokogo-davleniya-Holodilov.jpg'],
        description: 'Изготавливаем РВД по техническим чертежам, схемам и размерам с соблюдением требуемых характеристик.',
        specs: [
          ['Работа по чертежам', 'да'],
          ['Точность длины', 'высокая'],
          ['Давление', 'по спецификации'],
          ['Форматы', 'PDF, фото, эскиз'],
          ['Производство', 'индивидуальное'],
        ],
      },
      {
        id: 'hyd-service-manufacture-3',
        title: 'Изготовление по техническому заданию',
        categoryId: 'manufacture',
        shortDescription: 'Подбор и производство РВД под ваши задачи',
        images: ['https://s3.datary-dev.ru/tp1219/rvd/technical-project.jpeg'],
        description: 'Подбираем конструкцию рукава, фитинги и материалы под условия эксплуатации и рабочее давление.',
        specs: [
          ['Подбор компонентов', 'да'],
          ['Консультация', 'включена'],
          ['Сферы', 'техника и производство'],
          ['Материалы', 'маслобензостойкие'],
          ['Изготовление', 'индивидуальное'],
        ],
      },
      {
        id: 'hyd-service-manufacture-4',
        title: 'Производство нестандартных РВД',
        categoryId: 'manufacture',
        shortDescription: 'Изготовление сложных и нестандартных рукавов',
        images: ['https://s3.datary-dev.ru/tp1219/main_content/c3a2b85089f4a45e1d183928c5385f77.jpg'],
        description: 'Производим нестандартные РВД с редкими фитингами, нестандартной длиной и конфигурацией.',
        specs: [
          ['Нестандартные размеры', 'да'],
          ['Редкие фитинги', 'доступны'],
          ['Изготовление', 'под заказ'],
          ['Типы техники', 'любые'],
          ['Подбор аналогов', 'возможен'],
        ],
      },
      {
        id: 'hyd-service-manufacture-5',
        title: 'Изготовление длинномерных рукавов',
        categoryId: 'manufacture',
        shortDescription: 'Производство длинных РВД для спецтехники',
        images: ['https://s3.datary-dev.ru/tp1219/main_content/512_original.jpg'],
        description: 'Изготавливаем длинномерные рукава высокого давления для строительной, сельхоз и промышленной техники.',
        specs: [
          ['Большая длина', 'да'],
          ['Опрессовка', 'профессиональная'],
          ['Применение', 'спецтехника'],
          ['Проверка герметичности', 'да'],
          ['Изготовление', 'под заказ'],
        ],
      },
      {
        id: 'hyd-service-manufacture-6',
        title: 'Изготовление рукавов большого диаметра (тяжёлая серия)',
        categoryId: 'manufacture',
        shortDescription: 'РВД большого диаметра под высокие нагрузки',
        images: ['https://s3.datary-dev.ru/tp1219/main_content/334_1.jpg'],
        description: 'Производим рукава большого диаметра для тяжелой техники и промышленного оборудования.',
        specs: [
          ['Диаметр', 'до 72 мм'],
          ['Применение', 'промышленность'],
          ['Типы РВД', 'усиленные'],
          ['Высокое давление', 'да'],
          ['Совместимость', 'гидросистемы'],
        ],
      },
      {
        id: 'hyd-service-manufacture-7',
        title: 'Обжим РВД до 72 мм',
        categoryId: 'manufacture',
        shortDescription: 'Профессиональная опрессовка крупных фитингов',
        images: ['https://s3.datary-dev.ru/tp1219/main_content/obzim-rvd-1024x576.jpg'],
        description: 'Выполняем опрессовку фитингов и рукавов большого диаметра на профессиональном оборудовании.',
        specs: [
          ['Макс. диаметр', '72 мм'],
          ['Оборудование', 'промышленное'],
          ['Точность обжима', 'высокая'],
          ['Типы фитингов', 'разные'],
          ['Контроль качества', 'да'],
        ],
      },
      // --- Ремонт РВД ---
      {
        id: 'hyd-service-repair-1',
        title: 'Ремонт рукавов высокого давления',
        categoryId: 'repair',
        shortDescription: 'Восстановление работоспособности РВД',
        images: ['https://s3.datary-dev.ru/tp1219/main_content/vstavit-pered-3-abzatsem-zagolovka-priznaki-neispravnosti-RVD-_min.webp'],
        description: 'Ремонтируем поврежденные РВД с заменой фитингов, участков и восстановлением герметичности.',
        specs: [
          ['Срочный ремонт', 'да'],
          ['Замена фитингов', 'доступна'],
          ['Проверка давления', 'да'],
          ['Типы РВД', 'любые'],
          ['Сферы', 'техника и производство'],
        ],
      },
      {
        id: 'hyd-service-repair-2',
        title: 'Замена фитингов',
        categoryId: 'repair',
        shortDescription: 'Быстрая замена поврежденных фитингов',
        images: ['https://s3.datary-dev.ru/tp1219/main_content/PHX35508027.jpg'],
        description: 'Меняем неисправные фитинги с последующей опрессовкой и проверкой герметичности.',
        specs: [
          ['Опрессовка', 'включена'],
          ['Типы фитингов', 'разные'],
          ['Срок', 'от 15 минут'],
          ['Проверка герметичности', 'да'],
          ['Совместимость', 'любая техника'],
        ],
      },
      {
        id: 'hyd-service-repair-3',
        title: 'Замена поврежденного участка',
        categoryId: 'repair',
        shortDescription: 'Локальный ремонт поврежденного РВД',
        images: ['https://s3.datary-dev.ru/tp1219/main_content/hydraulic-hose-damage-1024x576.webp'],
        description: 'Удаляем поврежденный участок рукава и восстанавливаем работоспособность магистрали.',
        specs: [
          ['Ремонт участка', 'да'],
          ['Сохранение фитингов', 'возможно'],
          ['Испытание', 'проводится'],
          ['Срок', 'минимальный'],
          ['Экономия', 'дешевле нового'],
        ],
      },
      {
        id: 'hyd-service-repair-6',
        title: 'Наращивание длины РВД',
        categoryId: 'repair',
        shortDescription: 'Увеличение длины гидравлического рукава',
        images: ['https://s3.datary-dev.ru/tp1219/main_content/unnamed.jpg'],
        description: 'Удлиняем существующие РВД с сохранением рабочих характеристик и герметичности.',
        specs: [
          ['Удлинение', 'да'],
          ['Проверка давления', 'да'],
          ['Совместимость', 'высокая'],
          ['Опрессовка', 'выполняется'],
          ['Срок', 'от 20 минут'],
        ],
      },
      {
        id: 'hyd-service-repair-7',
        title: 'Укорачивание РВД',
        categoryId: 'repair',
        shortDescription: 'Укорачивание и переобжим рукава',
        images: ['https://s3.datary-dev.ru/tp1219/main_content/unnamed.jpg'],
        description: 'Укорачиваем поврежденные или длинные рукава с повторной опрессовкой фитингов.',
        specs: [
          ['Переобжим', 'включен'],
          ['Сохранение фитингов', 'возможно'],
          ['Контроль герметичности', 'да'],
          ['Срок', 'быстрый'],
          ['Диаметр', 'до 72 мм'],
        ],
      },
      // --- Ремонт автомобильных шлангов ---
      {
        id: 'hyd-service-auto-1',
        title: 'Ремонт шлангов ГУР',
        categoryId: 'auto-hose',
        shortDescription: 'Восстановление шлангов гидроусилителя руля',
        images: ['https://s3.datary-dev.ru/tp1219/main_content/6132071880.jpg'],
        description: 'Ремонтируем и изготавливаем шланги ГУР для легковых и грузовых автомобилей.',
        specs: [
          ['Автомобили', 'легковые и грузовые'],
          ['Проверка герметичности', 'да'],
          ['Срочный ремонт', 'возможен'],
          ['Подбор фитингов', 'да'],
          ['Изготовление', 'под заказ'],
        ],
      },
      {
        id: 'hyd-service-auto-2',
        title: 'Ремонт трубок ГУР',
        categoryId: 'auto-hose',
        shortDescription: 'Ремонт и восстановление трубок ГУР',
        images: ['https://s3.datary-dev.ru/tp1219/main_content/6694674094.jpg'],
        description: 'Восстанавливаем трубки гидроусилителя с заменой соединений и поврежденных участков.',
        specs: [
          ['Замена участков', 'да'],
          ['Проверка давления', 'да'],
          ['Сварка и соединение', 'возможно'],
          ['Авто', 'любые марки'],
          ['Срок', 'быстрый'],
        ],
      },
      {
        id: 'hyd-service-auto-3',
        title: 'Ремонт шлангов АКПП',
        categoryId: 'auto-hose',
        shortDescription: 'Ремонт магистралей автоматической коробки',
        images: ['https://s3.datary-dev.ru/tp1219/main_content/orig (1).webp'],
        description: 'Ремонтируем и заменяем шланги охлаждения и магистрали АКПП.',
        specs: [
          ['АКПП', 'любые типы'],
          ['Маслостойкие материалы', 'да'],
          ['Проверка герметичности', 'да'],
          ['Замена фитингов', 'возможна'],
          ['Срочный ремонт', 'да'],
        ],
      },
      {
        id: 'hyd-service-auto-4',
        title: 'Ремонт шлангов автокондиционеров',
        categoryId: 'auto-hose',
        shortDescription: 'Восстановление магистралей кондиционера',
        images: ['https://s3.datary-dev.ru/tp1219/main_content/025_original.jpg'],
        description: 'Ремонтируем шланги автокондиционеров с заменой фитингов и поврежденных участков.',
        specs: [
          ['Автокондиционеры', 'любые'],
          ['Замена фитингов', 'да'],
          ['Герметичность', 'проверяется'],
          ['Материалы', 'специализированные'],
          ['Срок', 'от 30 минут'],
        ],
      },
      {
        id: 'hyd-service-auto-5',
        title: 'Изготовление тормозных трубок',
        categoryId: 'auto-hose',
        shortDescription: 'Производство тормозных трубок под размер',
        images: ['https://s3.datary-dev.ru/tp1219/main_content/Tormoznye-trubki-funkcii-zamena-i-remont-e1565698594699.jpg'],
        description: 'Изготавливаем тормозные трубки по образцу или размерам для различных автомобилей.',
        specs: [
          ['Изготовление по образцу', 'да'],
          ['Материалы', 'прочные'],
          ['Автомобили', 'любые'],
          ['Подгонка длины', 'точная'],
          ['Срок', 'быстрый'],
        ],
      },
    ],
    galleryCaption: ['Изготовление РВД', 'Ремонт и обжим', 'Сервисная зона'],
    knowledgeArticles: [
      {
        id: 'hydraulics-kb-1',
        title: 'РВД по образцу или по чертежу: как правильно передать задачу',
        excerpt: 'Что нужно подготовить, чтобы получить точно подходящий рукав высокого давления.',
        contentBlocks: [
          { type: 'text', text: 'Рукав высокого давления должен точно соответствовать технике, условиям работы и типу соединений. Ошибка даже в нескольких миллиметрах может привести к утечкам, падению давления или быстрому износу. Поэтому при заказе важно максимально точно передать исходные данные.' },
          { type: 'text', text: 'Если старый рукав сохранился — лучший вариант привезти его как образец. Специалист сможет определить длину, тип фитингов, диаметр, угол соединений и подобрать аналог без лишних догадок.' },
          { type: 'image', src: 'https://s3.datary-dev.ru/tp1219/articles/scale_1200.png', alt: 'Изготовление РВД по образцу', caption: 'Передача образца для изготовления' },
          { type: 'text', text: 'Если образца нет, потребуется чертёж или подробное описание. Желательно указать:' },
          { type: 'text', text: '- внутренний диаметр рукава;' },
          { type: 'text', text: '- рабочее давление;' },
          { type: 'text', text: '- общую длину;' },
          { type: 'text', text: '- тип и размер фитингов;' },
          { type: 'text', text: '- угол фитингов (прямой, 45°, 90°);' },
          { type: 'text', text: '- условия эксплуатации — масло, вода, химия, температура.' },
          { type: 'text', text: 'Чем подробнее информация, тем быстрее и точнее будет изготовление. Особенно это важно для спецтехники, промышленного оборудования и нестандартных гидравлических систем.' },
          { type: 'image', src: 'https://s3.datary-dev.ru/tp1219/articles/obshaya_rvd_izmerenie.png', alt: 'Схема с обозначением длины, диаметра и типов фитингов на РВД', caption: 'Схема с обозначением длины, диаметра и типов фитингов на РВД' },
          { type: 'text', text: 'При передаче размеров важно учитывать, от какой точки измеряется длина — по фитингам, по оси или по рабочей части рукава. Неправильно снятый размер часто становится причиной того, что рукав невозможно установить без перегиба или натяжения.' },
          { type: 'text', text: 'Даже если точных данных нет, стоит сделать несколько фотографий места установки и соединений. Это поможет специалистам подобрать оптимальное решение и избежать ошибок при изготовлении.' },
          { type: 'text', text: '' },
        ],
        image: 'https://s3.datary-dev.ru/tp1219/articles/obshaya_rvd_izmerenie.png',
        readTime: '5 мин',
        tags: ['РВД', 'Образец', 'Изготовление'],
        relatedItemIds: ['hyd-service-manufacture-1', 'hyd-service-manufacture-2', 'hyd-service-manufacture-3'],
      },
      {
        id: 'hydraulics-kb-2',
        title: 'Когда РВД можно отремонтировать, а когда нужна полная замена',
        excerpt: 'Распространённое заблуждение: любой порыв — это новый рукав. Это не всегда так.',
        contentBlocks: [
          { type: 'text', text: 'Ремонт РВД возможен, если повреждён только фитинг или локальный участок рукава, а сам шланг не деформирован. Замена фитинга с опрессовкой занимает 15–20 минут и обходится значительно дешевле нового рукава.' },
          { type: 'image', src: 'https://s3.datary-dev.ru/tp1219/main_content/vstavit-pered-3-abzatsem-zagolovka-priznaki-neispravnosti-RVD-_min.webp', alt: 'Диагностика и ремонт рукава высокого давления', caption: 'Диагностика состояния РВД перед ремонтом' },
          { type: 'text', text: 'Полная замена нужна при: грыжах и вздутиях на оболочке, расслоении внутреннего слоя, глубоких порезах до армирующего слоя, сильной деформации по всей длине или выработанном ресурсе по циклам давления. В гидравлике срок службы РВД определяется не годами, а количеством рабочих циклов — в зависимости от класса рукава и рабочего давления ресурс составляет от 200 000 до 1 000 000 циклов (ГОСТ Р ИСО 6945, SAE J517). Рукав с выработанным цикловым ресурсом ненадёжен даже после частичного ремонта — высокое давление может привести к разрыву в любой момент.' },
          { type: 'text', text: 'Главное правило: не откладывайте диагностику. Плановая замена всегда дешевле аварийного простоя техники.' },
        ],
        image: 'https://s3.datary-dev.ru/tp1219/main_content/vstavit-pered-3-abzatsem-zagolovka-priznaki-neispravnosti-RVD-_min.webp',
        readTime: '3 мин',
        tags: ['Ремонт РВД', 'Замена', 'Обслуживание'],
        relatedItemIds: ['hyd-service-repair-1', 'hyd-service-repair-2', 'hyd-service-repair-3'],
      },
      {
        id: 'hydraulics-kb-3',
        title: 'Почему размер и давление критически важны при заказе рукава',
        excerpt: 'Типичная ошибка — заказать «похожий» рукав вместо точного. Чем это чревато.',
        contentBlocks: [
          { type: 'text', text: 'Внутренний диаметр рукава определяет пропускную способность системы: слишком узкий — создаёт избыточное сопротивление потоку, слишком широкий — снижает рабочее давление. Оба варианта нарушают работу гидравлики.' },
          { type: 'image', src: 'https://s3.datary-dev.ru/tp1219/articles/obshaya_rvd_izmerenie.png', alt: 'Параметры рукава высокого давления', caption: 'Ключевые параметры РВД: диаметр, давление, длина' },
          { type: 'text', text: 'Рабочее давление РВД должно соответствовать или превышать давление в системе. Рукав с меньшим показателем быстро изнашивается и разрывается под нагрузкой — даже если внешне выглядит подходящим.' },
          { type: 'text', text: 'При заказе обязательно укажите: внутренний диаметр, рабочее давление, длину и тип фитингов. Если данных нет — привезите старый рукав. Специалист подберёт точный аналог без риска ошибки.' },
        ],
        image: 'https://s3.datary-dev.ru/tp1219/articles/obshaya_rvd_izmerenie.png',
        readTime: '3 мин',
        tags: ['Давление', 'Диаметр', 'Подбор РВД'],
        relatedItemIds: ['hyd-service-manufacture-6', 'hyd-service-manufacture-7', 'hyd-service-manufacture-4'],
      },
      {
        id: 'hydraulics-kb-4',
        title: 'Почему обычный РВД нельзя использовать в системе кондиционирования',
        excerpt: 'Шланг — он и есть шланг? Нет. Использование РВД вместо шланга кондиционера может привести к отказу системы уже через несколько недель.',
        contentBlocks: [
          { type: 'text', text: 'Главное заблуждение при ремонте автокондиционера — что подойдёт любой гибкий шланг высокого давления. Внешне рукав РВД и шланг кондиционера действительно похожи: оба гибкие, оба работают под давлением. Но конструктивно и материально это принципиально разные изделия, рассчитанные на разные рабочие среды.' },
          { type: 'image', src: 'https://s3.datary-dev.ru/tp1219/main_content/025_original.jpg', alt: 'Шланг системы автокондиционера', caption: 'Специализированный шланг автокондиционера с барьерным слоем' },
          { type: 'text', text: 'Шланг кондиционера работает с хладагентом (R134a, R1234yf и др.) и компрессорным маслом. Внутренний слой такого шланга изготавливается из специальной низкопроницаемой резины или имеет барьерный нейлоновый слой (т.н. barrier hose по SAE J2064). Этот слой препятствует диффузии молекул хладагента сквозь стенку шланга — процессу, который неизбежно происходит в любом эластомере без барьера.' },
          { type: 'text', text: 'Обычный РВД изготавливается с внутренним слоем из нефтестойкой резины (NBR или EPDM) — для работы с гидравлическим маслом, водой или топливом. Этот материал химически несовместим с хладагентами: молекулы R134a и особенно R1234yf диффундируют сквозь стенку за считаные недели. Результат — постепенная потеря хладагента без видимых утечек, снижение производительности, а затем полный отказ системы. Одновременно продукты деградации резины попадают в контур, засоряют расширительный клапан и компрессор.' },
          { type: 'text', text: 'Есть и конструктивная разница: давление в системе кондиционера на линии высокого давления достигает 20–28 бар, на низкой — 2–5 бар. Эти значения сами по себе укладываются в характеристики многих РВД. Но рабочая температура в подкапотном пространстве (+120…+150 °C у магистралей компрессора) в сочетании с вибрационными нагрузками быстро разрушает нестойкий к хладагенту эластомер.' },
          { type: 'text', text: 'Правильное решение — использовать только специализированные шланги кондиционера с барьерным слоем, соответствующие SAE J2064 (или аналогичным стандартам), с фитингами под конкретный тип хладагента. После ремонта обязательна вакуумная протяжка системы и заправка строго по норме — это позволяет проверить герметичность и исключить попадание влаги в контур.' },
        ],
        image: 'https://s3.datary-dev.ru/tp1219/main_content/025_original.jpg',
        readTime: '4 мин',
        tags: ['Автокондиционер', 'Хладагент', 'Шланги'],
        relatedItemIds: ['hyd-service-auto-4'],
      },
      {
        id: 'hydraulics-kb-5',
        title: 'Фитинги BSP, JIC и ORFS: почему нельзя смешивать резьбы в гидравлике',
        excerpt: 'Внешне похожие фитинги с разными стандартами резьбы дают течь даже при правильной затяжке.',
        contentBlocks: [
          { type: 'text', text: 'В гидравлике используются три основных стандарта трубных соединений: BSP (British Standard Pipe) с конической или параллельной резьбой, JIC (Joint Industry Council, 37°) с конусным уплотнением и ORFS (O-Ring Face Seal) с плоским торцом и резиновым кольцом. Внешне они могут быть похожи, но геометрия резьбы и угол уплотнения принципиально разные.' },
          { type: 'image', src: 'https://s3.datary-dev.ru/tp1219/articles/ChatGPT%20Image%209%20%D0%B8%D1%8E%D0%BB.%202026%20%D0%B3.%2C%2013_16_04.png', alt: 'Сравнение фитингов BSP, JIC и ORFS — разные стандарты резьбы', caption: 'Фитинги BSP, JIC, ORFS: один размер, разная геометрия уплотнения' },
          { type: 'text', text: 'Если соединить фитинг BSP с контргайкой под JIC — резьба закрутится, но уплотнение не создастся: угол конуса отличается на несколько градусов. При рабочем давлении 150–250 бар такое соединение немедленно даёт течь или разрывается через несколько рабочих циклов. Это одна из самых распространённых причин течи в гидросистемах после самостоятельного ремонта.' },
          { type: 'text', text: 'ORFS — наиболее герметичный стандарт: торцовое уплотнение резиновым кольцом не зависит от усилия затяжки, работает при высоком давлении и вибрационных нагрузках. Применяется в строительной технике, сельскохозяйственных машинах и промышленной гидравлике. При подборе фитинга всегда уточняйте стандарт, диаметр и шаг резьбы — три параметра, которые вместе однозначно определяют тип соединения.' },
        ],
        image: 'https://s3.datary-dev.ru/tp1219/articles/ChatGPT%20Image%209%20%D0%B8%D1%8E%D0%BB.%202026%20%D0%B3.%2C%2013_16_04.png',
        readTime: '4 мин',
        tags: ['Фитинги', 'BSP', 'JIC', 'ORFS'],
        relatedItemIds: ['hyd-service-manufacture-4', 'hyd-service-manufacture-5', 'hyd-service-manufacture-6'],
      },
      {
        id: 'hydraulics-kb-6',
        title: 'РВД «потеет» маслом, но не рвётся: что это значит и как долго ждать',
        excerpt: 'Масляная плёнка на поверхности шланга — это не «просто грязь». Это сигнал о надвигающемся разрыве.',
        contentBlocks: [
          { type: 'text', text: 'Потение рукава — это диффузия масла через внешнюю оболочку под действием давления. Происходит, когда внутренний слой (и промежуточные) начинают деградировать: теряют эластичность, расслаиваются или получают микроповреждения от усталости материала. Масло медленно проступает наружу — рукав выглядит целым, но его структура уже нарушена.' },
          { type: 'image', src: 'https://s3.datary-dev.ru/tp1219/articles/ChatGPT%20Image%209%20%D0%B8%D1%8E%D0%BB.%202026%20%D0%B3.%2C%2013_17_44.png', alt: 'Потение рукава высокого давления — признак деградации материала', caption: 'Масляная пропитка внешней оплётки — сигнал к немедленной замене' },
          { type: 'text', text: 'Разница между течью и потением: течь — это видимые капли или струйки масла в месте фитинга или повреждения. Потение — равномерная масляная плёнка по всей длине рукава или на отдельном участке. Течь устраняется заменой фитинга или зажима. Потение означает, что шланг надо менять целиком — немедленно, а не «в ближайшее время».' },
          { type: 'text', text: 'На практике потеющий рукав в нормальных условиях живёт ещё несколько десятков рабочих часов, но нагрузки непредсказуемы. При резком подъёме давления (удар, запуск под нагрузкой) деградированный рукав разрывается без предупреждения. Если заметили потение — остановите работу и замените рукав до следующего запуска, не откладывая на конец смены.' },
        ],
        image: 'https://s3.datary-dev.ru/tp1219/articles/ChatGPT%20Image%209%20%D0%B8%D1%8E%D0%BB.%202026%20%D0%B3.%2C%2013_17_44.png',
        readTime: '4 мин',
        tags: ['Диагностика РВД', 'Потение', 'Износ'],
        relatedItemIds: ['hyd-service-repair-1', 'hyd-service-repair-2', 'hyd-service-repair-3'],
      },
      {
        id: 'hydraulics-kb-7',
        title: 'Промывка гидросистемы после замены РВД: зачем и как это делается',
        excerpt: 'Новый рукав в грязной системе выходит из строя втрое быстрее. Промывка — не лишний шаг.',
        contentBlocks: [
          { type: 'text', text: 'После разрыва рукава в гидравлическую систему неизбежно попадают посторонние вещества: металлическая стружка от разрушения фитинга, частицы резины от деградировавшего шланга, иногда грязь и вода извне. Даже при быстрой замене часть загрязнений остаётся в гидробаке, фильтрах и распределителях.' },
          { type: 'image', src: 'https://s3.datary-dev.ru/tp1219/articles/ChatGPT%20Image%209%20%D0%B8%D1%8E%D0%BB.%202026%20%D0%B3.%2C%2013_19_57.png', alt: 'Промывка гидравлической системы после ремонта РВД', caption: 'Промывка системы — обязательный шаг после аварийного ремонта' },
          { type: 'text', text: 'Загрязнения в гидравлике — главная причина ускоренного износа. Частицы твёрдостью выше рабочих поверхностей насоса и распределителей действуют как абразив. Промывка выполняется прогоном масла через систему с открытыми дренажами при пониженном давлении — грязь выносится в сливную магистраль и задерживается фильтром.' },
          { type: 'text', text: 'На сложных системах (экскаваторы, краны, промышленные прессы) промывка — отдельная операция с заменой масла и проверкой фильтра. На простых машинах достаточно нескольких рабочих циклов при сниженной нагрузке с последующей заменой фильтрующего элемента. Игнорирование этого шага сокращает ресурс нового рукава в 2–3 раза.' },
        ],
        image: 'https://s3.datary-dev.ru/tp1219/articles/ChatGPT%20Image%209%20%D0%B8%D1%8E%D0%BB.%202026%20%D0%B3.%2C%2013_19_57.png',
        readTime: '4 мин',
        tags: ['Промывка', 'Обслуживание', 'Гидравлика'],
        relatedItemIds: ['hyd-service-repair-1', 'hyd-service-repair-3', 'hyd-service-manufacture-1'],
      },
      {
        id: 'hydraulics-kb-8',
        title: 'Нержавеющие фитинги для РВД: когда они необходимы, а когда — переплата',
        excerpt: 'Нержавейка в гидравлике — не всегда лучше. Разбираем, для каких сред она обязательна.',
        contentBlocks: [
          { type: 'text', text: 'Стандартные фитинги для РВД изготавливаются из углеродистой стали с цинковым покрытием. Это надёжное решение для гидравлических масел, дизельного топлива и воды при нормальных условиях. Срок службы покрытия — 5–10 лет в обычных условиях эксплуатации.' },
          { type: 'image', src: 'https://s3.datary-dev.ru/tp1219/articles/ChatGPT%20Image%209%20%D0%B8%D1%8E%D0%BB.%202026%20%D0%B3.%2C%2013_26_17.png', alt: 'Нержавеющие и стальные оцинкованные фитинги для РВД', caption: 'Нержавеющие фитинги — для агрессивных сред и пищевого производства' },
          { type: 'text', text: 'Нержавеющие фитинги (AISI 304 или 316) необходимы в четырёх случаях: пищевое производство и молочная промышленность (требования к гигиене поверхности), химические производства с агрессивными средами (кислоты, щёлочи, растворители), морская среда и повышенная влажность с соляным туманом, а также медицинское и фармацевтическое оборудование.' },
          { type: 'text', text: 'Для строительной техники, сельскохозяйственных машин, лесозаготовительного оборудования и промышленной гидравлики нержавейка избыточна и не оправдывает разницу в цене (в 2–4 раза дороже). Если среда — гидравлическое масло или минеральная основа — достаточно стандартных стальных фитингов с регулярным осмотром.' },
        ],
        image: 'https://s3.datary-dev.ru/tp1219/articles/ChatGPT%20Image%209%20%D0%B8%D1%8E%D0%BB.%202026%20%D0%B3.%2C%2013_26_17.png',
        readTime: '4 мин',
        tags: ['Нержавейка', 'Фитинги', 'Выбор материала'],
        relatedItemIds: ['hyd-service-manufacture-5', 'hyd-service-manufacture-7', 'hyd-service-manufacture-4'],
      },
      {
        id: 'hydraulics-kb-9',
        title: 'Радиус изгиба РВД: почему рукав рвётся не там, где давление, а там, где перегиб',
        excerpt: 'Рукав гибкий — но не бесконечно. Нарушенный радиус изгиба сокращает срок службы в разы и рвёт РВД у самого фитинга.',
        contentBlocks: [
          { type: 'text', text: 'У каждого рукава высокого давления есть паспортный минимальный радиус изгиба — он задаётся производителем для конкретного типа и диаметра. Для однооплёточного рукава 1SN DN12 это порядка 180 мм, для четырёхоплёточного 4SP DN25 — уже 400 мм и более. Это не рекомендация: при меньшем радиусе оплётка с внешней стороны растягивается, с внутренней сминается, слои начинают работать неравномерно, и рукав теряет расчётный ресурс.' },
          { type: 'image', src: '', alt: 'Правильный и неправильный радиус изгиба рукава высокого давления', caption: 'Перегиб у обжимной муфты — самая частая причина разрыва РВД' },
          { type: 'text', text: 'Самое опасное место — участок непосредственно у фитинга. Изгиб должен начинаться не ближе чем в полутора диаметрах рукава от края обжимной муфты: в этой зоне рукав жёстко зафиксирован и не может распределить деформацию. Именно поэтому большинство разрывов происходит не в середине, а в 3–5 см от наконечника. Если геометрия установки не позволяет вывести прямой участок, нужен угловой фитинг 45° или 90°, а не «подгиб» прямого.' },
          { type: 'text', text: 'Вторая частая ошибка — скручивание. РВД воспринимает давление только вдоль оси: скрутка всего на 5–7° снижает ресурс примерно вдвое, потому что нити оплётки начинают работать на сдвиг. При монтаже вращать нужно гайку, а не рукав, и контролировать положение продольной маркировочной полосы — она должна оставаться прямой по всей длине.' },
          { type: 'text', text: 'Третье — длина. Под давлением рукав меняет длину на величину от минус 4 до плюс 2 % в зависимости от конструкции. Натянутый в струну РВД при подаче давления получает осевую нагрузку на обжим, слишком длинный — провисает и трётся о раму. Правильный запас — небольшая свободная петля с сохранением минимального радиуса. Если вы снимаете размер с работающей машины, зафиксируйте положение рукава фотографией: по фото и образцу мы подберём и длину, и углы фитингов.' },
        ],
        image: '',
        readTime: '5 мин',
        tags: ['Радиус изгиба', 'Монтаж РВД', 'Ресурс'],
        relatedItemIds: ['hyd-service-manufacture-1', 'hyd-service-manufacture-3', 'hyd-service-repair-6'],
      },
      {
        id: 'hydraulics-kb-10',
        title: 'Можно ли срастить два рукава: правда о наращивании РВД',
        excerpt: '«Соединим муфтой и поедем» — самое распространённое и самое опасное решение при полевом ремонте гидравлики.',
        contentBlocks: [
          { type: 'text', text: 'Вопрос звучит почти каждый раз, когда рукав рвётся на технике в поле: нельзя ли отрезать повреждённый кусок и соединить оставшиеся части? Технически такое соединение возможно — через переходник с двумя наконечниками. Но это уже не единый рукав, а сборка с двумя дополнительными обжимами и двумя резьбовыми уплотнениями, каждое из которых является потенциальной точкой течи.' },
          { type: 'image', src: '', alt: 'Соединение двух рукавов высокого давления через переходник', caption: 'Соединитель добавляет два обжима и два уплотнения — четыре новые точки риска' },
          { type: 'text', text: 'Стоит различать три операции, которые часто путают. Наращивание длины — изготовление нового рукава большей длины или добавление участка через соединитель, когда изменилась геометрия установки. Замена повреждённого участка — корректная операция, если рукав длинномерный (10 м и более), а повреждение локальное: тогда стоимость соединителя оправдана. И полевое «сращивание» порванного рукава подручным переходником — временная мера, после которой рукав нужно заменить целиком.' },
          { type: 'text', text: 'Почему сращивание порванного рукава ненадёжно: разрыв практически никогда не бывает единственным дефектом. Он означает, что материал выработал ресурс по циклам давления, и оставшиеся части рукава уже деградировали. Кроме того, при разрыве в систему попадают частицы армирующей проволоки и резины — их нужно вымывать, а не запирать между двумя обжимами.' },
          { type: 'text', text: 'Практическое правило: если рукав короче 3 м, почти всегда дешевле и правильнее изготовить новый — это занимает 15–30 минут. Сращивание оправдано на длинномерных линиях, на рукавах большого диаметра тяжёлой серии и там, где замена целиком требует разбора машины. Решение принимается по конкретному рукаву — привезите его или пришлите фото места повреждения.' },
        ],
        image: '',
        readTime: '4 мин',
        tags: ['Наращивание РВД', 'Ремонт', 'Соединители'],
        relatedItemIds: ['hyd-service-repair-6', 'hyd-service-repair-3', 'hyd-service-repair-7'],
      },
      {
        id: 'hydraulics-kb-11',
        title: 'Тормозные трубки: почему медь — опасная экономия, а медно-никелевый сплав — нет',
        excerpt: 'Медная трубка гнётся руками и не ржавеет. Именно поэтому её ставят — и именно поэтому тормоза отказывают.',
        contentBlocks: [
          { type: 'text', text: 'Штатная тормозная магистраль изготавливается из стальной трубки с защитным покрытием — обычно меднением или полимерным слоем. Когда покрытие сгнивает и трубка начинает течь, возникает соблазн заменить её на чисто медную: она дешёвая, легко гнётся и не корродирует. Это опасное решение, и причина — не в коррозии.' },
          { type: 'image', src: '', alt: 'Тормозные трубки из стали и медно-никелевого сплава', caption: 'Медно-никелевый сплав сочетает удобство монтажа с усталостной прочностью' },
          { type: 'text', text: 'Чистая медь мягкая и пластичная, но у неё крайне низкая усталостная прочность при знакопеременных нагрузках. Тормозная магистраль работает в условиях постоянной вибрации и пульсаций давления до 100–180 бар при экстренном торможении. Медная трубка постепенно наклёпывается, становится хрупкой и трескается — как правило, у мест крепления и развальцовки, то есть без предупреждения и в самый нагруженный момент.' },
          { type: 'text', text: 'Корректная альтернатива стали — медно-никелевый сплав (около 90 % меди и 10 % никеля, известен как купроникель или под торговым названием Kunifer). Он сохраняет удобство монтажа: гнётся без нагрева и специального инструмента, но имеет усталостную прочность на порядок выше медной и не корродирует. Такие трубки соответствуют ISO 4038 и SAE J1047 и штатно применяются рядом автопроизводителей.' },
          { type: 'text', text: 'Не менее важна развальцовка. В тормозных системах используются два типа: DIN («грибок», тип E) и двойная развальцовка ISO/SAE (тип F). Они не взаимозаменяемы: соединение штуцера одного типа с раструбом другого создаёт кажущуюся герметичность, которая теряется при первом же экстренном торможении. При заказе трубки укажите наружный диаметр (обычно 4,75 или 6 мм), тип развальцовки, резьбу штуцеров и длину — либо привезите старую трубку как образец, по ней мы изготовим точную копию с правильной геометрией концов.' },
        ],
        image: '',
        readTime: '5 мин',
        tags: ['Тормозные трубки', 'Купроникель', 'Развальцовка'],
        relatedItemIds: ['hyd-service-auto-5', 'hyd-service-auto-2', 'hyd-service-auto-1'],
      },
    ],
  },
  driveshafts: {
    residentSlug: 'driveshafts',
    intro: '',
    productCategories: [],
    products: [],
    serviceCategories: createCategories([
      ['repair-restoration', 'Ремонт и восстановление карданных валов'],
      ['machining', 'Механическая обработка деталей'],
      ['metallization', 'Восстановление и напыление металла'],
      ['tire-service', 'Шиномонтаж и правка дисков'],
    ]),
    services: [
      {
        id: 'ds-service-repair-restoration-1',
        title: 'Ремонт карданного вала',
        categoryId: 'repair-restoration',
        shortDescription: 'Восстановление карданных валов легковой и грузовой техники',
        images: ['https://s3.datary-dev.ru/tp1219/kardan/s1.webp'],
        description: 'Комплексный ремонт карданных валов с разборкой, дефектовкой и заменой изношенных элементов. Выполняется восстановление посадочных мест, устранение люфтов, проверка геометрии и подготовка к балансировке. Работы проводятся для легковых автомобилей, коммерческого транспорта, спецтехники и промышленного оборудования.',
        specs: [
          ['Тип техники', 'Легковая и грузовая'],
          ['Диагностика', 'Входит в работу'],
          ['Разборка узла', 'Полная'],
          ['Контроль геометрии', 'Выполняется'],
          ['Балансировка', 'После ремонта'],
        ],
      },
      {
        id: 'ds-service-repair-restoration-2',
        title: 'Восстановление посадочных мест',
        categoryId: 'repair-restoration',
        shortDescription: 'Напыление и восстановление изношенных посадочных поверхностей',
        images: ['https://s3.datary-dev.ru/tp1219/kardan/272a377aa9c052dd7462624548bd6408.jpg'],
        description: 'Восстановление изношенных посадочных мест методом металлизации и механической обработки. Применяется для ремонта ушей кардана, посадок под подшипники и стопорные кольца. После напыления выполняется шлифовка и доведение размеров до требуемых параметров.',
        specs: [
          ['Метод восстановления', 'Напыление металла'],
          ['Обработка', 'Шлифовка'],
          ['Контроль размеров', 'Да'],
          ['Тип деталей', 'Посадочные поверхности'],
          ['Назначение', 'Восстановление износа'],
        ],
      },
      {
        id: 'ds-service-repair-restoration-3',
        title: 'Ремонт ушей кардана',
        categoryId: 'repair-restoration',
        shortDescription: 'Восстановление и обработка поврежденных ушей карданного вала',
        images: ['https://s3.datary-dev.ru/tp1219/kardan/Разрыв-ушей.jpg'],
        description: 'Ремонт ушей карданного вала с устранением выработки, трещин и деформаций. Используется напыление металла с последующей механической обработкой и восстановлением посадочных размеров. Работы позволяют продлить срок службы карданного узла без полной замены деталей.',
        specs: [
          ['Восстановление', 'Напыление металла'],
          ['Устранение трещин', 'Да'],
          ['Обработка', 'Механическая'],
          ['Контроль геометрии', 'Выполняется'],
          ['Тип работ', 'Восстановительные'],
        ],
      },
      {
        id: 'ds-service-repair-restoration-4',
        title: 'Замена крестовин карданного вала',
        categoryId: 'repair-restoration',
        shortDescription: 'Демонтаж и установка новых крестовин кардана',
        images: ['https://s3.datary-dev.ru/tp1219/kardan/kak-zamenit-krestovinu-kardannogo-vala.jpg'],
        description: 'Замена изношенных крестовин карданного вала с проверкой посадочных мест и состояния сопрягаемых элементов. После установки выполняется контроль люфтов и подготовка узла к балансировке. Работы проводятся с учетом технических параметров конкретного карданного вала.',
        specs: [
          ['Тип работ', 'Замена узла'],
          ['Контроль люфта', 'Да'],
          ['Проверка посадок', 'Выполняется'],
          ['Совместимость', 'По размерам'],
          ['Балансировка', 'Рекомендуется'],
        ],
      },
      {
        id: 'ds-service-repair-restoration-5',
        title: 'Балансировка карданного вала',
        categoryId: 'repair-restoration',
        shortDescription: 'Динамическая балансировка после ремонта и сборки',
        images: ['https://s3.datary-dev.ru/tp1219/kardan/unnamed-file.jpeg'],
        description: 'Балансировка карданных валов на специализированном оборудовании. Выполняется устранение дисбаланса после ремонта, замены элементов или восстановления геометрии. Процедура снижает вибрации, нагрузку на трансмиссию и повышает ресурс карданного узла.',
        specs: [
          ['Тип балансировки', 'Динамическая'],
          ['Оборудование', 'Балансировочный станок'],
          ['Назначение', 'Снижение вибраций'],
          ['Контроль', 'После ремонта'],
          ['Тип валов', 'Различные типоразмеры'],
        ],
      },
      {
        id: 'ds-service-machining-1',
        title: 'Шлифовка деталей карданного узла',
        categoryId: 'machining',
        shortDescription: 'Обработка и восстановление рабочих поверхностей деталей',
        images: ['https://s3.datary-dev.ru/tp1219/kardan/svarka-vilki-kardannogo-vala.jpg'],
        description: 'Шлифовка деталей карданного узла для восстановления геометрии и рабочих размеров. Выполняется обработка посадочных мест, стопорных канавок и сопрягаемых поверхностей после ремонта или напыления металла. Работы обеспечивают точную посадку и корректную работу узла.',
        specs: [
          ['Тип обработки', 'Шлифовка'],
          ['Назначение', 'Восстановление размеров'],
          ['Обрабатываемые детали', 'Карданные элементы'],
          ['Точность обработки', 'Высокая'],
          ['Применение', 'После восстановления'],
        ],
      },
      {
        id: 'ds-service-machining-2',
        title: 'Проточка канавок под стопорные кольца',
        categoryId: 'machining',
        shortDescription: 'Механическая проточка и восстановление канавок под стопорные кольца',
        images: ['https://s3.datary-dev.ru/tp1219/kardan/7376061916.jpg'],
        description: 'Выполняем проточку канавок под стопорные кольца на токарном станке с применением пилотного инструмента. При необходимости восстановления изношенных посадочных мест применяется накернивание с последующим обжатием под прессом. Обработка обеспечивает точное соответствие геометрии канавки стандартным размерам стопорного кольца и корректную его фиксацию в узле.',
        specs: [
          ['Тип работ', 'Проточка канавок'],
          ['Оборудование', 'Токарный станок, фрезер с пилотом, пресс'],
          ['Назначение', 'Под стопорные кольца'],
          ['Восстановление', 'Накернивание + обжатие под прессом'],
          ['Тип деталей', 'Карданные узлы'],
        ],
      },
      {
        id: 'ds-service-machining-3',
        title: 'Фрезерные работы',
        categoryId: 'machining',
        shortDescription: 'Механическая обработка деталей на фрезерном оборудовании',
        images: ['https://s3.datary-dev.ru/tp1219/kardan/frezerovka_valov.jpg'],
        description: 'Выполнение фрезерных работ при ремонте и восстановлении деталей карданных узлов и сопутствующих элементов. Производится обработка плоскостей, посадочных мест и отдельных участков деталей в рамках ремонтных операций.',
        specs: [
          ['Оборудование', 'Фрезерный станок'],
          ['Тип обработки', 'Механическая'],
          ['Назначение', 'Ремонт деталей'],
          ['Обрабатываемые элементы', 'Металлические детали'],
          ['Применение', 'Восстановительные работы'],
        ],
      },
      {
        id: 'ds-service-metallization-1',
        title: 'Металлизация деталей',
        categoryId: 'metallization',
        shortDescription: 'Напыление металла для восстановления изношенных поверхностей',
        images: ['https://s3.datary-dev.ru/tp1219/kardan/homepage-banner-1-1024x565.jpg'],
        description: 'Восстановление металлических поверхностей методом напыления с использованием порошковых составов. Технология применяется для устранения износа, локальных повреждений и подготовки деталей к последующей механической обработке. После металлизации выполняется доведение размеров шлифовкой.',
        specs: [
          ['Метод', 'Металлизация'],
          ['Материалы', 'Порошковые смеси'],
          ['Назначение', 'Восстановление износа'],
          ['Последующая обработка', 'Шлифовка'],
          ['Тип деталей', 'Металлические узлы'],
        ],
      },
      {
        id: 'ds-service-tire-service-1',
        title: 'Шиномонтаж колес',
        categoryId: 'tire-service',
        shortDescription: 'Монтаж и демонтаж колес на профессиональном оборудовании',
        images: ['https://s3.datary-dev.ru/tp1219/kardan/shinomintash.jpg'],
        description: 'Выполнение шиномонтажных работ с использованием специализированного оборудования. Производится демонтаж и установка шин, проверка состояния колес и подготовка к балансировке. Работы выполняются для легковых автомобилей и коммерческого транспорта.',
        specs: [
          ['Тип техники', 'Легковая и коммерческая'],
          ['Оборудование', 'Шиномонтажный станок'],
          ['Услуги', 'Монтаж и демонтаж'],
          ['Дополнительно', 'Балансировка'],
          ['Контроль состояния', 'Да'],
        ],
      },
      {
        id: 'ds-service-tire-service-2',
        title: 'Балансировка колес',
        categoryId: 'tire-service',
        shortDescription: 'Устранение дисбаланса колес после монтажа и ремонта',
        images: ['https://s3.datary-dev.ru/tp1219/kardan/756570945501362.jpg'],
        description: 'Балансировка колес на специализированном оборудовании для устранения вибраций и равномерной работы ходовой части. Выполняется после шиномонтажа, ремонта колес или сезонной замены шин.',
        specs: [
          ['Тип работ', 'Балансировка колес'],
          ['Оборудование', 'Балансировочный станок'],
          ['Назначение', 'Снижение вибраций'],
          ['Применение', 'После монтажа'],
          ['Тип колес', 'Различные размеры'],
        ],
      },
      {
        id: 'ds-service-tire-service-3',
        title: 'Правка колесных дисков',
        categoryId: 'tire-service',
        shortDescription: 'Восстановление геометрии поврежденных дисков',
        images: ['https://s3.datary-dev.ru/tp1219/kardan/11111111111.jfif'],
        description: 'Правка деформированных колесных дисков с восстановлением геометрии и рабочих параметров. Работы выполняются на специализированном оборудовании с контролем биения и состояния диска после правки. При наличии трещин или разрывов обода выполняем сварку диска с последующим контролем геометрии — восстановление проводится методом TIG-сварки для обеспечения герметичности и прочности сварного шва.',
        specs: [
          ['Тип работ', 'Правка и сварка дисков'],
          ['Назначение', 'Восстановление геометрии и герметичности'],
          ['Контроль биения', 'Да'],
          ['Сварка', 'TIG (аргонодуговая), при трещинах и разрывах обода'],
          ['Тип дисков', 'Металлические'],
        ],
      },
    ] satisfies ServiceSeed[],
    galleryCaption: ['Ремонт карданных валов', 'Балансировочный участок', 'Металлизация и мехобработка'],
    knowledgeArticles: [
      {
        id: 'driveshafts-kb-1',
        title: 'Как понять, что крестовины кардана изношены и пора их менять',
        excerpt: 'Люфт, вибрация и стук — симптомы, которые нельзя игнорировать.',
        contentBlocks: [
          { type: 'text', text: 'Крестовина — шарнирный узел карданного вала, который передаёт вращение под углом. При износе появляются характерные симптомы: металлический стук при трогании с места или переключении передач, вибрация на скорости 60–100 км/ч, рывки при разгоне.' },
          { type: 'image', src: 'https://s3.datary-dev.ru/tp1219/kardan/kak-zamenit-krestovinu-kardannogo-vala.jpg', alt: 'Замена крестовин карданного вала', caption: 'Замена крестовины с проверкой посадочных мест' },
          { type: 'text', text: 'Проверить крестовину можно вручную: поднять автомобиль и покачать вал в разных плоскостях. Ощутимый люфт — сигнал к замене. Игнорировать его опасно: разрушение крестовины на ходу повреждает тоннель кузова, КПП и мост.' },
          { type: 'text', text: 'После замены крестовин обязательно выполняется балансировка вала — без неё вибрация сохранится даже с новыми деталями. Также проверяются посадочные места: изношенные ушки кардана снижают ресурс новой крестовины.' },
        ],
        image: 'https://s3.datary-dev.ru/tp1219/kardan/kak-zamenit-krestovinu-kardannogo-vala.jpg',
        readTime: '4 мин',
        tags: ['Крестовины', 'Диагностика', 'Кардан'],
        relatedItemIds: ['ds-service-repair-restoration-4', 'ds-service-repair-restoration-1', 'ds-service-repair-restoration-5'],
      },
      {
        id: 'driveshafts-kb-2',
        title: 'Балансировка карданного вала: когда она обязательна',
        excerpt: 'Не каждый ремонт требует балансировки, но пропустить её в нужный момент — дорогое решение.',
        contentBlocks: [
          { type: 'text', text: 'Балансировка карданного вала необходима после любого ремонта, связанного с разборкой или заменой деталей: крестовин, фланцев, скользящего шлицевого соединения. Также она нужна, если появилась вибрация, которой раньше не было.' },
          { type: 'image', src: 'https://s3.datary-dev.ru/tp1219/articles/avto_remont_kardan_slider_4.jpg', alt: 'Балансировка карданного вала', caption: 'Динамическая балансировка карданного вала на стенде' },
          { type: 'text', text: 'Дисбаланс даже в 1–2 грамма на краю вала на высоких оборотах создаёт центробежную силу, сопоставимую с ударной нагрузкой. Это ускоренно изнашивает подшипники КПП, раздатки и заднего моста.' },
          { type: 'text', text: 'Балансировка выполняется на динамическом стенде: вал раскручивается до рабочих оборотов, прибор фиксирует дисбаланс и показывает, где и сколько металла нужно добавить или убрать. Процедура занимает 30–60 минут и многократно продлевает ресурс всей трансмиссии.' },
        ],
        image: 'https://s3.datary-dev.ru/tp1219/articles/avto_remont_kardan_slider_4.jpg',
        readTime: '4 мин',
        tags: ['Балансировка', 'Вибрация', 'Кардан'],
        relatedItemIds: ['ds-service-repair-restoration-5', 'ds-service-repair-restoration-1'],
      },
      {
        id: 'driveshafts-kb-3',
        title: 'Металлизация vs сварка при восстановлении деталей кардана',
        excerpt: 'Почему для восстановления посадочных мест чаще выбирают напыление, а не сварку.',
        contentBlocks: [
          { type: 'text', text: 'При ремонте карданного вала часто требуется восстановить изношенные посадочные места под подшипники или крестовины. Для этого применяются два метода: металлизация (термическое напыление) и сварка с последующей обработкой.' },
          { type: 'image', src: 'https://s3.datary-dev.ru/tp1219/kardan/272a377aa9c052dd7462624548bd6408.jpg', alt: 'Металлизация деталей карданного вала', caption: 'Восстановление посадочного места методом напыления металла' },
          { type: 'text', text: 'Металлизация предпочтительнее для точных посадок: температура напыления не превышает 80–120°C, поэтому деталь не деформируется и не меняет своей структуры. Сварка нагревает металл до 1500°C и выше — это создаёт риск коробления, особенно на тонкостенных деталях.' },
          { type: 'text', text: 'После напыления деталь шлифуется до проектного размера с точностью до 0,01 мм. Восстановленная поверхность по прочности и ресурсу сопоставима с новой, а стоимость ремонта значительно ниже замены всего узла.' },
        ],
        image: 'https://s3.datary-dev.ru/tp1219/kardan/272a377aa9c052dd7462624548bd6408.jpg',
        readTime: '4 мин',
        tags: ['Металлизация', 'Восстановление', 'Напыление'],
        relatedItemIds: ['ds-service-metallization-1', 'ds-service-metallization-2', 'ds-service-repair-restoration-2'],
      },
      {
        id: 'driveshafts-kb-4',
        title: 'Правка диска или замена: как понять, что ещё можно спасти',
        excerpt: 'Не каждый повреждённый диск нужно выбрасывать. Но есть дефекты, при которых правка противопоказана.',
        contentBlocks: [
          { type: 'text', text: 'Правка диска — это восстановление геометрии обода с помощью специального гидравлического оборудования. Допустима при деформации без нарушения целостности металла: боковые удары с вмятиной обода, лёгкое «восьмёрение» после попадания в яму, изменение плоскостности не более 3–5 мм на среднем диаметре.' },
          { type: 'image', src: 'https://s3.datary-dev.ru/tp1219/articles/ChatGPT%20Image%209%20%D0%B8%D1%8E%D0%BB.%202026%20%D0%B3.%2C%2013_23_45.png', alt: 'Правка колёсного диска после деформации', caption: 'Правка диска восстанавливает геометрию без замены — при отсутствии трещин' },
          { type: 'text', text: 'Замена обязательна при: трещинах в спицах или ободе, разрывах металла (даже небольших), разрушении зоны крепления шины, сильной деформации диска в зоне крепления к ступице. Трещина — не ремонтируемый дефект: под нагрузкой она развивается непредсказуемо, особенно при боковых нагрузках в поворотах.' },
          { type: 'text', text: 'Правка диска с трещиной с последующей сваркой — спорное решение. Формально это возможно (TIG-сварка алюминия или стальной сварной шов), но зона сварки имеет изменённую кристаллическую структуру и снижает прочность. Такой диск допустим только для очень лёгких нагрузок и должен регулярно осматриваться. На трассе и при полной нагрузке — нет.' },
        ],
        image: 'https://s3.datary-dev.ru/tp1219/articles/ChatGPT%20Image%209%20%D0%B8%D1%8E%D0%BB.%202026%20%D0%B3.%2C%2013_23_45.png',
        readTime: '4 мин',
        tags: ['Правка дисков', 'Диагностика', 'Колёса'],
        relatedItemIds: ['ds-service-tire-service-3', 'ds-service-tire-service-1'],
      },
      {
        id: 'driveshafts-kb-5',
        title: 'Шиномонтаж без балансировки: почему руль трясётся после замены резины',
        excerpt: 'Балансировка — не дополнительная услуга, а обязательная часть шиномонтажа. Объясняем физику.',
        contentBlocks: [
          { type: 'text', text: 'Дисбаланс возникает, когда центр масс колеса не совпадает с осью вращения. Даже небольшое смещение — 10–15 г на краю обода — при скорости 80–100 км/ч создаёт вращательную вибрацию с частотой 15–20 Гц. Именно она ощущается как тряска руля и вибрация кузова.' },
          { type: 'image', src: 'https://s3.datary-dev.ru/tp1219/articles/ChatGPT%20Image%209%20%D0%B8%D1%8E%D0%BB.%202026%20%D0%B3.%2C%2013_31_02.png', alt: 'Балансировка колёс на стенде после шиномонтажа', caption: 'Балансировочный стенд определяет дисбаланс с точностью до 1 грамма' },
          { type: 'text', text: 'Дисбаланс разного вида: статический (тяжёлое пятно на ободе) проявляется при любой скорости, динамический (два противоположных дисбаланса в разных плоскостях) заметен только на скорости. Балансировочный стенд измеряет оба типа одновременно и показывает, сколько и куда нужно добавить грузиков.' },
          { type: 'text', text: 'Последствия езды без балансировки: ускоренный износ протектора (неравномерные пятна), нагрузка на подшипники ступицы и рулевые тяги, вибрация в КПП и карданной передаче. Балансировка нужна при каждой смене резины, после правки диска и при появлении вибрации даже без сезонной смены шин.' },
        ],
        image: 'https://s3.datary-dev.ru/tp1219/articles/ChatGPT%20Image%209%20%D0%B8%D1%8E%D0%BB.%202026%20%D0%B3.%2C%2013_31_02.png',
        readTime: '4 мин',
        tags: ['Балансировка', 'Шиномонтаж', 'Вибрация'],
        relatedItemIds: ['ds-service-tire-service-2', 'ds-service-tire-service-1', 'ds-service-repair-restoration-5'],
      },
      {
        id: 'driveshafts-kb-6',
        title: 'После ремонта кардана осталась вибрация: три причины, которые не связаны с карданом',
        excerpt: 'Замена крестовин и балансировка вала сделаны, а вибрация никуда не ушла. Что искать дальше.',
        contentBlocks: [
          { type: 'text', text: 'Карданный вал — не единственный источник вибрации трансмиссии. Если после полного ремонта кардана (замена крестовин, балансировка) вибрация сохраняется, причина почти всегда в одном из трёх мест: изношенный эластичный муфта (Hardy Disc) между КПП и карданом, разбитый подвесной подшипник промежуточного вала, или деформация шлицевого соединения скользящей вилки.' },
          { type: 'image', src: 'https://s3.datary-dev.ru/tp1219/articles/ChatGPT%20Image%209%20%D0%B8%D1%8E%D0%BB.%202026%20%D0%B3.%2C%2013_28_01.png', alt: 'Диагностика трансмиссии после ремонта карданного вала', caption: 'Вибрация после ремонта кардана — ищите в шлицах и подвесном подшипнике' },
          { type: 'text', text: 'Подвесной подшипник (опора промежуточного вала) — резинометаллический узел, который крепится к кузову и поглощает вибрации. При износе резиновой части подшипник теряет демпфирующие свойства, возникает резонанс. Замена стоит недорого, но диагностировать его износ снаружи сложно — нужна проверка на подъёмнике.' },
          { type: 'text', text: 'Третья причина — несоосность карданного вала относительно КПП или редуктора. Это происходит после замены подушек двигателя или коробки передач, после ДТП с деформацией кузова, или при неправильной сборке после ремонта. В таком случае даже идеально сбалансированный вал будет вибрировать — потому что он работает с постоянным угловым отклонением.' },
        ],
        image: 'https://s3.datary-dev.ru/tp1219/articles/ChatGPT%20Image%209%20%D0%B8%D1%8E%D0%BB.%202026%20%D0%B3.%2C%2013_28_01.png',
        readTime: '5 мин',
        tags: ['Вибрация', 'Диагностика', 'Трансмиссия'],
        relatedItemIds: ['ds-service-repair-restoration-5', 'ds-service-repair-restoration-1', 'ds-service-machining-1'],
      },
      {
        id: 'driveshafts-kb-7',
        title: 'Шлицевое соединение кардана: что это, почему изнашивается и как проверить',
        excerpt: 'Скользящая вилка компенсирует изменение длины вала при ходе подвески. При износе появляется характерный стук.',
        contentBlocks: [
          { type: 'text', text: 'Карданный вал не имеет фиксированной длины: при сжатии и отбое подвески расстояние между КПП и редуктором заднего моста меняется. Это компенсирует шлицевое (скользящее) соединение — телескопическая секция вала, где внутренние и внешние шлицы скользят относительно друг друга. Обычно покрывается пластичной смазкой и работает в защитном чехле.' },
          { type: 'image', src: 'https://s3.datary-dev.ru/tp1219/articles/ChatGPT%20Image%209%20%D0%B8%D1%8E%D0%BB.%202026%20%D0%B3.%2C%2013_28_44.png', alt: 'Шлицевое соединение карданного вала — скользящая вилка', caption: 'Скользящая вилка кардана — телескопическое звено, компенсирующее ход подвески' },
          { type: 'text', text: 'Износ шлиц проявляется стуком при резком изменении нагрузки: трогание с места, переключение передач, переход с тяги на торможение двигателем. Стук характерный — одиночный удар именно в момент смены нагрузки, в отличие от равномерного стука изношенной крестовины. Самостоятельная проверка: поднять машину, попытаться сдвинуть и раздвинуть скользящую вилку руками — люфт не должен ощущаться.' },
          { type: 'text', text: 'Ремонт: при незначительном износе — промывка и набивка свежей смазки с заменой пыльника. При значительном — восстановление шлицевых поверхностей методом металлизации с последующей шлифовкой под размер. Замена новой скользящей вилкой — наиболее надёжный вариант, но требует подбора по точному типу вала.' },
        ],
        image: 'https://s3.datary-dev.ru/tp1219/articles/ChatGPT%20Image%209%20%D0%B8%D1%8E%D0%BB.%202026%20%D0%B3.%2C%2013_28_44.png',
        readTime: '4 мин',
        tags: ['Шлицевое соединение', 'Скользящая вилка', 'Кардан'],
        relatedItemIds: ['ds-service-repair-restoration-1', 'ds-service-machining-1', 'ds-service-machining-2'],
      },
      {
        id: 'driveshafts-kb-8',
        title: 'Фазировка вилок кардана: почему собранный «как попало» вал вибрирует всегда',
        excerpt: 'Метки на шлицах — не украшение. Вал, собранный со смещением на один шлиц, невозможно отбалансировать.',
        contentBlocks: [
          { type: 'text', text: 'Карданный вал с шарнирами Гука обладает неприятным свойством: при работе под углом ведомая вилка вращается неравномерно — дважды за оборот она то опережает ведущую, то отстаёт. Чем больше угол излома, тем сильнее неравномерность. Компенсируется это тем, что второй шарнир вносит точно такую же неравномерность в противофазе, и на выходе вращение снова становится равномерным.' },
          { type: 'image', src: '', alt: 'Фазировка вилок карданного вала — метки на шлицевом соединении', caption: 'Вилки на обоих концах вала должны лежать в одной плоскости' },
          { type: 'text', text: 'Работает эта компенсация при двух условиях. Первое: вилки на обоих концах вала должны лежать в одной плоскости — это и называется фазировкой. Второе: углы излома на обоих шарнирах должны быть равны. Если при сборке шлицевое соединение соединить со смещением хотя бы на один шлиц, вилки развернутся относительно друг друга, компенсация исчезнет, и вал начнёт генерировать крутильные колебания удвоенной частоты.' },
          { type: 'text', text: 'Ключевое следствие: такую вибрацию нельзя убрать балансировкой. Балансировка устраняет дисбаланс масс — неравномерность распределения веса относительно оси вращения. Здесь же вал может быть идеально сбалансирован, а вибрация останется, потому что её источник — кинематика, а не масса. Отсюда типичная история: «отбалансировали три раза, а трясёт по-прежнему».' },
          { type: 'text', text: 'Практический вывод для владельца техники: перед разборкой шлицевого соединения обязательно нанесите метки на обе половины. Заводские метки — стрелки или керны — обычно есть, но за годы эксплуатации теряются под грязью и коррозией. Если вал уже разобран без меток, правильную фазировку восстанавливают при сборке на стенде — по взаимному положению вилок, а не на глаз.' },
        ],
        image: '',
        readTime: '4 мин',
        tags: ['Фазировка', 'Вибрация', 'Сборка кардана'],
        relatedItemIds: ['ds-service-repair-restoration-1', 'ds-service-repair-restoration-5', 'ds-service-repair-restoration-4'],
      },
      {
        id: 'driveshafts-kb-9',
        title: 'Подвесной подшипник: почему его меняют вместе с крестовинами',
        excerpt: '«Гудит, но едет» — состояние, в котором изношенная опора успевает разбить шлицы и посадочные места вала.',
        contentBlocks: [
          { type: 'text', text: 'На двух- и трёхсоставных карданных валах промежуточная опора — подвесной подшипник — удерживает вал в середине и задаёт его геометрию. Конструктивно это шарикоподшипник в резиновой обойме, закреплённой на кронштейне рамы или кузова. Резина гасит вибрацию и допускает небольшие перемещения вала при работе подвески.' },
          { type: 'image', src: '', alt: 'Подвесной подшипник карданного вала в резиновой обойме', caption: 'Промежуточная опора задаёт геометрию вала и углы работы шарниров' },
          { type: 'text', text: 'Изнашиваются два элемента, и обычно не одновременно. Сам подшипник страдает от загрязнения и вымывания смазки: появляется гул, растущий со скоростью. Резиновая обойма стареет от масла, температуры и нагрузок: она трескается и теряет упругость, вал начинает «гулять» в опоре. Второй случай коварнее — гула может не быть вовсе, зато появляются вибрация на разгоне и стук при трогании.' },
          { type: 'text', text: 'Что происходит, если ездить дальше. Вал, потерявший опору в середине, работает с изменившимися углами на шарнирах, и крестовины начинают изнашиваться ускоренно и неравномерно. Биение передаётся на шлицевое соединение, вырабатывая его, и на посадочные места под подшипники крестовин в вилках. В итоге ремонт из «замены опоры» превращается в восстановление посадочных мест и обработку шлицев — работы существенно другого объёма и стоимости.' },
          { type: 'text', text: 'Поэтому при ремонте вала подвесной подшипник, крестовины и состояние шлицев оценивают вместе. Менять одну изношенную крестовину, оставив разбитую опору, бессмысленно: новая деталь окажется в тех же условиях и выйдет из строя быстрее штатного срока. После любой замены в средней части вала обязательна балансировка в сборе — геометрия вала изменилась.' },
        ],
        image: '',
        readTime: '4 мин',
        tags: ['Подвесной подшипник', 'Промежуточная опора', 'Диагностика'],
        relatedItemIds: ['ds-service-repair-restoration-1', 'ds-service-repair-restoration-2', 'ds-service-repair-restoration-5'],
      },
      {
        id: 'driveshafts-kb-10',
        title: 'Смазка крестовин: шприцевать или не трогать',
        excerpt: 'Одни говорят «смазывать каждое ТО», другие — «залито на весь срок службы». Правы оба, но для разных крестовин.',
        contentBlocks: [
          { type: 'text', text: 'Крестовины бывают двух типов: обслуживаемые — с пресс-маслёнкой (тавотницей) и каналами подвода смазки к игольчатым подшипникам, и необслуживаемые — заправленные смазкой на заводе и герметично закрытые. Отличить их просто: если тавотницы нет и не предусмотрено резьбового отверстия под неё, крестовина необслуживаемая, и дозаправить её без разборки невозможно.' },
          { type: 'image', src: '', alt: 'Шприцевание крестовины карданного вала через пресс-маслёнку', caption: 'Смазку подают до появления свежей у всех четырёх сальников' },
          { type: 'text', text: 'Обслуживаемые крестовины требуют шприцевания по регламенту техники: на грузовой и спецтехнике это обычно каждые 10–20 тыс. км или раз в сезон, при работе в грязи и воде — чаще. Смазку подают до появления свежей у всех четырёх сальников: это признак того, что она прошла по всем каналам и вытеснила загрязнённую. Если из-под одного сальника ничего не выходит, этот подшипник уже забит продуктами износа — крестовину нужно менять, а не докачивать.' },
          { type: 'text', text: 'Необслуживаемые крестовины шприцевать нельзя и не нужно: попытка вкрутить тавотницу в такую крестовину нарушает герметичность и ускоряет её выход из строя. Их ресурс определяется качеством сальников и условиями работы, ремонт не предусмотрен — только замена.' },
          { type: 'text', text: 'Отдельный вопрос — какая смазка. Для игольчатых подшипников крестовин применяют пластичные смазки класса NLGI 2 на литиевой основе с противозадирными присадками. Универсальный состав с дисульфидом молибдена здесь не оптимален: его загуститель хуже проходит по узким каналам. Ещё одна частая ошибка — накачивать смазку мощным пневмошприцем: высокое давление выдавливает сальники, после чего крестовина набирает грязь и умирает за один сезон.' },
        ],
        image: '',
        readTime: '4 мин',
        tags: ['Крестовины', 'Смазка', 'Обслуживание'],
        relatedItemIds: ['ds-service-repair-restoration-4', 'ds-service-repair-restoration-1', 'ds-service-repair-restoration-5'],
      },
    ],
  },
  'construction-materials': {
    residentSlug: 'construction-materials',
    intro:
      '',
    productCategories: createCategories([
      ['sheet', 'Профлист'],
      ['fold', 'Фальцевые системы'],
      ['frames', 'Каркасные профили'],
      ['fences', 'Заборы и ограждения'],
      ['gabions', 'Габионы'],
    ]),
    products: [
      {
        id: 'cm-product-sheet-1',
        title: 'Профлист С8',
        categoryId: 'sheet',
        shortDescription: 'Профлист С8 для заборов, фасадов и облицовки',
        images: ['https://s3.datary-dev.ru/tp1219/constructions/g1o3euna97kc2kj9m6dux58bhxsmo04f.jpg'],
        description:
          'Производство профлиста С8 из оцинкованной и окрашенной стали. Используется для облицовки фасадов, заборов, перегородок и хозяйственных построек. Изготавливается на автоматической линии проката с контролем геометрии профиля.',
        specs: [
          ['Профиль', 'С8'],
          ['Высота волны', '8–10 мм'],
          ['Материал', 'оцинкованная сталь'],
          ['Покрытие', 'оцинкованное или RAL'],
          ['Назначение', 'фасады и заборы'],
        ],
      },
      {
        id: 'cm-product-sheet-2',
        title: 'Профлист С21',
        categoryId: 'sheet',
        shortDescription: 'Профлист С21 для кровли и несущих конструкций',
        images: ['https://s3.datary-dev.ru/tp1219/constructions/2_chernyj_600x400.jpg'],
        description:
          'Изготавливаем профлист С21 для кровли, стеновых конструкций и промышленных объектов. Профиль отличается повышенной жёсткостью и подходит для эксплуатации при высоких нагрузках.',
        specs: [
          ['Профиль', 'С21'],
          ['Высота волны', '21–23 мм'],
          ['Материал', 'сталь'],
          ['Покрытие', 'оцинковка или RAL'],
          ['Применение', 'кровля и фасады'],
        ],
      },
      // {
      //   id: 'cm-product-sheet-3',
      //   title: 'Нестандартный профлист',
      //   categoryId: 'sheet',
      //   shortDescription: 'Изготовление профлиста нестандартного профиля',
      //   images: ['https://s3.datary-dev.ru/'],
      //   description:
      //     'Производим профлист нестандартной конфигурации по параметрам заказчика. Возможна настройка геометрии профиля, длины, толщины металла и типа покрытия.',
      //   specs: [
      //     ['Тип', 'нестандартный профиль'],
      //     ['Изготовление', 'под заказ'],
      //     ['Материал', 'рулонная сталь'],
      //     ['Покрытие', 'оцинковка и окраска'],
      //     ['Производство', 'индивидуальное'],
      //   ],
      // },
      {
        id: 'cm-product-sheet-4',
        title: 'Оцинкованный профлист',
        categoryId: 'sheet',
        shortDescription: 'Профлист из оцинкованной стали без окраски',
        images: ['https://s3.datary-dev.ru/tp1219/constructions/CorrugatedNon-standardC8-2.jpg'],
        description:
          'Оцинкованный профлист применяется для кровли, ограждений, хозяйственных и производственных объектов. Изготавливается из рулонной оцинкованной стали на профилегибочном оборудовании.',
        specs: [
          ['Материал', 'оцинкованная сталь'],
          ['Покрытие', 'без окраски'],
          ['Назначение', 'универсальное'],
          ['Формат', 'листовой'],
          ['Производство', 'серийное'],
        ],
      },
      {
        id: 'cm-product-sheet-5',
        title: 'Окрашенный профлист RAL',
        categoryId: 'sheet',
        shortDescription: 'Профлист с полимерным покрытием по каталогу RAL',
        images: ['https://s3.datary-dev.ru/tp1219/constructions/2.jpg'],
        description:
          'Производим окрашенный профлист с полимерным покрытием различных цветов по каталогу RAL. Подходит для фасадов, заборов, кровли и декоративных конструкций.',
        specs: [
          ['Покрытие', 'полимерное'],
          ['Цвет', 'каталог RAL'],
          ['Материал', 'сталь'],
          ['Назначение', 'фасады и кровля'],
          ['Производство', 'серийное'],
        ],
      },
      {
        id: 'cm-product-fold-1',
        title: 'Клик-фальц панели',
        categoryId: 'fold',
        shortDescription: 'Панели для современной фальцевой кровли',
        images: ['https://s3.datary-dev.ru/tp1219/constructions/952_original.jpg'],
        description:
          'Изготавливаем клик-фальц панели для кровельных систем жилых, коммерческих и промышленных объектов. Панели производятся на линии профилирования с точной геометрией замка.',
        specs: [
          ['Тип', 'клик-фальц'],
          ['Материал', 'оцинкованная сталь'],
          ['Монтаж', 'скрытое крепление'],
          ['Покрытие', 'полимерное'],
          ['Применение', 'кровля'],
        ],
      },
      {
        id: 'cm-product-fold-2',
        title: 'Кровельные панели',
        categoryId: 'fold',
        shortDescription: 'Металлические панели для кровельных систем',
        images: ['https://s3.datary-dev.ru/tp1219/constructions/ywpczh7tkxs3jm4xpyxi67lb0d6iuvy8.webp'],
        description:
          'Производство металлических кровельных панелей различного формата и длины. Изделия используются при монтаже скатных и промышленных кровель.',
        specs: [
          ['Тип', 'кровельные панели'],
          ['Материал', 'сталь'],
          ['Покрытие', 'оцинковка или RAL'],
          ['Изготовление', 'под размер'],
          ['Назначение', 'кровля'],
        ],
      },
      {
        id: 'cm-product-fold-3',
        title: 'Доборные элементы',
        categoryId: 'fold',
        shortDescription: 'Коньки, планки и элементы примыкания для кровли',
        images: ['https://s3.datary-dev.ru/tp1219/constructions/6c15bit82cirn4zytt61nd2hdisgtm9b.png'],
        description:
          'Изготавливаем доборные элементы для кровельных и фасадных систем: коньки, ендовы, планки, отливы и элементы примыкания. Производство выполняется на гибочном оборудовании.',
        specs: [
          ['Тип', 'доборные элементы'],
          ['Материал', 'листовая сталь'],
          ['Изготовление', 'по размерам'],
          ['Покрытие', 'окраска RAL'],
          ['Назначение', 'кровля и фасады'],
        ],
      },
      {
        id: 'cm-product-frames-1',
        title: 'Профиль 60×27',
        categoryId: 'frames',
        shortDescription: 'Потолочный профиль для систем ГКЛ',
        images: ['https://s3.datary-dev.ru/tp1219/constructions/21278.970.png'],
        description:
          'Производство профиля 60×27 для монтажа гипсокартонных конструкций и подвесных потолков. Изготавливается на линии проката из оцинкованной стали.',
        specs: [
          ['Размер', '60×27 мм'],
          ['Материал', 'оцинкованная сталь'],
          ['Назначение', 'ГКЛ системы'],
          ['Тип', 'потолочный профиль'],
          ['Производство', 'серийное'],
        ],
      },
      {
        id: 'cm-product-frames-2',
        title: 'Профили под ГКЛ',
        categoryId: 'frames',
        shortDescription: 'Направляющие и стоечные профили для ГКЛ',
        images: ['https://s3.datary-dev.ru/tp1219/constructions/947_original.jpg'],
        description:
          'Изготавливаем профили для гипсокартонных систем: направляющие, стоечные и потолочные элементы. Продукция применяется при монтаже перегородок и потолков.',
        specs: [
          ['Материал', 'оцинкованная сталь'],
          ['Тип', 'профили ГКЛ'],
          ['Применение', 'перегородки и потолки'],
          ['Производство', 'автоматическая линия'],
          ['Формат', 'серийный выпуск'],
        ],
      },
      {
        id: 'cm-product-frames-3',
        title: 'Подвесы для ГКЛ',
        categoryId: 'frames',
        shortDescription: 'Металлические подвесы для потолочных систем',
        images: ['https://s3.datary-dev.ru/tp1219/constructions/e0daf89ad601c57c1a739d51648164eb.jpg'],
        description:
          'Производство подвесов для монтажа потолочных и каркасных систем. Изделия штампуются на прессовом оборудовании с соблюдением стандартной геометрии.',
        specs: [
          ['Тип', 'подвесы'],
          ['Материал', 'оцинкованная сталь'],
          ['Производство', 'штамповка'],
          ['Назначение', 'потолочные системы'],
          ['Совместимость', 'ГКЛ'],
        ],
      },
      {
        id: 'cm-product-frames-4',
        title: 'Усиливающие уголки',
        categoryId: 'frames',
        shortDescription: 'Монтажные уголки для каркасных конструкций',
        images: ['https://s3.datary-dev.ru/tp1219/constructions/6683686759.jpg'],
        description:
          'Изготавливаем усиливающие уголки для крепления каркасных и металлических конструкций. Производство выполняется методом штамповки листового металла.',
        specs: [
          ['Тип', 'монтажный уголок'],
          ['Материал', 'сталь'],
          ['Производство', 'штамповка'],
          ['Назначение', 'усиление соединений'],
          ['Применение', 'каркасные системы'],
        ],
      },
      {
        id: 'cm-product-frames-5',
        title: 'Крепёжные элементы',
        categoryId: 'frames',
        shortDescription: 'Крепёж для монтажа профилей и конструкций',
        images: ['https://s3.datary-dev.ru/'],
        description:
          'Производим металлические крепёжные элементы для каркасных систем, профилей и строительных конструкций. Возможен серийный выпуск стандартных позиций.',
        specs: [
          ['Тип', 'крепёж'],
          ['Материал', 'металл'],
          ['Назначение', 'монтаж профилей'],
          ['Производство', 'серийное'],
          ['Применение', 'строительные системы'],
        ],
      },
      {
        id: 'cm-product-fences-1',
        title: '3D заборы',
        categoryId: 'fences',
        shortDescription: 'Секционные 3D-заборы из сварной сетки',
        images: ['https://s3.datary-dev.ru/tp1219/constructions/425_original.jpg'],
        description:
          'Производство 3D-заборов на автоматической линии сварки и формовки. Ограждения используются для частных, коммерческих и промышленных объектов.',
        specs: [
          ['Тип', '3D забор'],
          ['Материал', 'металлическая сетка'],
          ['Производство', 'автоматическая линия'],
          ['Покрытие', 'окраска'],
          ['Назначение', 'ограждение территории'],
        ],
      },
      {
        id: 'cm-product-fences-2',
        title: 'Секции ограждений',
        categoryId: 'fences',
        shortDescription: 'Металлические секции для сборных заборов',
        images: ['https://s3.datary-dev.ru/tp1219/constructions/Сварная_секция_ограждения_DF-02_SSiKixc.jpg'],
        description:
          'Изготавливаем секции для металлических ограждений различного размера и назначения. Возможна окраска и комплектация крепёжными элементами.',
        specs: [
          ['Тип', 'секция ограждения'],
          ['Материал', 'сталь'],
          ['Покрытие', 'окрашенное'],
          ['Монтаж', 'сборный'],
          ['Применение', 'заборы'],
        ],
      },
      {
        id: 'cm-product-fences-3',
        title: 'Ворота металлические',
        categoryId: 'fences',
        shortDescription: 'Распашные и откатные ворота под заказ',
        images: ['https://s3.datary-dev.ru/tp1219/constructions/otkatnye-vorota-metallicheskie-scaled.jpg'],
        description:
          'Производство металлических ворот для промышленных, складских и частных объектов. Изготавливаются сварные конструкции под размеры заказчика.',
        specs: [
          ['Тип', 'ворота'],
          ['Конструкция', 'сварная'],
          ['Материал', 'металл'],
          ['Изготовление', 'под заказ'],
          ['Формат', 'распашные и откатные'],
        ],
      },
      {
        id: 'cm-product-fences-4',
        title: 'Калитки металлические',
        categoryId: 'fences',
        shortDescription: 'Калитки для заборов и ограждений',
        images: ['https://s3.datary-dev.ru/tp1219/constructions/o7kmit1r79zokizwzp1ijzk3yuvx6fuo.webp'],
        description:
          'Изготавливаем металлические калитки для установки в секционные и профильные ограждения. Возможна окраска и изготовление под размеры объекта.',
        specs: [
          ['Тип', 'калитка'],
          ['Материал', 'сталь'],
          ['Покрытие', 'окраска'],
          ['Изготовление', 'под заказ'],
          ['Назначение', 'ограждения'],
        ],
      },
      {
        id: 'cm-product-fences-5',
        title: 'Столбы для ограждений',
        categoryId: 'fences',
        shortDescription: 'Опорные столбы для заборов и секций',
        images: ['https://s3.datary-dev.ru/tp1219/metal/243_original.jpg'],
        description:
          'Производство металлических столбов для монтажа заборов, секций и ворот. Изготавливаются из профильной трубы с защитным покрытием.',
        specs: [
          ['Тип', 'опорный столб'],
          ['Материал', 'профильная труба'],
          ['Покрытие', 'окрашенное'],
          ['Назначение', 'монтаж ограждений'],
          ['Производство', 'серийное'],
        ],
      },
      {
        id: 'cm-product-gabions-1',
        title: 'Габионные сетки',
        categoryId: 'gabions',
        shortDescription: 'Сетка двойного кручения для габионов',
        images: ['https://s3.datary-dev.ru/tp1219/constructions/gabiony-foto-04-1-650x650.jpg'],
        description:
          'Производство габионной сетки из металлической проволоки для укрепления склонов, берегов и инженерных объектов. Сетка формируется методом двойного кручения.',
        specs: [
          ['Тип', 'габионная сетка'],
          ['Материал', 'проволока'],
          ['Технология', 'двойное кручение'],
          ['Применение', 'укрепление грунта'],
          ['Формат', 'рулонный'],
        ],
      },
      {
        id: 'cm-product-gabions-2',
        title: 'Матрасы Рено',
        categoryId: 'gabions',
        shortDescription: 'Матрасы Рено для укрепления откосов и берегов',
        images: ['https://s3.datary-dev.ru/tp1219/constructions/Matrats-Reno-5.jpg'],
        description:
          'Изготавливаем матрасы Рено для укрепления склонов, русел рек, дорожных откосов и гидротехнических объектов. Конструкции поставляются в собранном или разобранном виде.',
        specs: [
          ['Тип', 'матрас Рено'],
          ['Материал', 'металлическая сетка'],
          ['Применение', 'укрепление склонов'],
          ['Конструкция', 'гибкая'],
          ['Формат', 'модульный'],
        ],
      },
      {
        id: 'cm-product-gabions-3',
        title: 'Коробчатые габионы',
        categoryId: 'gabions',
        shortDescription: 'Габионы коробчатого типа для укрепления грунта',
        images: ['https://s3.datary-dev.ru/tp1219/constructions/korobchatye-gabiony-04.jpg'],
        description:
          'Производство коробчатых габионов для подпорных стен, укрепления берегов и инженерных сооружений. Конструкции изготавливаются из проволочной сетки.',
        specs: [
          ['Тип', 'коробчатый габион'],
          ['Материал', 'металлическая сетка'],
          ['Назначение', 'подпорные конструкции'],
          ['Технология', 'двойное кручение'],
          ['Применение', 'ландшафт и строительство'],
        ],
      },
      {
        id: 'cm-product-sip-1',
        title: 'СИП-панели',
        categoryId: 'sip',
        shortDescription: 'Структурные изолированные панели для строительства',
        images: ['https://s3.datary-dev.ru/tp1219/constructions/SIP-paneli-2.jpg'],
        description:
          'Производство СИП-панелей (структурных изолированных панелей) для строительства домов, перегородок, перекрытий и кровель. Панель состоит из двух листов ориентированно-стружечной плиты (ОСП) с утеплителем из пенополистирола между ними. Изготавливаем по любым размерам — под проект заказчика. Применяются в малоэтажном строительстве, промышленных и коммерческих объектах.',
        specs: [
          ['Материал', 'ОСП + пенополистирол'],
          ['Утеплитель', 'Пенополистирол (EPS)'],
          ['Размеры', 'По любым размерам заказчика'],
          ['Назначение', 'Стены, перегородки, перекрытия, кровля'],
          ['Изготовление', 'Индивидуальное, под проект'],
        ],
      },
    ] satisfies CatalogSeed[],
    serviceCategories: createCategories([
      ['production', 'Производство металлоконструкций'],
      ['installation', 'Монтажные работы'],
      ['sip-design', 'Проектирование СИП-домов'],
    ]),
    services: [
      {
        id: 'cm-service-production-1',
        title: 'Изготовление по чертежам',
        categoryId: 'production',
        shortDescription: 'Производство конструкций по документации заказчика',
        images: ['https://s3.datary-dev.ru/tp1219/constructions/Scherchez-metallokonstrukcii.jpg'],
        description:
          'Выполняем изготовление металлоконструкций и строительных изделий по чертежам заказчика. Производство включает резку, гибку, сварку и подготовку к монтажу.',
        specs: [
          ['Производство', 'под заказ'],
          ['Документация', 'чертежи заказчика'],
          ['Обработка', 'резка и сварка'],
          ['Материал', 'металл'],
          ['Тип изделий', 'конструкции'],
        ],
      },
      {
        id: 'cm-service-production-2',
        title: 'Серийное производство',
        categoryId: 'production',
        shortDescription: 'Серийный выпуск строительных металлических изделий',
        images: ['https://s3.datary-dev.ru/tp1219/constructions/section2-card-image-1.png'],
        description:
          'Организуем серийное производство профилей, ограждений, доборных элементов и строительных изделий на автоматических линиях проката и штамповки.',
        specs: [
          ['Тип', 'серийное производство'],
          ['Оборудование', 'автоматические линии'],
          ['Изделия', 'профили и ограждения'],
          ['Материал', 'сталь'],
          ['Формат', 'крупные партии'],
        ],
      },
      {
        id: 'cm-service-production-3',
        title: 'Нестандартные конструкции',
        categoryId: 'production',
        shortDescription: 'Производство нестандартных металлических конструкций',
        images: ['https://s3.datary-dev.ru/tp1219/constructions/m1.jpg'],
        description:
          'Изготавливаем нестандартные конструкции и изделия по индивидуальным размерам и техническому заданию. Возможна разработка и адаптация под объект заказчика.',
        specs: [
          ['Тип', 'нестандартные изделия'],
          ['Изготовление', 'индивидуальное'],
          ['Материал', 'металл'],
          ['Обработка', 'полный цикл'],
          ['Назначение', 'строительные объекты'],
        ],
      },
      {
        id: 'cm-service-installation-1',
        title: 'Монтаж заборов',
        categoryId: 'installation',
        shortDescription: 'Установка металлических заборов и секций',
        images: ['https://s3.datary-dev.ru/tp1219/constructions/izobrazenie2024-04-01115913192.png'],
        description:
          'Выполняем монтаж 3D-заборов, секционных ограждений, ворот и калиток. Работы включают установку столбов, крепление секций и сборку конструкции на объекте.',
        specs: [
          ['Тип работ', 'монтаж заборов'],
          ['Изделия', 'секции и ворота'],
          ['Назначение', 'ограждение территории'],
          ['Монтаж', 'на объекте'],
          ['Конструкция', 'металлическая'],
        ],
      },
      {
        id: 'cm-service-installation-2',
        title: 'Монтаж габионов',
        categoryId: 'installation',
        shortDescription: 'Сборка и установка габионных конструкций',
        images: ['https://s3.datary-dev.ru/tp1219/constructions/vc2dp5qmui2jlpnyy2h9mecwudsswy3i.jpg'],
        description:
          'Выполняем монтаж габионов и матрасов Рено для укрепления склонов, береговых линий и инженерных сооружений. Производится сборка и заполнение конструкций.',
        specs: [
          ['Тип работ', 'монтаж габионов'],
          ['Назначение', 'укрепление грунта'],
          ['Конструкции', 'габионы и матрасы Рено'],
          ['Монтаж', 'на объекте'],
          ['Применение', 'инженерные сооружения'],
        ],
      },
      {
        id: 'cm-service-installation-3',
        title: 'Монтаж металлоконструкций',
        categoryId: 'installation',
        shortDescription: 'Сборка и установка металлических конструкций',
        images: ['https://s3.datary-dev.ru/tp1219/constructions/metallokonstrukczii.jpg'],
        description:
          'Выполняем монтаж металлических конструкций, каркасов, ограждений и строительных элементов на объектах различного назначения.',
        specs: [
          ['Тип работ', 'монтаж конструкций'],
          ['Материал', 'металл'],
          ['Назначение', 'строительные объекты'],
          ['Конструкция', 'сварная и сборная'],
          ['Формат', 'под проект'],
        ],
      },
      {
        id: 'cm-service-sip-design-1',
        title: 'Проектирование строений из СИП-панелей',
        categoryId: 'sip-design',
        shortDescription: 'Разработка проекта дома или здания из СИП-панелей',
        images: ['https://s3.datary-dev.ru/tp1219/constructions/1.jpg'],
        description:
          'Выполняем полный цикл проектирования зданий и сооружений из СИП-панелей: от планировочного решения до рабочей документации. Разрабатываем конструктивные схемы, компоновку помещений, узлы сопряжений и спецификации панелей под конкретный объект. Проектирование ведётся с учётом индивидуальных требований заказчика — возможны любые конфигурации и площади.',
        specs: [
          ['Тип услуги', 'Проектирование'],
          ['Объекты', 'Жилые дома, дачи, коммерческие здания'],
          ['Документация', 'Планировка, конструктив, спецификации'],
          ['Формат', 'Под индивидуальный проект'],
          ['Производство', 'Возможно совместно с изготовлением панелей'],
        ],
      },
    ] satisfies ServiceSeed[],
    galleryCaption: ['Прокат и профилирование', 'Ограждения и секции', 'Строительные конструкции'],
    knowledgeArticles: [
      {
        id: 'construction-materials-kb-1',
        title: 'Профлист С8 или С21: как выбрать под конкретную задачу',
        excerpt: 'Разные профили — для разных нагрузок. Путаница в выборе стоит денег.',
        contentBlocks: [
          { type: 'text', text: 'Профлист С8 имеет высоту волны 8 мм — этого достаточно для вертикальных конструкций: заборов, фасадной облицовки, перегородок. Он легче, дешевле и проще в монтаже. Для кровли и горизонтальных перекрытий не подходит: не выдерживает снеговую нагрузку на больших пролётах.' },
          { type: 'image', src: 'https://s3.datary-dev.ru/tp1219/constructions/2_chernyj_600x400.jpg', alt: 'Профлист С8 и С21 — сравнение профилей', caption: 'Профлист С21 — для кровли и несущих конструкций' },
          { type: 'text', text: 'Профлист С21 с высотой волны 21–23 мм значительно жёстче. Он применяется на кровлях с уклоном от 8°, при пролётах от 1,5 м без промежуточных опор, а также в промышленных и сельскохозяйственных постройках.' },
          { type: 'text', text: 'Правило выбора простое: вертикаль без нагрузки — С8, горизонталь или нагружённая конструкция — С21 и выше. Неправильный выбор профиля ведёт к деформации и преждевременному разрушению покрытия.' },
        ],
        image: 'https://s3.datary-dev.ru/tp1219/constructions/2_chernyj_600x400.jpg',
        readTime: '4 мин',
        tags: ['Профлист', 'Кровля', 'Ограждения'],
        relatedItemIds: ['cm-product-sheet-1', 'cm-product-sheet-2', 'cm-product-sheet-4', 'cm-product-sheet-5'],
      },
      {
        id: 'construction-materials-kb-2',
        title: '3D заборы и секционные ограждения: мифы о надёжности',
        excerpt: 'Многие считают сварную сетку слабее сплошного профлиста. Разбираем, так ли это.',
        contentBlocks: [
          { type: 'text', text: 'Главное заблуждение о 3D заборах — что сварная сетка хуже сплошного профлиста. На самом деле секции изготавливаются на автоматических линиях: диаметр проволоки и размер ячейки строго стандартизированы, прочность предсказуема по всей длине.' },
          { type: 'image', src: 'https://s3.datary-dev.ru/tp1219/articles/3d (1).jpg', alt: 'Секционные 3D заборы и ограждения', caption: 'Сварная секция 3D забора — надёжность и прозрачность' },
          { type: 'text', text: 'Ключевое преимущество 3D секций перед профлистом — ветропроницаемость. Сплошной лист на ветру создаёт значительную парусность, что требует усиленных столбов и более глубокого фундамента. Сетчатое ограждение нагружает опоры в разы меньше.' },
          { type: 'text', text: 'Для периметра с высокой ветровой нагрузкой, промышленных территорий и открытых участков 3D забор — технически обоснованный и долговечный выбор при сопоставимой стоимости с профлистом.' },
        ],
        image: 'https://s3.datary-dev.ru/tp1219/articles/3d (1).jpg',
        readTime: '4 мин',
        tags: ['3D забор', 'Ограждения', 'Сравнение'],
        relatedItemIds: ['cm-product-fences-1', 'cm-product-fences-2', 'cm-product-fences-3', 'cm-service-installation-1'],
      },
      {
        id: 'construction-materials-kb-3',
        title: 'Габионы и матрасы Рено: зачем они нужны и где применяются',
        excerpt: 'Укрепление склонов — не только про сваи и бетон. Габионные конструкции часто эффективнее.',
        contentBlocks: [
          { type: 'text', text: 'Габион — это проволочная сетчатая конструкция, заполненная камнем. Применяется для укрепления откосов, берегов рек, дорожных насыпей и подпорных стен. В отличие от бетонных решений, габионы не требуют фундамента, пропускают воду и самостоятельно уплотняются под нагрузкой со временем.' },
          { type: 'image', src: 'https://s3.datary-dev.ru/tp1219/constructions/Matrats-Reno-5.jpg', alt: 'Матрасы Рено и габионные конструкции', caption: 'Матрасы Рено для берегоукрепления и откосов' },
          { type: 'text', text: 'Матрасы Рено — плоские габионы толщиной 17–30 см. Это стандартное решение для защиты берегов, дна каналов и дорожных откосов от размыва. Укладываются горизонтально, хорошо адаптируются к рельефу.' },
          { type: 'text', text: 'Коробчатые габионы применяются для строительства подпорных стен и террасирования рельефа. Конструкции долговечны, устойчивы к сейсмике и не требуют специальной техники для монтажа.' },
        ],
        image: 'https://s3.datary-dev.ru/tp1219/constructions/Matrats-Reno-5.jpg',
        readTime: '4 мин',
        tags: ['Габионы', 'Берегоукрепление', 'Ландшафт'],
        relatedItemIds: ['cm-product-gabions-1', 'cm-product-gabions-2', 'cm-product-gabions-3', 'cm-service-installation-2'],
      },
      {
        id: 'construction-materials-kb-4',
        title: 'Толщина профлиста 0.4, 0.5 или 0.7 мм: как не купить кровлю, которая деформируется',
        excerpt: 'Разница в 0.1 мм влияет не только на прочность, но и на жёсткость под снеговой нагрузкой.',
        contentBlocks: [
          { type: 'text', text: 'Толщина металла в профлисте — ключевой параметр, который напрямую влияет на несущую способность и срок службы. Профлист 0.4 мм — минимальная толщина, применяемая только для вертикальных конструкций с небольшой площадью: временные ограждения, декоративные заборы без ветровой нагрузки. Для кровли и заборов с нагрузкой не рекомендуется.' },
          { type: 'image', src: 'https://s3.datary-dev.ru/tp1219/articles/ChatGPT%20Image%209%20%D0%B8%D1%8E%D0%BB.%202026%20%D0%B3.%2C%2013_34_28.png', alt: 'Толщина профлиста — сравнение 0.4, 0.5 и 0.7 мм', caption: 'Профлист 0.5 мм — стандарт для большинства задач; 0.7 мм — для нагруженных кровель' },
          { type: 'text', text: 'Профлист 0.5 мм — массовый стандарт. Подходит для заборов, кровель хозяйственных построек и промышленных объектов с нормативной снеговой нагрузкой до 1.5–2 кН/м² (150–200 кг/м²). При шаге обрешётки 500–600 мм выдерживает стандартные снеговые районы России (1–4 зона). Для большинства жилых и дачных объектов — оптимальный выбор.' },
          { type: 'text', text: 'Профлист 0.7 мм применяется в промышленном строительстве, на объектах с большим шагом стропил или при высокой снеговой нагрузке (5–8 зона по картам ГОСТа). Он же используется для кровель с уклоном менее 8°, где нагрузка распределяется более горизонтально. Разница в цене между 0.5 и 0.7 — около 20–25%, но это разница между плановой эксплуатацией и деформацией через 3–5 лет.' },
        ],
        image: 'https://s3.datary-dev.ru/tp1219/articles/ChatGPT%20Image%209%20%D0%B8%D1%8E%D0%BB.%202026%20%D0%B3.%2C%2013_34_28.png',
        readTime: '4 мин',
        tags: ['Профлист', 'Толщина', 'Кровля'],
        relatedItemIds: ['cm-product-sheet-1', 'cm-product-sheet-2', 'cm-product-sheet-4', 'cm-product-sheet-5'],
      },
      {
        id: 'construction-materials-kb-5',
        title: 'Фальцевая кровля: что это такое и чем она лучше черепицы на промышленных объектах',
        excerpt: 'Фальцевый шов — механическое соединение листов без сквозных проколов. Именно это делает её герметичной.',
        contentBlocks: [
          { type: 'text', text: 'Фальцевая кровля — это технология соединения металлических листов загибом края (фальцем) без использования гвоздей, саморезов или заклёпок, проходящих насквозь. Два листа защёлкиваются или закатываются вместе по длинной стороне, образуя водонепроницаемый продольный шов. Крепление к основанию — кляммерами, скрытыми под замком.' },
          { type: 'image', src: 'https://s3.datary-dev.ru/tp1219/articles/ChatGPT%20Image%209%20%D0%B8%D1%8E%D0%BB.%202026%20%D0%B3.%2C%2013_34_34.png', alt: 'Фальцевая кровля — соединение листов без сквозных проколов', caption: 'Фальцевый шов: герметичное соединение без гвоздей — принцип защёлки' },
          { type: 'text', text: 'Ключевое преимущество перед профлистом на саморезах: каждый саморез — это потенциальное место протечки через 5–10 лет из-за разрушения резиновой шайбы. На объекте 1000 м² кровли — это 2000–4000 саморезов. Фальцевая кровля полностью исключает эту проблему. Длина листа ограничена только рулоном — можно покрыть скат от конька до карниза одним непрерывным полотном без поперечных стыков.' },
          { type: 'text', text: 'Для промышленных объектов, складов и коммерческой недвижимости фальцевая кровля — технически обоснованный выбор при сроке эксплуатации 30+ лет. Стоимость материала и монтажа выше, чем у профлиста, но суммарные расходы на обслуживание и ремонт — ниже.' },
        ],
        image: 'https://s3.datary-dev.ru/tp1219/articles/ChatGPT%20Image%209%20%D0%B8%D1%8E%D0%BB.%202026%20%D0%B3.%2C%2013_34_34.png',
        readTime: '5 мин',
        tags: ['Фальцевая кровля', 'Кровельные системы', 'Металл'],
        relatedItemIds: ['cm-product-fold-1', 'cm-product-fold-2', 'cm-product-fold-3'],
      },
      {
        id: 'construction-materials-kb-6',
        title: 'Каркасные профили C, U, UA и CW: чем они отличаются и как не запутаться',
        excerpt: 'Четыре типа профиля для перегородок — и у каждого своя роль. Путаница ведёт к слабым конструкциям.',
        contentBlocks: [
          { type: 'text', text: 'В системах каркасных перегородок используются два базовых профиля: C (стоечный) и U (направляющий). U-профиль крепится к полу и потолку — это «рельсы» системы. C-профиль вставляется в U-профиль вертикально — это стойки каркаса, несущие нагрузку от обшивки. Оба изготавливаются из оцинкованной стали 0.5–0.6 мм для стандартных перегородок.' },
          { type: 'image', src: 'https://s3.datary-dev.ru/tp1219/articles/ChatGPT%20Image%209%20%D0%B8%D1%8E%D0%BB.%202026%20%D0%B3.%2C%2013_33_33.png', alt: 'Каркасные профили C, U, UA, CW для гипсокартонных перегородок', caption: 'C и U — стандарт, UA и CW — для несущих конструкций и высоких перегородок' },
          { type: 'text', text: 'Профиль UA (усиленный стоечный) — это C-профиль с увеличенной толщиной стенки (1.5–2 мм) и усиленными полками. Применяется для высоких перегородок (от 4.5 м), дверных проёмов (где нагрузка на стойку возрастает) и конструкций, несущих полки или шкафы. Нагрузка на UA-стойку в 3–4 раза выше стандартного C.' },
          { type: 'text', text: 'Профиль CW (несущий стоечный) с усиленными рёбрами жёсткости используется в системах межквартирных несущих перегородок и в местах приложения точечных нагрузок. Комбинация профилей в одной конструкции (стандартные C по полю, UA у проёмов) — распространённая практика, которая снижает расход металла без потери прочности.' },
        ],
        image: 'https://s3.datary-dev.ru/tp1219/articles/ChatGPT%20Image%209%20%D0%B8%D1%8E%D0%BB.%202026%20%D0%B3.%2C%2013_33_33.png',
        readTime: '4 мин',
        tags: ['Каркасные профили', 'Перегородки', 'Гипсокартон'],
        relatedItemIds: ['cm-product-frames-1', 'cm-product-frames-2', 'cm-product-frames-3', 'cm-product-frames-4', 'cm-product-frames-5'],
      },
      {
        id: 'construction-materials-kb-7',
        title: 'SIP-панели: заблуждения о прочности, пожаробезопасности и сроке службы',
        excerpt: '"Горят как спичка" и "не выдержат нагрузку" — два самых частых мифа о SIP. Разбираем факты.',
        contentBlocks: [
          { type: 'text', text: 'SIP-панель (Structural Insulated Panel) — это сэндвич из двух листов OSB-3, склеенных с пенополистиролом под давлением. Конструктивная прочность обеспечивается именно этим сэндвич-эффектом: OSB работают на сжатие и растяжение, пенополистирол — на сдвиг. Для малоэтажного строительства несущей способности SIP достаточно: дом из SIP-панелей выдерживает снеговые нагрузки всех климатических зон России при соблюдении расчётных пролётов.' },
          { type: 'image', src: 'https://s3.datary-dev.ru/tp1219/articles/ChatGPT%20Image%209%20%D0%B8%D1%8E%D0%BB.%202026%20%D0%B3.%2C%2013_36_45.png', alt: 'SIP-панель в разрезе — OSB и пенополистирол', caption: 'SIP-панель в разрезе: OSB + ПСБ-С = прочная несущая конструкция' },
          { type: 'text', text: 'О горючести: сам пенополистирол горит, но в конструкции он закрыт с обеих сторон OSB, а OSB при монтаже обязательно закрывается наружными и внутренними отделочными материалами (штукатурка, гипсокартон, вагонка). Огонь добирается до пенополистирола только после разрушения этих слоёв. По нормам ПБ готовая стена из SIP с наружной штукатуркой относится к классу К0 (нераспространяющий огонь).' },
          { type: 'text', text: 'Срок службы: пенополистирол ПСБ-С не разлагается и не теряет свойств в условиях нормальной эксплуатации (без прямого контакта с атмосферой и УФ). Производители дают 50-летнюю гарантию. Слабое место SIP — торцы панелей в местах стыков: при нарушении гидроизоляции возможно намокание и биологическое поражение OSB. Правильное проектирование стыков и отделки полностью исключает этот риск.' },
        ],
        image: 'https://s3.datary-dev.ru/tp1219/articles/ChatGPT%20Image%209%20%D0%B8%D1%8E%D0%BB.%202026%20%D0%B3.%2C%2013_36_45.png',
        readTime: '5 мин',
        tags: ['SIP-панели', 'Строительство', 'Прочность'],
        relatedItemIds: ['cm-product-sip-1', 'cm-service-sip-design-1', 'cm-service-production-3'],
      },
      {
        id: 'construction-materials-kb-8',
        title: 'Столбы забора: почему бетон «стаканом» выдавливает опору за одну зиму',
        excerpt: 'Больше бетона — надёжнее? В пучинистом грунте всё наоборот: бетонная обойма превращается в рычаг для выталкивания столба.',
        contentBlocks: [
          { type: 'text', text: 'Морозное пучение — увеличение объёма грунта при замерзании содержащейся в нём воды примерно на 9 %. В глинистых и суглинистых грунтах Челябинской области подъём поверхности за зиму достигает 5–15 см. Нормативная глубина промерзания для региона — порядка 1,8–2,0 м, и весь слой грунта до этой отметки промерзает и оттаивает ежегодно.' },
          { type: 'image', src: '', alt: 'Установка столбов ограждения в пучинистом грунте', caption: 'Способ установки опоры важнее её сечения: пучение выталкивает бетонную обойму' },
          { type: 'text', text: 'Классическая ошибка — залить столб бетоном на глубину 60–80 см «стаканом». Такая обойма имеет большую боковую поверхность, за которую промерзающий грунт цепляется силами касательного пучения, и небольшой вес, который этому не противостоит. Каждую зиму опору выдавливает вверх на сантиметр-другой, а на её место осыпается грунт — весной столб обратно не садится. Через два-три сезона верх забора идёт волной, а секции перекашивает.' },
          { type: 'text', text: 'Работающих решений три. Забивка столба ниже глубины промерзания — самый быстрый вариант и для лёгких секционных ограждений самый практичный: грунт уплотняется вокруг трубы, боковая поверхность минимальна. Щебневая засыпка — столб устанавливается в скважину и обсыпается уплотнённым щебнем, который дренирует воду и не даёт ей замерзать вплотную к опоре. Винтовая свая — решение для слабых и обводнённых грунтов: лопасть работает как анкер против выдавливания.' },
          { type: 'text', text: 'Если бетонирование всё же необходимо — например, под тяжёлые распашные ворота — делать его нужно по правилам: скважина ниже глубины промерзания, расширение внизу для анкеровки, гладкая опалубка из трубы или рубероида по боковой поверхности, чтобы снизить сцепление с пучинистым грунтом. Отдельно учитывайте, что под воротами и калиткой нагрузка на опору многократно выше, чем под рядовой секцией: эти столбы всегда ставят по усиленной схеме и большего сечения.' },
        ],
        image: '',
        readTime: '5 мин',
        tags: ['Столбы', 'Морозное пучение', 'Монтаж забора'],
        relatedItemIds: ['cm-product-fences-5', 'cm-service-installation-1', 'cm-product-fences-3'],
      },
      {
        id: 'construction-materials-kb-9',
        title: 'Полиэстер, матовый полиэстер или пурал: за что переплата в окрашенном профлисте',
        excerpt: 'Один и тот же цвет RAL может продержаться пять лет или двадцать пять. Разницу определяют два числа в спецификации.',
        contentBlocks: [
          { type: 'text', text: 'Окрашенный профлист — многослойный материал: стальная основа, слой цинка, пассивирующий и грунтовочный слои, полимерное покрытие. Стойкость изделия определяется не столько цветом, сколько двумя параметрами: массой цинкового покрытия и типом с толщиной полимера. Оба указываются в спецификации, и оба заказчики регулярно упускают из виду.' },
          { type: 'image', src: '', alt: 'Слои окрашенного профлиста: сталь, цинк, грунт, полимерное покрытие', caption: 'Долговечность определяют масса цинка и тип полимерного покрытия' },
          { type: 'text', text: 'Цинк обозначается буквой Z с числом — это масса покрытия в граммах на квадратный метр с обеих сторон: Z100, Z140, Z275. Именно цинк защищает сталь на срезах и в местах царапин, где полимер повреждён. Для забора или временной конструкции достаточно Z100–Z140, для кровли с расчётным сроком службы в десятилетия — от Z225 и выше. Экономия на цинке проявляется не сразу, а через несколько лет рыжими потёками от кромок и мест крепления.' },
          { type: 'text', text: 'Полимер отвечает за цвет, стойкость к ультрафиолету и механические повреждения. Глянцевый полиэстер толщиной 25 мкм — самый дешёвый и распространённый вариант: приемлем для навесов, заборов и хозпостроек, но заметно выцветает через 5–7 лет на солнечной стороне. Матовый полиэстер 30–35 мкм устойчивее к ультрафиолету и меньше бликует. Покрытия класса пурал (полиуретан с полиамидом, около 50 мкм) держат перепады температур, механические воздействия и агрессивную атмосферу, ресурс покрытия — 20–25 лет.' },
          { type: 'text', text: 'Практический подход — не переплачивать там, где это не нужно, и не экономить там, где это критично. Для забора разумно взять полиэстер, но с нормальным цинком. Для кровли цеха или дома — покрытие класса пурал и Z225 и выше, потому что стоимость демонтажа и повторного монтажа кровли многократно превышает разницу в цене материала. И обязательно закладывайте доборные элементы того же класса покрытия: планка из дешёвого профлиста на кровле из пурала обнулит ресурс всей системы.' },
        ],
        image: '',
        readTime: '5 мин',
        tags: ['Полимерное покрытие', 'Цинк', 'Профлист'],
        relatedItemIds: ['cm-product-sheet-5', 'cm-product-sheet-4', 'cm-product-fold-3'],
      },
      {
        id: 'construction-materials-kb-10',
        title: 'Доборные элементы: почему крыша течёт даже из идеального профлиста',
        excerpt: 'Планки воспринимают как декор и экономят на них в первую очередь. Именно на них приходится большинство протечек.',
        contentBlocks: [
          { type: 'text', text: 'Кровельный лист сам по себе воду не пропускает. Протечки почти всегда происходят на стыках, примыканиях и краях — там, где работают доборные элементы: конёк, ендова, торцевая и карнизная планки, планки примыкания к стене и трубе, снегозадержатели. Это не отделка, а функциональные узлы водоотведения, и считать их нужно вместе с листом.' },
          { type: 'image', src: '', alt: 'Доборные элементы кровли: конёк, ендова, торцевая и карнизная планки', caption: 'Узлы примыканий и краёв — там, где кровля действительно течёт' },
          { type: 'text', text: 'Конёк закрывает верхний стык скатов и одновременно должен пропускать воздух из подкровельного пространства — поэтому под ним ставится вентиляционная лента, а не сплошной герметик. Ендова — внутренний угол между скатами — принимает наибольший объём воды и снега: здесь всегда нужны нижняя планка со сплошным основанием под ней и верхняя декоративная планка. Торцевая планка защищает от задувания косого дождя и срыва листа ветром, карнизная — отводит воду в жёлоб и закрывает лобовую доску.' },
          { type: 'text', text: 'Отдельная тема — нахлёсты, которые напрямую зависят от уклона кровли. При уклоне более 15° достаточно нахлёста в одну волну и 100–150 мм по длине листа. При уклоне 12–15° продольный нахлёст увеличивают, а поперечный дополнительно герметизируют. При уклоне менее 12° профлист как таковой применять не рекомендуется: там работают фальцевые системы, где герметичность обеспечивает сам замок, а не нахлёст.' },
          { type: 'text', text: 'И ещё один узел, о котором вспоминают редко, — капиллярная канавка на кромке профлиста. Это дополнительная бороздка, отводящая воду, которую капиллярный эффект затягивает в зазор между листами. Лист нужно укладывать так, чтобы канавка оказалась под соседним листом, иначе она работает наоборот. Комплектовать кровлю доборными элементами и крепежом лучше сразу вместе с листом: тогда покрытие, планки и саморезы будут одного цвета и одного класса стойкости.' },
        ],
        image: '',
        readTime: '5 мин',
        tags: ['Доборные элементы', 'Кровля', 'Протечки'],
        relatedItemIds: ['cm-product-fold-3', 'cm-product-sheet-1', 'cm-product-fold-2'],
      },
    ],
  },
  ventilation: {
    residentSlug: 'ventilation',
    intro:
      '',
    productCategories: createCategories([
      ['vent-ducts', 'Воздуховоды и короба'],
      ['vent-fittings', 'Фасонные элементы вентиляции'],
      ['vent-hardware', 'Крепёж и комплектующие'],
    ]),
    products: [
      {
        id: 'vent-product-vent-ducts-1',
        title: 'Воздуховоды круглые',
        categoryId: 'vent-ducts',
        shortDescription: 'Круглые воздуховоды для вентиляционных систем',
        images: ['https://s3.datary-dev.ru/tp1219/vent/857_original.png'],
        description: 'Изготавливаем круглые воздуховоды из оцинкованной стали для систем приточной, вытяжной и промышленной вентиляции. Производство выполняется с использованием вальцовочного и гибочного оборудования.',
        specs: [['Тип', 'круглые воздуховоды'], ['Материал', 'оцинкованная сталь'], ['Назначение', 'вентиляция'], ['Соединение', 'фальцевое'], ['Изготовление', 'под размер']],
      },
      {
        id: 'vent-product-vent-ducts-2',
        title: 'Воздуховоды прямоугольные',
        categoryId: 'vent-ducts',
        shortDescription: 'Прямоугольные воздуховоды для инженерных систем',
        images: ['https://s3.datary-dev.ru/tp1219/vent/1_afox-22.jpg'],
        description: 'Производство прямоугольных воздуховодов для коммерческих, производственных и жилых объектов. Изделия изготавливаются по размерам заказчика с подготовкой под монтаж.',
        specs: [['Тип', 'прямоугольные воздуховоды'], ['Материал', 'оцинкованная сталь'], ['Назначение', 'вентиляционные системы'], ['Изготовление', 'под заказ'], ['Формат', 'секционный']],
      },
      {
        id: 'vent-product-vent-ducts-3',
        title: 'Вентиляционные короба',
        categoryId: 'vent-ducts',
        shortDescription: 'Металлические короба для вентиляции и коммуникаций',
        images: ['https://s3.datary-dev.ru/tp1219/vent/priamougolniy_vozdukhovod_metallicheskiy_L1250_flanets.970.jpg'],
        description: 'Изготавливаем вентиляционные короба различного сечения для инженерных систем и прокладки вентиляционных каналов. Возможна подготовка отверстий и элементов крепления.',
        specs: [['Тип', 'вентиляционный короб'], ['Материал', 'листовая сталь'], ['Назначение', 'вентиляция'], ['Изготовление', 'индивидуальное'], ['Монтаж', 'сборный']],
      },
      {
        id: 'vent-product-vent-fittings-1',
        title: 'Переходы вентиляционные',
        categoryId: 'vent-fittings',
        shortDescription: 'Переходы между элементами вентиляционных систем',
        images: ['https://s3.datary-dev.ru/tp1219/vent/a9d3401826a80a570a3261f7b54fe8c2 (1).png'],
        description: 'Производим вентиляционные переходы для соединения воздуховодов различного диаметра и формы. Изделия подготавливаются под стандартные и нестандартные системы.',
        specs: [['Тип', 'переходы'], ['Материал', 'оцинкованная сталь'], ['Форма', 'круглая и прямоугольная'], ['Назначение', 'соединение воздуховодов'], ['Изготовление', 'под размер']],
      },
      {
        id: 'vent-product-vent-fittings-2',
        title: 'Фасонные элементы',
        categoryId: 'vent-fittings',
        shortDescription: 'Отводы, тройники и соединительные элементы',
        images: ['https://s3.datary-dev.ru/tp1219/vent/рис 7.jpg'],
        description: 'Изготавливаем фасонные элементы вентиляции: отводы, тройники, врезки, заглушки и соединительные узлы. Производство выполняется по стандартным и индивидуальным размерам.',
        specs: [['Тип', 'фасонные элементы'], ['Материал', 'оцинкованная сталь'], ['Назначение', 'вентиляционные системы'], ['Формат', 'под заказ'], ['Производство', 'гибка и сборка']],
      },
      {
        id: 'vent-product-vent-fittings-3',
        title: 'Дефлекторы вентиляционные',
        categoryId: 'vent-fittings',
        shortDescription: 'Дефлекторы для вытяжных и вентиляционных систем',
        images: ['https://s3.datary-dev.ru/tp1219/vent/7081338694.jpg'],
        description: 'Производство дефлекторов для защиты вентиляционных каналов и улучшения тяги в вытяжных системах. Изготавливаются из оцинкованной стали.',
        specs: [['Тип', 'дефлектор'], ['Материал', 'оцинкованная сталь'], ['Назначение', 'вытяжная вентиляция'], ['Монтаж', 'кровельный'], ['Изготовление', 'серийное']],
      },
      {
        id: 'vent-product-vent-hardware-1',
        title: 'Хомуты вентиляционные',
        categoryId: 'vent-hardware',
        shortDescription: 'Металлические хомуты для крепления воздуховодов',
        images: ['https://s3.datary-dev.ru/tp1219/vent/shop_items_catalog_image4740724.webp'],
        description: 'Изготавливаем вентиляционные хомуты круглой и овальной формы для крепления воздуховодов и инженерных коммуникаций. Производство выполняется на специализированном оборудовании.',
        specs: [['Тип', 'вентиляционный хомут'], ['Материал', 'сталь'], ['Форма', 'круглая и овальная'], ['Назначение', 'крепление воздуховодов'], ['Производство', 'серийное']],
      },
      {
        id: 'vent-product-vent-hardware-2',
        title: 'Крепёж вентиляции',
        categoryId: 'vent-hardware',
        shortDescription: 'Крепёжные элементы для монтажа вентиляции',
        images: ['https://s3.datary-dev.ru/tp1219/vent/zjqm91rl6kvy26w6yzdb1rvzfoibk4c3.jpg'],
        description: 'Производство крепёжных элементов для монтажа вентиляционных систем и воздуховодов. Изготавливаются подвесы, уголки, соединители и монтажные элементы.',
        specs: [['Тип', 'крепёж'], ['Материал', 'металл'], ['Назначение', 'монтаж вентиляции'], ['Изготовление', 'серийное'], ['Применение', 'инженерные системы']],
      },
    ],
    serviceCategories: createCategories([
      ['vent-design', 'Проектирование и подготовка'],
      ['vent-production', 'Производство вентиляционных элементов'],
      ['vent-assembly', 'Сборка и монтаж'],
    ]),
    services: [
      {
        id: 'vent-service-vent-design-1',
        title: 'Проектирование вентиляции',
        categoryId: 'vent-design',
        shortDescription: 'Подготовка проектов вентиляционных систем',
        images: ['https://s3.datary-dev.ru/tp1219/vent/Proektirovanie-ventiljacii-i-kondicionirovanija-kvartiry-1024x649.jpg'],
        description: 'Выполняем проектирование вентиляционных систем для жилых, коммерческих и производственных объектов. Подготавливаются схемы воздуховодов, спецификации и монтажные решения.',
        specs: [['Тип работ', 'проектирование'], ['Назначение', 'вентиляционные системы'], ['Документация', 'схемы и спецификации'], ['Объекты', 'жилые и промышленные'], ['Подготовка', 'под монтаж']],
      },
      {
        id: 'vent-service-vent-design-2',
        title: 'Подготовка чертежей для производства',
        categoryId: 'vent-design',
        shortDescription: 'Подготовка файлов и схем для изготовления вентиляции',
        images: ['https://s3.datary-dev.ru/tp1219/vent/Снимок экрана 2026-05-22 170951.png'],
        description: 'Выполняем подготовку производственных чертежей и раскроя для изготовления воздуховодов и фасонных элементов. Возможна адаптация документации заказчика.',
        specs: [['Тип работ', 'подготовка чертежей'], ['Назначение', 'производство вентиляции'], ['Форматы', 'CAD и DXF'], ['Обработка', 'под оборудование'], ['Документация', 'производственная']],
      },
      {
        id: 'vent-service-vent-production-1',
        title: 'Изготовление под заказ',
        categoryId: 'vent-production',
        shortDescription: 'Производство вентиляционных изделий по размерам',
        images: ['https://s3.datary-dev.ru/tp1219/vent/ZHestyanyj-izdeliya-v-Kurske-06.jpg'],
        description: 'Изготавливаем воздуховоды, фасонные элементы, короба и крепёж по размерам и техническому заданию заказчика. Производство включает резку, гибку, вальцовку и сборку изделий.',
        specs: [['Тип работ', 'изготовление'], ['Материал', 'оцинкованная сталь'], ['Формат', 'под заказ'], ['Обработка', 'резка и гибка'], ['Назначение', 'вентиляция']],
      },
      {
        id: 'vent-service-vent-production-2',
        title: 'Резка вентиляционных элементов',
        categoryId: 'vent-production',
        shortDescription: 'Лазерная и гильотинная резка листового металла',
        images: ['https://s3.datary-dev.ru/tp1219/vent/gilotinnaya-rezka-metalla.jpg'],
        description: 'Выполняем резку заготовок для вентиляционных систем на лазерном и гильотинном оборудовании. Подготавливаются детали для воздуховодов, фасонных элементов и крепежа.',
        specs: [['Тип работ', 'резка металла'], ['Оборудование', 'лазер и гильотина'], ['Материал', 'листовая сталь'], ['Назначение', 'вентиляционные изделия'], ['Производство', 'серийное и индивидуальное']],
      },
      {
        id: 'vent-service-vent-production-3',
        title: 'Гибка вентиляционных элементов',
        categoryId: 'vent-production',
        shortDescription: 'Гибка деталей для воздуховодов и коробов',
        images: ['https://s3.datary-dev.ru/tp1219/vent/6d8891113b7bb3402c68e438f43357dc (1).jpg'],
        description: 'Выполняем гибку листового металла для изготовления вентиляционных коробов, фасонных элементов и соединительных узлов. Работы выполняются на листогибочном оборудовании.',
        specs: [['Тип работ', 'гибка'], ['Материал', 'листовая сталь'], ['Назначение', 'вентиляционные изделия'], ['Длина обработки', 'до 3000 мм'], ['Оборудование', 'листогиб']],
      },
      {
        id: 'vent-service-vent-production-4',
        title: 'Вальцовка воздуховодов',
        categoryId: 'vent-production',
        shortDescription: 'Вальцовка листового металла под круглые воздуховоды',
        images: ['https://s3.datary-dev.ru/tp1219/vent/6c8dd2a1c2ded1233b519fd372b1b8a1.jpg'],
        description: 'Выполняем вальцовку листового металла для изготовления круглых воздуховодов и цилиндрических элементов вентиляционных систем.',
        specs: [['Тип работ', 'вальцовка'], ['Назначение', 'круглые воздуховоды'], ['Материал', 'оцинкованная сталь'], ['Оборудование', 'вальцы'], ['Формат', 'цилиндрические изделия']],
      },
      {
        id: 'vent-service-vent-assembly-1',
        title: 'Сборка вентиляционных систем',
        categoryId: 'vent-assembly',
        shortDescription: 'Сборка воздуховодов и вентиляционных элементов',
        images: ['https://s3.datary-dev.ru/tp1219/vent/66696eeacd41d3d54f8f456b1a7c9c71.jpg'],
        description: 'Выполняем сборку вентиляционных систем из изготовленных элементов. Производится соединение воздуховодов, установка крепежа и подготовка к монтажу на объекте.',
        specs: [['Тип работ', 'сборка'], ['Изделия', 'воздуховоды и фасонные элементы'], ['Назначение', 'вентиляционные системы'], ['Формат', 'производственная сборка'], ['Подготовка', 'под монтаж']],
      },
      {
        id: 'vent-service-vent-assembly-2',
        title: 'Монтаж вентиляции',
        categoryId: 'vent-assembly',
        shortDescription: 'Монтаж воздуховодов и вентиляционных систем',
        images: ['https://s3.datary-dev.ru/tp1219/vent/proizvodstvo-vozduhovodov-7.jpg'],
        description: 'Выполняем монтаж вентиляционных систем на объектах различного назначения. Работы включают установку воздуховодов, крепежа и фасонных элементов.',
        specs: [['Тип работ', 'монтаж вентиляции'], ['Объекты', 'жилые и промышленные'], ['Изделия', 'воздуховоды и крепёж'], ['Монтаж', 'на объекте'], ['Назначение', 'инженерные системы']],
      },
    ],
    galleryCaption: ['Изготовление воздуховодов', 'Фасонные элементы и крепёж', 'Монтаж вентиляции'],
    knowledgeArticles: [
      {
        id: 'ventilation-kb-1',
        title: 'Круглые или прямоугольные воздуховоды: что лучше для вашей системы',
        excerpt: 'Форма воздуховода влияет на шум, потери давления и стоимость монтажа.',
        contentBlocks: [
          { type: 'text', text: 'Круглые воздуховоды изготавливаются методом вальцовки с фальцевым швом. За счёт формы у них меньше гидравлическое сопротивление — воздух движется с меньшими потерями давления и меньшим шумом. Оптимальны для промышленных объектов, кафе, ресторанов, где воздуховоды остаются в открытом пространстве.' },
          { type: 'image', src: 'https://s3.datary-dev.ru/tp1219/vent/1_afox-22.jpg', alt: 'Круглые и прямоугольные воздуховоды', caption: 'Прямоугольные воздуховоды — удобны для скрытого монтажа' },
          { type: 'text', text: 'Прямоугольные воздуховоды предпочтительны там, где важна компактность: за подвесными потолками, в межэтажных перекрытиях, в узких технических коридорах. Высота сечения может быть всего 100–150 мм, что позволяет сэкономить высоту помещения.' },
          { type: 'text', text: 'Итог: круглые — эффективнее и тише, прямоугольные — компактнее и удобнее при скрытой прокладке. Выбор определяется типом объекта, расположением трассы и требованиями к габаритам.' },
        ],
        image: 'https://s3.datary-dev.ru/tp1219/vent/1_afox-22.jpg',
        readTime: '4 мин',
        tags: ['Воздуховоды', 'Вентиляция', 'Проектирование'],
        relatedItemIds: ['vent-product-vent-ducts-1', 'vent-product-vent-ducts-2', 'vent-product-vent-ducts-3'],
      },
      {
        id: 'ventilation-kb-2',
        title: 'Фасонные элементы вентиляции: почему нельзя обойтись без них',
        excerpt: 'Переходы, отводы и тройники — не «лишние детали», а основа работоспособной системы.',
        contentBlocks: [
          { type: 'text', text: 'Фасонные элементы — это переходы, отводы, тройники, заглушки и врезки. Без них вентиляционная система просто не работает: прямые участки воздуховодов нужно соединять, разветвлять, изменять направление и сечение.' },
          { type: 'image', src: 'https://s3.datary-dev.ru/tp1219/vent/рис 7.jpg', alt: 'Фасонные элементы вентиляции — переходы, отводы, тройники', caption: 'Фасонные элементы для воздуховодов — переходы и отводы' },
          { type: 'text', text: 'Резкий переход между диаметрами без конического переходника создаёт зону вихреобразования — скорость потока в этом месте падает на 20–30%. Это увеличивает нагрузку на вентилятор, повышает шум и снижает производительность всей системы.' },
          { type: 'text', text: 'Грамотно подобранные фасонные элементы обеспечивают плавное изменение направления и сечения, минимальные потери давления и долгосрочную работу системы без лишних затрат на электроэнергию и обслуживание.' },
        ],
        image: 'https://s3.datary-dev.ru/tp1219/vent/рис 7.jpg',
        readTime: '4 мин',
        tags: ['Фасонные элементы', 'Переходы', 'Отводы'],
        relatedItemIds: ['vent-product-vent-fittings-1', 'vent-product-vent-fittings-2', 'vent-product-vent-fittings-3'],
      },
      {
        id: 'ventilation-kb-3',
        title: 'Почему проектировать вентиляцию нужно до начала монтажа',
        excerpt: 'Ошибка на этапе проектирования обходится в 3–5 раз дороже, чем на этапе эскиза.',
        contentBlocks: [
          { type: 'text', text: 'Вентиляция, спроектированная после начала монтажа или «по месту», почти всегда приводит к компромиссам: неоптимальные трассы, лишние повороты, заниженные сечения. В итоге — шум, недостаточный воздухообмен и перерасход электроэнергии на вентиляторы.' },
          { type: 'image', src: 'https://s3.datary-dev.ru/tp1219/vent/Proektirovanie-ventiljacii-i-kondicionirovanija-kvartiry-1024x649.jpg', alt: 'Проектирование вентиляционной системы', caption: 'Проектирование вентиляции до начала монтажных работ' },
          { type: 'text', text: 'Правильная последовательность: сначала расчёт воздухообмена по нормам (СП 60.13330 для промышленных объектов, СанПиН для жилых), затем подбор оборудования и сечений, после — разработка схемы трассировки и спецификация материалов.' },
          { type: 'text', text: 'Проект позволяет изготовить воздуховоды и фасонные элементы точно под объект, избежать доработок при монтаже и сдать систему в эксплуатацию без переделок. Исправление ошибок после монтажа обходится в 3–5 раз дороже, чем проектирование на старте.' },
        ],
        image: 'https://s3.datary-dev.ru/tp1219/vent/Proektirovanie-ventiljacii-i-kondicionirovanija-kvartiry-1024x649.jpg',
        readTime: '4 мин',
        tags: ['Проектирование', 'Вентиляция', 'Монтаж'],
        relatedItemIds: ['vent-service-vent-design-1', 'vent-service-vent-design-2', 'vent-service-vent-assembly-1', 'vent-service-vent-assembly-2'],
      },
      {
        id: 'ventilation-kb-4',
        title: 'Скорость воздуха в воздуховоде: почему заниженное сечение — главная причина шума',
        excerpt: 'Шум вентиляции почти всегда связан с высокой скоростью воздуха. Это лечится правильным подбором сечений.',
        contentBlocks: [
          { type: 'text', text: 'В вентиляционных системах действует прямая связь: чем меньше сечение воздуховода при том же расходе воздуха — тем выше скорость, тем больше аэродинамический шум. Нормативные значения скорости: в главных магистралях — не более 5–6 м/с, в ответвлениях — 3–4 м/с, в решётках и диффузорах — до 2–3 м/с. Превышение нормы в 1.5 раза увеличивает шум в 4–5 раз.' },
          { type: 'image', src: 'https://s3.datary-dev.ru/tp1219/articles/ChatGPT%20Image%209%20%D0%B8%D1%8E%D0%BB.%202026%20%D0%B3.%2C%2013_37_08.png', alt: 'Скорость воздуха и сечение воздуховода — аэродинамический расчёт', caption: 'Правильное сечение воздуховода обеспечивает тихую работу системы' },
          { type: 'text', text: 'Ещё одна причина шума — резкие изменения направления. Колено под 90° без вальцованного радиуса создаёт зону вихреобразования и скачок давления. Правильное колено (радиус закругления не менее одного диаметра трубы) снижает аэродинамическое сопротивление в 2–3 раза по сравнению с прямым углом.' },
          { type: 'text', text: 'Шум от вентиляции после монтажа — почти всегда следствие экономии на диаметрах при проектировании или замены круглого воздуховода на прямоугольный меньшей площади сечения. Дешевле заложить нужные сечения в проект, чем перекладывать смонтированную систему.' },
        ],
        image: 'https://s3.datary-dev.ru/tp1219/articles/ChatGPT%20Image%209%20%D0%B8%D1%8E%D0%BB.%202026%20%D0%B3.%2C%2013_37_08.png',
        readTime: '4 мин',
        tags: ['Шум вентиляции', 'Сечение воздуховодов', 'Аэродинамика'],
        relatedItemIds: ['vent-product-vent-ducts-1', 'vent-product-vent-ducts-2', 'vent-service-vent-design-1'],
      },
      {
        id: 'ventilation-kb-5',
        title: 'Оцинкованные или нержавеющие воздуховоды: когда обычная сталь не подходит',
        excerpt: 'Для большинства объектов оцинковка — оптимальный выбор. Но есть условия, при которых нержавейка обязательна.',
        contentBlocks: [
          { type: 'text', text: 'Оцинкованная сталь (горячее цинкование или гальваника) — стандартный материал для вентиляционных воздуховодов. Срок службы в нормальных условиях — 20–30 лет. Подходит для приточно-вытяжных систем в жилых, офисных и стандартных производственных зданиях. Температура воздуха до 250°C — без ограничений.' },
          { type: 'image', src: 'https://s3.datary-dev.ru/tp1219/articles/ChatGPT%20Image%209%20%D0%B8%D1%8E%D0%BB.%202026%20%D0%B3.%2C%2013_40_15.png', alt: 'Нержавеющие воздуховоды для кухонной вытяжки и пищевого производства', caption: 'Нержавеющие воздуховоды — обязательны для кухонь и химических производств' },
          { type: 'text', text: 'Нержавеющая сталь (AISI 304 или 316) обязательна в четырёх случаях: кухонные вытяжные системы с жировыми отложениями и паром (жир разрушает цинковое покрытие за 2–3 года), химические и лакокрасочные производства с агрессивными парами, пищевые производства по санитарным нормам, а также системы удаления дыма и горячих газов при температуре выше 250°C.' },
          { type: 'text', text: 'Ошибка в выборе материала обходится дорого: замена закрытых воздуховодов за подвесными потолками — это демонтаж отделки и полный перемонтаж системы. Правильный материал закладывается при проектировании, исходя из типа помещения и состава вентилируемой среды.' },
        ],
        image: 'https://s3.datary-dev.ru/tp1219/articles/ChatGPT%20Image%209%20%D0%B8%D1%8E%D0%BB.%202026%20%D0%B3.%2C%2013_40_15.png',
        readTime: '4 мин',
        tags: ['Нержавейка', 'Воздуховоды', 'Материалы'],
        relatedItemIds: ['vent-product-vent-ducts-1', 'vent-product-vent-ducts-2', 'vent-service-vent-production-1', 'vent-service-vent-production-2'],
      },
      {
        id: 'ventilation-kb-6',
        title: 'Как понять, что воздуховод пора чистить: признаки и последствия загрязнения',
        excerpt: 'Загрязнённый воздуховод — это не только запах. Это риск пожара, снижение производительности и рост расходов на электроэнергию.',
        contentBlocks: [
          { type: 'text', text: 'Первый признак загрязнения — снижение воздухообмена при неизменных настройках оборудования. Пыль и жировые отложения сужают сечение воздуховода, увеличивая аэродинамическое сопротивление. Вентилятор потребляет больше энергии, но прокачивает меньше воздуха. Второй признак — появление запаха при включении системы.' },
          { type: 'image', src: 'https://s3.datary-dev.ru/tp1219/articles/ChatGPT%20Image%209%20%D0%B8%D1%8E%D0%BB.%202026%20%D0%B3.%2C%2013_39_34.png', alt: 'Загрязнение воздуховода — жировые отложения в кухонной вытяжке', caption: 'Жировые отложения в вытяжном воздуховоде — риск пожара и снижение тяги' },
          { type: 'text', text: 'Кухонные вытяжки — наиболее критичный случай. Жировые отложения в воздуховоде — горючий материал, накапливающийся у нагретых поверхностей. По нормам ПБ кухонные вытяжные каналы в общепите должны чиститься не реже одного раза в 3 месяца. В жилых домах при интенсивной готовке — раз в год.' },
          { type: 'text', text: 'Для систем промышленной вентиляции нормируется допустимая толщина слоя загрязнений: по нормативным документам воздуховоды подлежат очистке при слое пыли более 1 мм на горизонтальных участках. На практике периодичность зависит от типа производства: деревообработка — ежеквартально, металлообработка — раз в полгода, офисные объекты — раз в 2–3 года.' },
        ],
        image: 'https://s3.datary-dev.ru/tp1219/articles/ChatGPT%20Image%209%20%D0%B8%D1%8E%D0%BB.%202026%20%D0%B3.%2C%2013_39_34.png',
        readTime: '4 мин',
        tags: ['Чистка воздуховодов', 'Техобслуживание', 'Пожарная безопасность'],
        relatedItemIds: ['vent-service-vent-assembly-1', 'vent-service-vent-assembly-2'],
      },
      {
        id: 'ventilation-kb-7',
        title: 'Балансировка вентиляционной системы: что это и почему без неё одна комната задыхается, а другая — сквозит',
        excerpt: 'Производительность вентилятора — это общий расход воздуха. Как этот воздух распределится по комнатам — вопрос балансировки.',
        contentBlocks: [
          { type: 'text', text: 'Вентиляционная система — это сеть ветвей с разным аэродинамическим сопротивлением. Воздух, как вода, идёт по пути наименьшего сопротивления: ближайшая к вентилятору ветвь получит больший поток, дальняя — меньший. Без балансировки реальное распределение воздуха может отличаться от расчётного в 2–3 раза для разных зон.' },
          { type: 'image', src: 'https://s3.datary-dev.ru/tp1219/articles/ChatGPT%20Image%209%20%D0%B8%D1%8E%D0%BB.%202026%20%D0%B3.%2C%2013_41_46.png', alt: 'Балансировка вентиляционной системы — регулировка расходов по зонам', caption: 'Регулирующие клапаны балансируют расход воздуха по ветвям системы' },
          { type: 'text', text: 'Балансировка — это регулировка расхода по каждой ветви с помощью дроссель-клапанов или регуляторов расхода (VAV). Процедура выполняется после монтажа: специалист измеряет расход на каждом диффузоре анемометром и прикрывает клапаны на «лёгких» ветвях до достижения нужного расхода по проекту.' },
          { type: 'text', text: 'Отсутствие балансировки — одна из главных причин жалоб на вентиляцию после ввода объекта: «в переговорной жарко, а в опенспейсе дует». Балансировка занимает несколько часов на типовой объект и стоит значительно меньше, чем переделка трассировки или замена вентиляционного оборудования.' },
        ],
        image: 'https://s3.datary-dev.ru/tp1219/articles/ChatGPT%20Image%209%20%D0%B8%D1%8E%D0%BB.%202026%20%D0%B3.%2C%2013_41_46.png',
        readTime: '5 мин',
        tags: ['Балансировка', 'Распределение воздуха', 'Наладка'],
        relatedItemIds: ['vent-service-vent-design-1', 'vent-service-vent-design-2', 'vent-service-vent-assembly-1'],
      },
      {
        id: 'ventilation-kb-8',
        title: 'Вытяжка без притока: почему мощный вентилятор в цеху «не тянет»',
        excerpt: 'Поставили вентилятор вдвое мощнее — воздух не пошёл. Это не брак оборудования, а нарушенный баланс системы.',
        contentBlocks: [
          { type: 'text', text: 'Вентилятор не создаёт воздух — он его перемещает. Сколько воздуха удалено из помещения, столько же должно в него поступить. Если организована только вытяжка, а приток не предусмотрен, в помещении возникает разрежение, и фактическая производительность вентилятора падает до величины, определяемой случайными неплотностями: щелями в воротах, окнах и вводах коммуникаций.' },
          { type: 'image', src: '', alt: 'Схема баланса притока и вытяжки в производственном помещении', caption: 'Удалённый объём воздуха должен быть компенсирован организованным притоком' },
          { type: 'text', text: 'Наглядный признак проблемы: паспортная производительность вентилятора 3000 м³/ч, а по факту анемометр показывает 800–1000 м³/ч. Замена вентилятора на более мощный ситуацию почти не улучшает — рабочая точка всё равно упирается в сопротивление системы, зато шум и энергопотребление заметно растут.' },
          { type: 'text', text: 'Опаснее другой эффект — опрокидывание тяги. При разрежении воздух начинает поступать по пути наименьшего сопротивления, и таким путём часто оказывается дымоход газового котла или печи: в помещение затягивает продукты сгорания. Именно поэтому в помещениях с оборудованием, имеющим открытую камеру сгорания, вытяжка проектируется только совместно с организованным притоком.' },
          { type: 'text', text: 'Как решается задача: приток организуют через приточные установки, стеновые клапаны или решётки с расчётным сечением, а расходы притока и вытяжки сводят в балансовой таблице по помещениям. В производственных зданиях допускается сознательный дисбаланс: вытяжка преобладает там, где нельзя выпускать загрязнения за пределы участка (покрасочный пост, сварка), приток — там, где загрязнения нельзя впускать (чистые зоны, склад готовой продукции). Это решение принимается на стадии проектирования, а не при монтаже.' },
        ],
        image: '',
        readTime: '5 мин',
        tags: ['Приток и вытяжка', 'Баланс', 'Проектирование'],
        relatedItemIds: ['vent-service-vent-design-1', 'vent-service-vent-assembly-2', 'vent-product-vent-ducts-1'],
      },
      {
        id: 'ventilation-kb-9',
        title: 'Гибкая гофра вместо жёсткого воздуховода: чем платит система',
        excerpt: 'Гофру ставят, потому что это быстро и без фасонных частей. Через год система гудит, а расход падает вдвое.',
        contentBlocks: [
          { type: 'text', text: 'Гибкий гофрированный воздуховод — удобный материал: он тянется, гнётся в любую сторону, не требует отводов и переходов. Именно поэтому им нередко заменяют жёсткие участки целиком. Проблема в том, что аэродинамически гофра — совсем другой канал, и расчёт, сделанный для гладкого воздуховода, к ней неприменим.' },
          { type: 'image', src: '', alt: 'Сравнение гибкого гофрированного и жёсткого оцинкованного воздуховода', caption: 'Ребристая внутренняя поверхность кратно повышает сопротивление канала' },
          { type: 'text', text: 'Внутренняя поверхность гофры ребристая, и коэффициент сопротивления такого канала в 3–5 раз выше, чем у гладкого оцинкованного воздуховода того же диаметра. Если гофра ещё и не растянута полностью — а на монтаже её почти всегда оставляют сжатой «с запасом» — сопротивление возрастает ещё кратно. Вентилятор смещается по своей характеристике, расход падает, а потребляемая мощность и шум растут.' },
          { type: 'text', text: 'Второй эффект — провисание. Между точками крепления гофра образует провисы, в нижних точках которых скапливается конденсат, а на кухонной вытяжке — жировые отложения. Это одновременно дополнительное сопротивление, источник запаха и пожарная нагрузка на вытяжках от плит и жарочных поверхностей.' },
          { type: 'text', text: 'Где гофра уместна: короткие вставки до 1–1,5 м — подключение диффузора, гибкая развязка от вентилятора для гашения вибрации, обход локального препятствия. Требования при монтаже: растягивать не менее чем на 80 % длины, крепить с шагом, исключающим провис, не делать изгибов радиусом меньше диаметра. Всё остальное — жёсткий воздуховод с нормальными фасонными элементами: отводами, переходами и тройниками, рассчитанными на плавное течение потока.' },
        ],
        image: '',
        readTime: '4 мин',
        tags: ['Гофра', 'Сопротивление', 'Воздуховоды'],
        relatedItemIds: ['vent-product-vent-ducts-1', 'vent-product-vent-fittings-2', 'vent-service-vent-production-4'],
      },
      {
        id: 'ventilation-kb-10',
        title: 'Дефлектор: что он реально делает и когда бесполезен',
        excerpt: 'Распространённое ожидание — дефлектор заменит вентилятор. Разбираем, сколько тяги он действительно даёт.',
        contentBlocks: [
          { type: 'text', text: 'Дефлектор — насадка на верхний срез вытяжной шахты. Принцип его работы аэродинамический: набегающий ветер обтекает корпус, в сужении скорость потока возрастает, а давление падает. Пониженное давление над устьем шахты подсасывает воздух из канала — тяга усиливается.' },
          { type: 'image', src: '', alt: 'Вентиляционный дефлектор на устье вытяжной шахты', caption: 'Эффект дефлектора зависит от ветра, а защитная функция работает всегда' },
          { type: 'text', text: 'Ключевое ограничение следует прямо из принципа: эффект зависит от ветра. При скорости ветра 3–5 м/с грамотно установленный дефлектор даёт прибавку разрежения в единицы паскалей — это заметная добавка к естественной тяге, но она несопоставима с напором даже слабого канального вентилятора (50–150 Па). В штиль дефлектор не даёт ничего сверх естественной тяги, а зимой основную работу всё равно выполняет разность температур внутри и снаружи.' },
          { type: 'text', text: 'Вторая, не менее важная функция — защита. Дефлектор закрывает устье от прямого попадания дождя и снега, от задувания ветром в канал (то есть от опрокидывания тяги при ветре определённого направления) и от птиц. На многих объектах именно это, а не прирост тяги, оказывается главной причиной установки.' },
          { type: 'text', text: 'Условия, при которых дефлектор работает: устье шахты выведено выше зоны ветрового подпора от конька и соседних строений, сечение дефлектора соответствует сечению канала (сужение сводит эффект на нет), сам канал имеет нормальную площадь и не забит. Если вентиляция не справляется из-за заниженного сечения, длинных горизонтальных участков или отсутствия притока, дефлектор эту задачу не решит — здесь нужен расчёт системы и механическое побуждение.' },
        ],
        image: '',
        readTime: '4 мин',
        tags: ['Дефлектор', 'Естественная тяга', 'Вентшахта'],
        relatedItemIds: ['vent-product-vent-fittings-3', 'vent-product-vent-ducts-1', 'vent-service-vent-design-1'],
      },
    ],
  },
  fasteners: {
    residentSlug: 'fasteners',
    intro:
      'Производство строительного крепежа и метизов: гвозди, саморезы, болты и нестандартный крепёж. Штамповка и обработка металлических изделий по ГОСТ и чертежам заказчика.',
    productCategories: createCategories([
      ['nails', 'Гвозди'],
      ['screws', 'Саморезы'],
      ['bolts', 'Болты и резьбовой крепёж'],
      ['mounting', 'Монтажный крепёж'],
    ]),
    products: [
      // ── Гвозди ──────────────────────────────────────────────────
      {
        id: 'fast-product-nails-1',
        title: 'Строительные гвозди',
        categoryId: 'nails',
        shortDescription: 'Гвозди общего назначения для строительных работ',
        images: ['https://s3.datary-dev.ru/tp1219/metiz/6552210499.jpg'],
        description:
          'Строительные гвозди для монтажа деревянных конструкций, обрешётки, настилов и временных сооружений. Выпускаются различные диаметры и длины в соответствии с ГОСТ.',
        specs: [
          ['Материал', 'Стальная проволока'],
          ['Диаметр', 'От 1.2 до 6 мм'],
          ['Длина', 'От 20 до 250 мм'],
          ['Покрытие', 'Без покрытия'],
          ['Стандарт', 'ГОСТ'],
        ],
      },
      {
        id: 'fast-product-nails-2',
        title: 'Ершёные гвозди',
        categoryId: 'nails',
        shortDescription: 'Гвозди с насечкой для усиленной фиксации',
        images: ['https://s3.datary-dev.ru/tp1219/metiz/643_original.jpg'],
        description:
          'Ершёные гвозди с кольцевой насечкой для повышенного удержания в древесине. Используются при сборке поддонов, каркасов, настилов и конструкций с повышенной нагрузкой.',
        specs: [
          ['Тип', 'Ершёный'],
          ['Материал', 'Сталь'],
          ['Длина', 'От 40 до 120 мм'],
          ['Назначение', 'Усиленное крепление'],
          ['Применение', 'Деревянные конструкции'],
        ],
      },
      {
        id: 'fast-product-nails-3',
        title: 'Кровельные гвозди',
        categoryId: 'nails',
        shortDescription: 'Гвозди для монтажа кровельных материалов',
        images: ['https://s3.datary-dev.ru/tp1219/metiz/6dyjf9qhio0vwf404vny0wg2guzwwmug.png'],
        description:
          'Кровельные гвозди с увеличенной шляпкой для крепления мягкой кровли, рулонных материалов и листовых покрытий. Подходят для наружных строительных работ.',
        specs: [
          ['Тип', 'Кровельный'],
          ['Шляпка', 'Увеличенная'],
          ['Материал', 'Сталь'],
          ['Назначение', 'Кровельные работы'],
          ['Стандарт', 'ГОСТ'],
        ],
      },
      // ── Саморезы ─────────────────────────────────────────────────
      {
        id: 'fast-product-screws-1',
        title: 'Саморезы по металлу',
        categoryId: 'screws',
        shortDescription: 'Саморезы для крепления листового металла',
        images: ['https://s3.datary-dev.ru/tp1219/metiz/a9cb01e0f6a711e9b5011c1b0d9d8d2e_a9cb01e2f6a711e9b5011c1b0d9d8d2e.jpeg'],
        description:
          'Саморезы по металлу для крепления профлиста, металлоконструкций, фасонных элементов и инженерных систем. Подходят для монтажа тонколистового металла.',
        specs: [
          ['Материал', 'Углеродистая сталь'],
          ['Назначение', 'Металл'],
          ['Тип резьбы', 'Мелкая'],
          ['Покрытие', 'Оцинкованное'],
          ['Диаметр', 'От 3.5 до 6.3 мм'],
        ],
      },
      {
        id: 'fast-product-screws-2',
        title: 'Саморезы по дереву',
        categoryId: 'screws',
        shortDescription: 'Крепёж для деревянных конструкций и настилов',
        images: ['https://s3.datary-dev.ru/tp1219/metiz/sgy594hmm52xuzfynpqzxq0fhp0z8chg.jpg'],
        description:
          'Саморезы по дереву для монтажа деревянных конструкций, настилов, каркасов и отделочных материалов. Производятся различные длины и типы головок.',
        specs: [
          ['Назначение', 'Дерево'],
          ['Тип резьбы', 'Крупная'],
          ['Материал', 'Сталь'],
          ['Покрытие', 'Оцинкованное'],
          ['Длина', 'От 25 до 150 мм'],
        ],
      },
      {
        id: 'fast-product-screws-3',
        title: 'Кровельные саморезы',
        categoryId: 'screws',
        shortDescription: 'Саморезы с шайбой для профлиста и кровли',
        images: ['https://s3.datary-dev.ru/tp1219/metiz/samorez-krovelnyj-min.jpg'],
        description:
          'Кровельные саморезы с пресс-шайбой для монтажа профнастила, доборных элементов и кровельных покрытий. Используются при установке фасадных и кровельных систем.',
        specs: [
          ['Тип', 'Кровельный'],
          ['Шайба', 'EPDM'],
          ['Покрытие', 'Оцинковка'],
          ['Назначение', 'Профлист'],
          ['Применение', 'Наружный монтаж'],
        ],
      },
      // ── Болты и резьбовой крепёж ──────────────────────────────────
      {
        id: 'fast-product-bolts-1',
        title: 'Болты шестигранные',
        categoryId: 'bolts',
        shortDescription: 'Стандартные болты для сборки конструкций',
        images: ['https://s3.datary-dev.ru/tp1219/metiz/bolt-s-shestigrannoy-golovkoy-m6-kh-20-gost-7798_70_-b37_soberizavod-.jpg'],
        description:
          'Шестигранные болты для монтажа металлоконструкций, оборудования, инженерных систем и промышленного крепежа. Изготавливаются по стандартным размерам.',
        specs: [
          ['Тип головки', 'Шестигранная'],
          ['Резьба', 'Метрическая'],
          ['Материал', 'Сталь'],
          ['Диаметр', 'От М6 до М24'],
          ['Стандарт', 'ГОСТ'],
        ],
      },
      {
        id: 'fast-product-bolts-2',
        title: 'Болты по чертежам',
        categoryId: 'bolts',
        shortDescription: 'Изготовление нестандартных болтов под заказ',
        images: ['https://s3.datary-dev.ru/tp1219/metiz/10602.png'],
        description:
          'Производство нестандартных болтов по образцам, чертежам и техническому заданию заказчика. Возможна накатка резьбы, изменение длины и изготовление специальных форм.',
        specs: [
          ['Производство', 'По чертежу'],
          ['Резьба', 'Накатка'],
          ['Материал', 'Сталь'],
          ['Назначение', 'Промышленное'],
          ['Серия', 'Мелкосерийное производство'],
        ],
      },
      {
        id: 'fast-product-bolts-3',
        title: 'Шпильки резьбовые',
        categoryId: 'bolts',
        shortDescription: 'Резьбовые шпильки для монтажа и соединений',
        images: ['https://s3.datary-dev.ru/tp1219/metiz/3-gor.jpg'],
        description:
          'Резьбовые шпильки для строительных, инженерных и монтажных работ. Используются при сборке оборудования, вентиляции, металлоконструкций и крепёжных узлов.',
        specs: [
          ['Тип', 'Резьбовая шпилька'],
          ['Резьба', 'Метрическая'],
          ['Материал', 'Сталь'],
          ['Длина', 'Под заказ'],
          ['Назначение', 'Монтаж'],
        ],
      },
      // ── Монтажный крепёж ──────────────────────────────────────────
      {
        id: 'fast-product-mounting-1',
        title: 'Металлические хомуты',
        categoryId: 'mounting',
        shortDescription: 'Хомуты для труб, вентиляции и крепления',
        images: ['https://s3.datary-dev.ru/tp1219/metiz/7z3zrhazkq2wdh7f5ipgk76jknnac8ud.jpg'],
        description:
          'Металлические хомуты различных форм для крепления труб, вентиляционных каналов и инженерных коммуникаций. Изготавливаются круглые, овальные и специальные формы.',
        specs: [
          ['Тип', 'Монтажный хомут'],
          ['Форма', 'Круглая и овальная'],
          ['Материал', 'Оцинкованная сталь'],
          ['Диаметр', 'Под заказ'],
          ['Назначение', 'Вентиляция и трубопроводы'],
        ],
      },
      {
        id: 'fast-product-mounting-2',
        title: 'Подвесы для потолков',
        categoryId: 'mounting',
        shortDescription: 'Крепёжные элементы для потолочных систем',
        images: ['https://s3.datary-dev.ru/tp1219/metiz/armstrong-podves-800x800.jpg'],
        description:
          'Штампованные подвесы для монтажа потолочных систем и металлических профилей. Производятся на прессовом оборудовании для строительных и отделочных работ.',
        specs: [
          ['Тип', 'Потолочный подвес'],
          ['Материал', 'Оцинкованная сталь'],
          ['Изготовление', 'Штамповка'],
          ['Назначение', 'Потолочные системы'],
          ['Совместимость', 'Профиль 60x27'],
        ],
      },
      {
        id: 'fast-product-mounting-3',
        title: 'Усиливающие уголки',
        categoryId: 'mounting',
        shortDescription: 'Штампованные уголки для усиления соединений',
        images: ['https://s3.datary-dev.ru/tp1219/metiz/images.jfif'],
        description:
          'Усиливающие металлические уголки для сборки каркасных и строительных конструкций. Изготавливаются методом штамповки с отверстиями под крепёж.',
        specs: [
          ['Тип', 'Усиливающий уголок'],
          ['Материал', 'Сталь'],
          ['Технология', 'Штамповка'],
          ['Отверстия', 'Монтажные'],
          ['Назначение', 'Каркасные конструкции'],
        ],
      },
    ],
    serviceCategories: createCategories([
      ['production', 'Производство крепежа'],
      ['stamping', 'Штамповка и обработка'],
    ]),
    services: [
      // ── Производство крепежа ──────────────────────────────────────
      {
        id: 'fast-service-production-1',
        title: 'Изготовление гвоздей',
        categoryId: 'production',
        shortDescription: 'Производство гвоздей различных размеров',
        images: ['https://s3.datary-dev.ru/tp1219/metiz/8b12ad4d59ba9c8f1328398f14b813e8.jpg'],
        description:
          'Изготовление строительных, кровельных и специальных гвоздей на гвоздильном оборудовании. Выпускаются стандартные размеры и партии под требования заказчика.',
        specs: [
          ['Оборудование', 'Гвоздильный станок'],
          ['Стандарт', 'ГОСТ'],
          ['Тип производства', 'Серийное'],
          ['Материал', 'Стальная проволока'],
          ['Размеры', 'Под заказ'],
        ],
      },
      {
        id: 'fast-service-production-2',
        title: 'Производство саморезов',
        categoryId: 'production',
        shortDescription: 'Выпуск саморезов для строительства и монтажа',
        images: ['https://s3.datary-dev.ru/tp1219/metiz/bra1csybznl8iz9xk8rqg300yvf3dmla.png'],
        description:
          'Производство саморезов по металлу, дереву и кровельных саморезов. Возможен подбор параметров резьбы, длины и типа головки под задачу заказчика.',
        specs: [
          ['Оборудование', 'Саморезный станок'],
          ['Назначение', 'Металл и дерево'],
          ['Покрытие', 'Оцинковка'],
          ['Тип производства', 'Серийное'],
          ['Размеры', 'Под заказ'],
        ],
      },
      {
        id: 'fast-service-production-3',
        title: 'Накатка резьбы',
        categoryId: 'production',
        shortDescription: 'Формирование резьбы на металлических деталях',
        images: ['https://s3.datary-dev.ru/tp1219/metiz/nakatka_rezby_1726052187.jpg'],
        description:
          'Накатка метрической резьбы на металлических заготовках и крепёжных элементах. Используется при производстве болтов, шпилек и специальных крепёжных изделий.',
        specs: [
          ['Тип резьбы', 'Метрическая'],
          ['Метод', 'Накатка'],
          ['Материал', 'Сталь'],
          ['Назначение', 'Крепёж'],
          ['Производство', 'Серийное и штучное'],
        ],
      },
      {
        id: 'fast-service-production-4',
        title: 'Изготовление нестандартного крепежа',
        categoryId: 'production',
        shortDescription: 'Крепёж по образцам и чертежам заказчика',
        images: ['https://s3.datary-dev.ru/tp1219/metiz/hy-metal-fasteners-3438926.jpg'],
        description:
          'Производство нестандартного крепежа по техническому заданию, образцам и чертежам. Возможна механическая обработка, штамповка, гибка и изготовление специальных форм.',
        specs: [
          ['Производство', 'По чертежам'],
          ['Партии', 'От штучного до серийного'],
          ['Технологии', 'Штамповка и гибка'],
          ['Материал', 'Сталь'],
          ['Назначение', 'Промышленное'],
        ],
      },
      // ── Штамповка и обработка ─────────────────────────────────────
      {
        id: 'fast-service-stamping-1',
        title: 'Штамповка металлических изделий',
        categoryId: 'stamping',
        shortDescription: 'Изготовление крепежа методом штамповки',
        images: ['https://s3.datary-dev.ru/tp1219/metiz/hy-brass-fasteners-1270345.jpg'],
        description:
          'Штамповка крепёжных и монтажных элементов на прессовом оборудовании. Выпускаются уголки, пластины, подвесы, крепления и другие изделия из листового металла.',
        specs: [
          ['Оборудование', 'Пресс'],
          ['Материал', 'Листовой металл'],
          ['Тип изделий', 'Крепёж'],
          ['Производство', 'Серийное'],
          ['Толщина металла', 'До 0.8 мм'],
        ],
      },
      {
        id: 'fast-service-stamping-2',
        title: 'Изготовление металлических хомутов',
        categoryId: 'stamping',
        shortDescription: 'Производство хомутов различной формы',
        images: ['https://s3.datary-dev.ru/tp1219/metiz/foto-khomutov-santekhnicheskikh.jpg'],
        description:
          'Производство металлических хомутов для труб, вентиляции, инженерных систем и монтажных работ. Изготавливаются круглые, овальные и специальные формы.',
        specs: [
          ['Тип изделий', 'Хомуты'],
          ['Форма', 'Круглая и овальная'],
          ['Материал', 'Оцинкованная сталь'],
          ['Назначение', 'Монтаж'],
          ['Размеры', 'Под заказ'],
        ],
      },
      {
        id: 'fast-service-stamping-3',
        title: 'Гибка крепёжных элементов',
        categoryId: 'stamping',
        shortDescription: 'Гибка листового металла для крепёжных изделий',
        images: ['https://s3.datary-dev.ru/tp1219/metiz/diploma.webp'],
        description:
          'Гибка металлических заготовок и крепёжных элементов на листогибочном оборудовании. Выполняется изготовление уголков, пластин и монтажных деталей.',
        specs: [
          ['Длина гиба', 'До 3 м'],
          ['Материал', 'Листовой металл'],
          ['Тип изделий', 'Монтажные элементы'],
          ['Технология', 'ЧПУ'],
          ['Производство', 'Под заказ'],
        ],
      },
    ],
    galleryCaption: ['Производство метизов', 'Контроль качества', 'Готовый крепёж'],
    knowledgeArticles: [
      {
        id: 'fasteners-kb-1',
        title: 'Ершёные гвозди против обычных: когда нужна усиленная фиксация',
        excerpt: 'Ершёный гвоздь — не экзотика, а стандарт для ответственных деревянных конструкций.',
        contentBlocks: [
          { type: 'text', text: 'Обычный строительный гвоздь держится в древесине за счёт трения. При вибрациях, перепадах влажности и циклических нагрузках дерево немного меняет размер — и гвоздь постепенно выходит. Это критично для настилов, поддонов, строительных лесов и несущих каркасов.' },
          { type: 'image', src: 'https://s3.datary-dev.ru/tp1219/metiz/643_original.jpg', alt: 'Ершёные гвозди с кольцевой насечкой', caption: 'Ершёный гвоздь — кольцевая насечка обеспечивает механический замок в древесине' },
          { type: 'text', text: 'Ершёный гвоздь имеет кольцевую насечку по стержню. После забивания насечка создаёт механический замок с волокнами дерева — вытащить его значительно сложнее. Усилие на вырыв у ершёного гвоздя в 2–3 раза выше, чем у обычного того же диаметра.' },
          { type: 'text', text: 'Применяйте ершёные гвозди везде, где конструкция работает в условиях переменной нагрузки, вибрации или влажности: паллеты, обрешётка, деревянные мосты, причальные сооружения, временные и постоянные настилы.' },
        ],
        image: 'https://s3.datary-dev.ru/tp1219/metiz/643_original.jpg',
        readTime: '3 мин',
        tags: ['Гвозди', 'Ершёные', 'Деревянные конструкции'],
        relatedItemIds: ['fast-product-nails-1', 'fast-product-nails-2', 'fast-product-nails-3'],
      },
      {
        id: 'fasteners-kb-2',
        title: 'Саморезы по металлу и по дереву: почему нельзя их путать',
        excerpt: 'Неправильно подобранный саморез — это не просто эстетика, а риск разрушения соединения.',
        contentBlocks: [
          { type: 'text', text: 'Главное отличие саморезов по металлу и по дереву — в форме резьбы. У саморезов по дереву резьба крупная и редкая: она врезается в волокна и создаёт прочный зацеп. У саморезов по металлу — мелкая и частая: рассчитана на тонкий листовой материал без его разрыва.' },
          { type: 'image', src: 'https://s3.datary-dev.ru/tp1219/articles/6umope1x2am2hsqrb9ebvs3eip3zi9m8.png', alt: 'Кровельные саморезы с EPDM-шайбой', caption: 'Кровельный саморез с EPDM-шайбой — для герметичного крепления профлиста' },
          { type: 'text', text: 'Если вкрутить саморез по дереву в металл — крупная резьба не зацепится за тонкий лист, соединение будет ненадёжным. Саморез по металлу в дерево — частая резьба не создаст достаточного зацепа, и при нагрузке он просто провернётся.' },
          { type: 'text', text: 'Для кровельных работ используются саморезы с EPDM-шайбой — она уплотняет место прохода через профлист и предотвращает попадание воды. Это обязательный элемент при монтаже наружных конструкций.' },
        ],
        image: 'https://s3.datary-dev.ru/tp1219/articles/6umope1x2am2hsqrb9ebvs3eip3zi9m8.png',
        readTime: '3 мин',
        tags: ['Саморезы', 'Крепёж', 'Монтаж'],
        relatedItemIds: ['fast-product-screws-1', 'fast-product-screws-2', 'fast-product-screws-3'],
      },
      {
        id: 'fasteners-kb-3',
        title: 'Нестандартный крепёж: когда стоит заказывать и что нужно подготовить',
        excerpt: 'Серийный крепёж покрывает 80% задач. Но иногда нужна деталь, которой нет в каталоге.',
        contentBlocks: [
          { type: 'text', text: 'Нестандартный крепёж заказывают в трёх основных случаях: оригинальная деталь снята с производства и аналога в каталогах нет; серийный крепёж не подходит по геометрии или материалу; нужна небольшая партия специфических элементов для уникального оборудования или монтажной системы.' },
          { type: 'image', src: 'https://s3.datary-dev.ru/tp1219/articles/828_original.jpg', alt: 'Нестандартный крепёж по чертежам и образцам', caption: 'Производство крепежа по образцу или чертежу — от одной штуки' },
          { type: 'text', text: 'Для расчёта стоимости и сроков достаточно прислать фото образца с указанием размеров, эскиз или чертёж. Важно указать: материал, покрытие, требуемую прочность и объём партии.' },
          { type: 'text', text: 'Производство нестандартного крепежа возможно от 1 штуки. Чем точнее исходные данные — тем быстрее будет изготовление и тем меньше итераций потребуется для согласования.' },
        ],
        image: 'https://s3.datary-dev.ru/tp1219/articles/828_original.jpg',
        readTime: '3 мин',
        tags: ['Нестандартный крепёж', 'Штамповка', 'Производство'],
        relatedItemIds: ['fast-service-production-4', 'fast-product-bolts-2', 'fast-service-stamping-1', 'fast-service-production-3'],
      },
      {
        id: 'fasteners-kb-4',
        title: 'Оцинкованные или нержавеющие саморезы: когда разница критична',
        excerpt: 'Обычный саморез на кровле или в уличной конструкции покроется ржавчиной за 1–2 года. Выбор покрытия — это срок службы соединения.',
        contentBlocks: [
          { type: 'text', text: 'Стандартные саморезы без покрытия или с тонким фосфатным покрытием — для внутренних сухих помещений. На улице они начинают ржаветь уже в первый сезон: пятна ржавчины на профлисте, дереве или штукатурке вокруг точки крепления — надёжный признак неправильно подобранного крепежа.' },
          { type: 'image', src: 'https://s3.datary-dev.ru/tp1219/articles/ChatGPT%20Image%209%20%D0%B8%D1%8E%D0%BB.%202026%20%D0%B3.%2C%2013_43_02.png', alt: 'Оцинкованные и нержавеющие саморезы для наружного применения', caption: 'Кровельные саморезы с цинковым покрытием и EPDM-шайбой — стандарт для улицы' },
          { type: 'text', text: 'Оцинкованные саморезы (горячее или гальваническое цинкование) — оптимальный выбор для большинства наружных конструкций: кровли, заборов, навесов, деревянных фасадов. Толщина цинкового слоя у качественного крепежа — 5–12 мкм (гальваника) или 45–80 мкм (горячее цинкование). Срок службы в умеренном климате — 10–20 лет.' },
          { type: 'text', text: 'Нержавеющие саморезы (AISI 304 или 316) необходимы в агрессивных условиях: морской климат, промышленные атмосферы с высоким содержанием SO₂, химические объекты, бани и сауны с постоянным конденсатом. Стоят в 5–10 раз дороже оцинкованных, но в тяжёлых условиях это оправдано. Для стандартного загородного строительства нержавейка избыточна.' },
        ],
        image: 'https://s3.datary-dev.ru/tp1219/articles/ChatGPT%20Image%209%20%D0%B8%D1%8E%D0%BB.%202026%20%D0%B3.%2C%2013_43_02.png',
        readTime: '4 мин',
        tags: ['Саморезы', 'Оцинковка', 'Нержавейка'],
        relatedItemIds: ['fast-product-screws-1', 'fast-product-screws-2', 'fast-product-screws-3'],
      },
      {
        id: 'fasteners-kb-5',
        title: 'Гвоздь или саморез: что держит крепче и в каких конструкциях это важно',
        excerpt: 'Саморез выдёргивается с трудом. Но при боковой нагрузке гвоздь надёжнее. Всё зависит от направления силы.',
        contentBlocks: [
          { type: 'text', text: 'Гвоздь и саморез работают принципиально по-разному. Гвоздь держится за счёт трения по длине тела — он хорошо работает на срез (боковая нагрузка перпендикулярно оси) и удовлетворительно на вырывание. Саморез держится резьбой — отлично работает на вырывание (нагрузка вдоль оси), но значительно хуже, чем гвоздь, при ударной боковой нагрузке: резьба может вырезать паз в древесине, и тогда крепление ослабевает.' },
          { type: 'image', src: 'https://s3.datary-dev.ru/tp1219/articles/ChatGPT%20Image%209%20%D0%B8%D1%8E%D0%BB.%202026%20%D0%B3.%2C%2013_43_38.png', alt: 'Сравнение гвоздя и самореза — направление нагрузки', caption: 'Гвоздь — на срез, саморез — на вырывание: выбор зависит от направления нагрузки' },
          { type: 'text', text: 'Деревянные конструкции под динамической нагрузкой — стропила, обрешётка, половые лаги — скрепляются гвоздями не случайно. При колебаниях здания и температурных деформациях древесины гвоздь «играет» вместе с ней, не разрушая волокно. Саморез при многократном нагружении постепенно разбивает канал в древесине и выходит.' },
          { type: 'text', text: 'На практике: каркасное домостроение по нормативам (СП 64) требует именно гвоздей в узлах стропильной системы. Для крепления обшивки, где нагрузка направлена на вырывание (гипсокартон к стойке, половая доска к лаге) — саморез. Оба вида крепежа имеют свою область применения, и замена одного другим без учёта нагрузок снижает надёжность конструкции.' },
        ],
        image: 'https://s3.datary-dev.ru/tp1219/articles/ChatGPT%20Image%209%20%D0%B8%D1%8E%D0%BB.%202026%20%D0%B3.%2C%2013_43_38.png',
        readTime: '4 мин',
        tags: ['Гвозди', 'Саморезы', 'Нагрузка'],
        relatedItemIds: ['fast-product-nails-1', 'fast-product-nails-2', 'fast-product-screws-1'],
      },
      {
        id: 'fasteners-kb-6',
        title: 'Момент затяжки болтов: почему «затянул нормально» — не технология',
        excerpt: 'Недотяжка ведёт к ослаблению и вибрационному разрушению. Перетяжка — к срыву резьбы. Оба сценария плохи.',
        contentBlocks: [
          { type: 'text', text: 'Болтовое соединение создаёт усилие зажима, которое удерживает детали от взаимного смещения. Это усилие зависит от момента затяжки — и у каждой комбинации диаметра и класса прочности есть свои нормативные значения. Класс прочности обозначается на головке болта: 8.8 означает временное сопротивление 800 МПа и предел текучести 640 МПа; 10.9 и 12.9 — более прочные болты для ответственных соединений.' },
          { type: 'image', src: 'https://s3.datary-dev.ru/tp1219/articles/ChatGPT%20Image%209%20%D0%B8%D1%8E%D0%BB.%202026%20%D0%B3.%2C%2013_45_48.png', alt: 'Класс прочности болтов 8.8, 10.9, 12.9 — маркировка на головке', caption: 'Маркировка на болте: класс прочности определяет допустимый момент затяжки' },
          { type: 'text', text: 'Недотяжка — наиболее частая ошибка. При отсутствии расчётного усилия зажима детали смещаются относительно друг друга при нагрузке, болт работает на срез вместо зажима, резьба и поверхности изнашиваются. В вибронагруженных конструкциях недотянутые болты самоотворачиваются без стопорения.' },
          { type: 'text', text: 'Перетяжка разрушает либо резьбу (при превышении предела текучести болта), либо детали в зоне крепления. Особенно опасно для алюминия, пластика, чугуна и стекловолокна — материалов с ограниченной прочностью на сжатие. Для болтов с нормируемым моментом (фланцевые, анкерные, структурные) нужен динамометрический ключ — единственный надёжный инструмент.' },
        ],
        image: 'https://s3.datary-dev.ru/tp1219/articles/ChatGPT%20Image%209%20%D0%B8%D1%8E%D0%BB.%202026%20%D0%B3.%2C%2013_45_48.png',
        readTime: '5 мин',
        tags: ['Болты', 'Момент затяжки', 'Класс прочности'],
        relatedItemIds: ['fast-product-bolts-1', 'fast-product-bolts-2', 'fast-product-bolts-3'],
      },
      {
        id: 'fasteners-kb-7',
        title: 'Дюбели и анкеры: как выбрать под тип основания и характер нагрузки',
        excerpt: 'Анкер, который держит 500 кг в монолитном бетоне, вырвется из газобетона с нагрузкой 50 кг. Основание меняет всё.',
        contentBlocks: [
          { type: 'text', text: 'Нагрузочная способность дюбеля определяется не только его размером, но и типом основания. В монолитном бетоне класса B25 стандартный дюбель-гвоздь 6×40 мм выдерживает вырывание 800–1000 Н (80–100 кгс). В пустотелом кирпиче тот же дюбель — 150–200 Н (15–20 кгс). В газобетоне — ещё меньше, и только специализированные нейлоновые или металлические дюбели для ячеистых бетонов дают надёжное крепление.' },
          { type: 'image', src: 'https://s3.datary-dev.ru/tp1219/articles/ChatGPT%20Image%209%20%D0%B8%D1%8E%D0%BB.%202026%20%D0%B3.%2C%2013_45_57.png', alt: 'Дюбели для разных типов оснований — бетон, кирпич, газобетон', caption: 'Разные основания — разные дюбели: выбор по типу материала, а не только по размеру' },
          { type: 'text', text: 'Для кирпича с пустотами существуют дюбели с распорным элементом, который разворачивается в пустоте и создаёт механический захват. Стандартный распорный дюбель в таком кирпиче просто проворачивается, не создавая надёжного крепления.' },
          { type: 'text', text: 'Анкерные болты (распорные, химические) — для ответственных соединений с высокой нагрузкой. Химический анкер (на основе эпоксидной или полиэфирной смолы) заполняет все неровности отверстия и обеспечивает максимальное сцепление в любом основании, включая газобетон и ракушечник. Применяется для крепления лестниц, навесов, кронштейнов фасадных систем и промышленного оборудования.' },
        ],
        image: 'https://s3.datary-dev.ru/tp1219/articles/ChatGPT%20Image%209%20%D0%B8%D1%8E%D0%BB.%202026%20%D0%B3.%2C%2013_45_57.png',
        readTime: '4 мин',
        tags: ['Дюбели', 'Анкеры', 'Монтажный крепёж'],
        relatedItemIds: ['fast-product-mounting-1', 'fast-product-mounting-2', 'fast-product-mounting-3'],
      },
      {
        id: 'fasteners-kb-8',
        title: 'Класс прочности 4.8, 8.8, 10.9: что означают цифры и почему высокопрочный болт не всегда лучше',
        excerpt: 'Взять болт «покрепче» — логичное на вид решение, которое в некоторых узлах приводит к внезапному разрушению.',
        contentBlocks: [
          { type: 'text', text: 'Маркировка класса прочности на головке болта — это два числа через точку, и оба имеют физический смысл. Первое, умноженное на 100, даёт минимальный предел прочности на растяжение в МПа. Произведение первого числа на второе, умноженное на 10, даёт предел текучести. Так, класс 8.8 — это прочность 800 МПа и текучесть 640 МПа, класс 10.9 — 1000 и 900 МПа соответственно.' },
          { type: 'image', src: '', alt: 'Маркировка класса прочности на головках болтов', caption: 'Два числа на головке болта однозначно задают его механические характеристики' },
          { type: 'text', text: 'Практическая разница между классами — не только в несущей способности, но и в характере разрушения. Болты 4.6 и 4.8 из низкоуглеродистой стали пластичны: перед разрушением они заметно вытягиваются. Высокопрочные 10.9 и 12.9 после термообработки существенно прочнее, но значительно менее пластичны — они разрушаются хрупко, без предупреждающей деформации. Там, где узел работает на ударные и знакопеременные нагрузки, это не всегда преимущество.' },
          { type: 'text', text: 'Отдельный риск высокопрочных болтов — водородное охрупчивание. При гальванической оцинковке в структуру стали проникает водород, который у сталей с прочностью выше примерно 1000 МПа вызывает замедленное хрупкое разрушение — через часы или дни после затяжки, без внешней причины. Поэтому для классов 10.9 и выше применяют либо термическое обезводороживание после нанесения покрытия, либо цинкламельные покрытия, не связанные с электролизом.' },
          { type: 'text', text: 'И последнее: болт работает не сам по себе, а в паре с гайкой и в конкретном материале. Гайка должна быть не ниже класса болта — 8 для 8.8, 10 для 10.9, иначе резьба гайки сорвётся раньше, чем реализуется прочность болта. А если болт вкручивается в резьбу мягкой детали (алюминий, тонкая сталь), несущая способность определяется этой резьбой, и болт 12.9 не даст ничего, кроме её срыва. Если стандартного крепежа под задачу нет, болты по чертежам изготавливаются с нужной длиной резьбовой части, формой головки и классом прочности.' },
        ],
        image: '',
        readTime: '5 мин',
        tags: ['Класс прочности', 'Болты', 'Маркировка'],
        relatedItemIds: ['fast-product-bolts-1', 'fast-product-bolts-2', 'fast-product-bolts-3'],
      },
      {
        id: 'fasteners-kb-9',
        title: 'Кровельный саморез с EPDM-шайбой: течёт не отверстие, а перетяжка',
        excerpt: '«Затяну посильнее — не потечёт». На практике именно так и появляется протечка в точке крепления.',
        contentBlocks: [
          { type: 'text', text: 'Кровельный саморез отличается от обычного не только сверлом на конце: под шестигранной головкой у него стоит стальная шайба с привулканизированной прокладкой из EPDM — этилен-пропиленового каучука, стойкого к ультрафиолету и перепадам температур. Герметичность обеспечивает именно упругость этой прокладки, а не плотность прижима металла к металлу.' },
          { type: 'image', src: '', alt: 'Кровельный саморез с EPDM-прокладкой, правильная и избыточная затяжка', caption: 'Прокладка должна равномерно выступать за край шайбы примерно на миллиметр' },
          { type: 'text', text: 'Правильная затяжка — до момента, когда прокладка равномерно расплющится и слегка выступит за край шайбы, примерно на миллиметр. Перетянутый саморез выдавливает резину из-под шайбы полностью, деформирует саму шайбу в конус и продавливает лист: вокруг крепления образуется воронка, в которой стоит вода. Недотянутый оставляет зазор. И то, и другое даёт течь, но перетяжка встречается в разы чаще — шуруповёрт без ограничения момента закручивает быстрее, чем оператор успевает остановиться.' },
          { type: 'text', text: 'Второй частый вопрос — крепить в волну или в прогиб. На кровле саморез ставят в нижнюю волну (прогиб), прилегающую к обрешётке: так лист прижат к опоре, а точка крепления не работает на изгиб. В верхнюю волну крепят только при стеновом монтаже и в местах нахлёста, где это предусмотрено узлом. Саморез должен входить строго перпендикулярно поверхности: при перекосе прокладка обжимается неравномерно и герметичность теряется с одной стороны.' },
          { type: 'text', text: 'Наконец, о ресурсе. При нормальном монтаже EPDM-прокладка служит сопоставимо со сроком службы покрытия, но перетянутая и выдавленная разрушается ультрафиолетом за 2–3 сезона. Практическое правило: выставить на шуруповёрте ограничение момента, проверить на пробном образце и не докручивать «для верности». Расход и шаг крепления считаются по узлу — как правило, 6–8 саморезов на квадратный метр, с обязательным креплением каждой волны по карнизу, коньку и торцам.' },
        ],
        image: '',
        readTime: '4 мин',
        tags: ['Кровельные саморезы', 'EPDM', 'Монтаж кровли'],
        relatedItemIds: ['fast-product-screws-3', 'fast-product-nails-3', 'fast-product-screws-1'],
      },
      {
        id: 'fasteners-kb-10',
        title: 'Накатанная или нарезанная резьба: почему накатка прочнее',
        excerpt: 'Резьба, полученная давлением, а не снятием стружки, выдерживает усталостные нагрузки на 20–30 % дольше. Разбираем, откуда берётся разница.',
        contentBlocks: [
          { type: 'text', text: 'Резьбу можно получить двумя принципиально разными способами. Нарезание — снятие стружки резцом, плашкой или фрезой: берётся заготовка нужного диаметра, и лишний металл удаляется. Накатка — пластическое деформирование: заготовка меньшего диаметра прокатывается между роликами или плашками, и металл вытесняется из впадин в выступы будущей резьбы.' },
          { type: 'image', src: '', alt: 'Накатка резьбы роликами и структура волокон металла в профиле резьбы', caption: 'При накатке волокна металла огибают профиль резьбы, а не перерезаются' },
          { type: 'text', text: 'Разница в прочности объясняется структурой металла. При резании волокна, ориентированные вдоль заготовки, перерезаются: на дне впадины — в самом нагруженном месте — оказываются оборванные волокна и следы инструмента, работающие как концентраторы напряжений. При накатке волокна не рвутся, а огибают профиль, поверхностный слой дополнительно упрочняется наклёпом и получает сжимающие остаточные напряжения. В результате усталостная прочность накатанной резьбы выше на 20–30 %, а износостойкость и чистота поверхности заметно лучше.' },
          { type: 'text', text: 'Есть и производственный аргумент: накатка не образует стружки, идёт в разы быстрее резания и не требует припуска на удаление металла. Именно поэтому весь массовый крепёж — болты, шпильки, саморезы — изготавливается накаткой, а не нарезанием.' },
          { type: 'text', text: 'Когда накатка невозможна или нецелесообразна: слишком твёрдый или малопластичный материал (закалённые стали, чугун, хрупкие сплавы) — металл не течёт, а трескается; внутренняя резьба большого диаметра; единичные детали, для которых изготовление накатного инструмента не окупается; резьба на готовой детали, диаметр которой уже нельзя уменьшить под накатку. В этих случаях резьбу нарезают, а требуемую прочность обеспечивают запасом по сечению. При заказе нестандартного крепежа способ получения резьбы стоит обсудить сразу: от него зависят и ресурс изделия, и стоимость партии.' },
        ],
        image: '',
        readTime: '5 мин',
        tags: ['Накатка резьбы', 'Прочность', 'Производство крепежа'],
        relatedItemIds: ['fast-service-production-3', 'fast-product-bolts-3', 'fast-service-production-4'],
      },
    ],
  },
  'industrial-equipment': {
    residentSlug: 'industrial-equipment',
    intro:
      '',
    productCategories: createCategories([['equipment', 'Промышленное оборудование и изделия']]),
    products: buildAtomicCatalogSeeds('ie-product', 'Промышленное оборудование и изделия', [
      {
        categoryId: 'equipment',
        categoryTitle: 'Промышленное оборудование и изделия',
        items: [
          'Сварочные столы',
          'Тележки',
          'Пылеулавливающие установки',
          'Аэраторы для воды',
          'Аэраторы газона',
          'Нестандартное оборудование',
          'Корпуса машин и агрегатов',
        ],
      },
    ]),
    serviceCategories: createCategories([['equipment-services', 'Услуги по промышленному оборудованию']]),
    services: buildAtomicServiceSeeds('ie-service', 'Промышленное оборудование и изделия', [
      {
        categoryId: 'equipment-services',
        categoryTitle: 'Услуги по промышленному оборудованию',
        items: ['Проектирование оборудования', 'Изготовление под ТЗ', 'Сборка промышленного оборудования', 'Ремонт о��орудования'],
      },
    ]),
    galleryCaption: ['Нестандартное оборудование', 'Сборочный участок', 'Готовые установки'],
    knowledgeArticles: [
      {
        id: 'industrial-equipment-kb-1',
        title: 'Сварочные столы: на что обращать внимание при заказе',
        excerpt: 'Сварочный стол — не просто плоская поверхность. Его конструкция влияет на качество работы.',
        contentBlocks: [
          { type: 'text', text: 'Для прецизионных сварочных работ важна плоскостность столешницы. Мы изготавливаем столешницы из толстолистовой стали с последующей мехобработкой для достижения нужной плоскостности.' },
          { type: 'image', src: '/residents/metalworks.svg', alt: 'Сварочный стол промышленный', caption: 'Сварочный стол под заказ' },
          { type: 'text', text: 'Возможны варианты с колёсными опорами для мобильности, встроенными полками для хранения инструмента и держателями для баллонов.' },
        ],
        image: '/residents/metalworks.svg',
        readTime: '4 мин',
        tags: ['Сварочные столы', 'Оборудование', 'Производство'],
        relatedItemIds: ['ie-product-equipment-1'],
      },
      {
        id: 'industrial-equipment-kb-2',
        title: 'Нестандартное оборудование: когда его заказывают и как описать задачу',
        excerpt: 'Серийное оборудование решает типовые задачи. Нестандартное — то, для чего нет готового решения.',
        contentBlocks: [
          { type: 'text', text: 'Аэраторы для водоёмов, пылеулавливающие установки, тележки для специфических грузов — это типичные задачи, где серийное не подходит, а нестандартное решение окупается быстро.' },
          { type: 'image', src: '/residents/metalworks.svg', alt: 'Нестандартное промышленное оборудование', caption: 'Изготовление нестандартного оборудования' },
          { type: 'text', text: 'Полный цикл: проектирование, изготовление, сборка. Возможен ремонт вышедшего из строя нестандартного оборудования по образцу или остаткам детали.' },
        ],
        image: '/residents/metalworks.svg',
        readTime: '5 мин',
        tags: ['Нестандартное оборудование', 'Проектирование', 'Изготовление'],
        relatedItemIds: ['ie-product-equipment-6', 'ie-service-equipment-services-1', 'ie-service-equipment-services-2'],
      },
      {
        id: 'industrial-equipment-kb-3',
        title: 'Пылеулавливающие установки: типичные ошибки при подборе',
        excerpt: 'Недостаточная мощность вытяжки — основная причина, почему оборудование не справляется.',
        contentBlocks: [
          { type: 'text', text: 'Для сварочного поста достаточно локальной вытяжки над зоной сварки с производительностью 800–1200 м³/ч. Для металлорежущего оборудования — требования выше и зависят от типа обработки.' },
          { type: 'image', src: '/residents/metalworks.svg', alt: 'Пылеулавливающая установка', caption: 'Промышленная вытяжка и фильтрация' },
          { type: 'text', text: 'Проектируем установки под задачу с расчётом воздухообмена и подбором фильтрующих элементов. Возможна интеграция в существующие вентиляционные системы.' },
        ],
        image: '/residents/metalworks.svg',
        readTime: '5 мин',
        tags: ['Пылеулавливание', 'Вентиляция', 'Безопасность'],
        relatedItemIds: ['ie-product-equipment-3', 'ie-service-equipment-services-1'],
      },
    ],
  },
  recycling: {
    residentSlug: 'recycling',
    intro:
      '',
    productCategories: createCategories([
      ['pellets', 'Топливные пеллеты'],
    ]),
    products: [
      {
        id: 'rec-product-pellets-1',
        title: 'Топливные древесные пеллеты',
        categoryId: 'pellets',
        shortDescription: 'Гранулированное биотопливо из переработанных древесных отходов',
        images: ['https://s3.datary-dev.ru/tp1219/eco/image027.jpg'],
        description:
          'Производим топливные пеллеты из измельчённых древесных отходов — опилок и щепы, получаемых в процессе собственной переработки древесины. Гранулы прессуются под высоким давлением без добавления химических связующих: роль связующего выполняет лигнин, высвобождаемый при нагреве. Готовое топливо соответствует требованиям EN ISO 17225-2. Применяется в пеллетных котлах, каминах и промышленных теплогенераторах. Производство из переработанного сырья обеспечивает низкую себестоимость и утилизацию древесных отходов с минимальным экологическим следом.',
        specs: [
          ['Диаметр гранулы', '6–8 мм'],
          ['Теплотворная способность', '≥4,6 кВт·ч/кг'],
          ['Влажность', '≤10%'],
          ['Зольность', '≤1,5%'],
          ['Сырьё', 'Древесные отходы (опилки, щепа)'],
          ['Стандарт', 'EN ISO 17225-2'],
        ],
      },
    ] satisfies CatalogSeed[],
    serviceCategories: createCategories([
      ['secondary-materials', 'Производство вторичного сырья'],
    ]),
    services: [
      {
        id: 'rec-service-waste-1',
        title: 'Переработка пластика',
        categoryId: 'waste-recycling',
        shortDescription: 'Измельчение и переработка пластиковых отходов во вторичное сырьё',
        images: ['https://s3.datary-dev.ru/tp1219/articles/v5KDZvplkB4aegzsvT2oE2SO7vUD0dyka3ljWC6B-big.jpg'],
        description:
          'Выполняем переработку пластиковых отходов с применением промышленных шредеров и измельчителей. Материал дробится до фракции, пригодной для дальнейшего гранулирования или повторного использования. Обрабатываются ПЭТ, ПНД, ПП и технические пластики.',
        specs: [
          ['Тип', 'Переработка пластика'],
          ['Оборудование', 'Шредеры и измельчители'],
          ['Материал', 'ПЭТ, ПНД, ПП'],
          ['Фракция', 'Измельчённое сырьё'],
          ['Назначение', 'Вторичная переработка'],
        ],
      },
      {
        id: 'rec-service-waste-2',
        title: 'Переработка дерева',
        categoryId: 'waste-recycling',
        shortDescription: 'Измельчение древесных отходов в щепу и сырьё',
        images: ['https://s3.datary-dev.ru/tp1219/articles/shredding.jpg'],
        description:
          'Перерабатываем древесные отходы на промышленном оборудовании. Используются шредеры и измельчители для получения щепы и подготовленного сырья для дальнейшего использования в производстве или утилизации.',
        specs: [
          ['Тип', 'Переработка древесины'],
          ['Оборудование', 'Шредеры'],
          ['Материал', 'Дерево, отходы производства'],
          ['Продукт', 'Щепа и фракция'],
          ['Назначение', 'Вторичное сырьё'],
        ],
      },
      {
        id: 'rec-service-waste-3',
        title: 'Измельчение отходов',
        categoryId: 'waste-recycling',
        shortDescription: 'Механическое измельчение промышленных отходов',
        images: ['https://s3.datary-dev.ru/tp1219/articles/48a6cb7b2d9cd9f3ea4cb249153d232a-1024x766.jpg'],
        description:
          'Выполняем измельчение различных промышленных отходов с использованием шредерного оборудования. Подходит для подготовки сырья к дальнейшей переработке, транспортировке или утилизации.',
        specs: [
          ['Тип', 'Измельчение отходов'],
          ['Оборудование', 'Промышленные шредеры'],
          ['Материал', 'Пластик, дерево, смешанные отходы'],
          ['Фракция', 'Регулируемая'],
          ['Назначение', 'Подготовка сырья'],
        ],
      },
      {
        id: 'rec-service-secondary-1',
        title: 'Производство вторичного сырья',
        categoryId: 'secondary-materials',
        shortDescription: 'Получение вторичного сырья из переработанных материалов',
        images: ['https://s3.datary-dev.ru/tp1219/articles/images_showcase_recycled-pp.jpg'],
        description:
          'Организуем процесс получения вторичного сырья из переработанных пластиковых и древесных отходов. После измельчения материал сортируется и подготавливается для повторного использования в производстве или дальнейшей переработке.',
        specs: [
          ['Тип', 'Производство вторсырья'],
          ['Источник', 'Переработанные отходы'],
          ['Материал', 'Пластик, дерево'],
          ['Оборудование', 'Шредеры и линии подготовки'],
          ['Назначение', 'Повторное использование'],
        ],
      },
    ],
    galleryCaption: ['Подготовка отходов', 'Измельчение', 'Линия переработки'],
    knowledgeArticles: [
      {
        id: 'recycling-kb-1',
        title: 'Какой пластик можно переработать, а какой нет: реальная картина',
        excerpt: 'Не весь пластик одинаково пригоден для переработки. Что принимают на практике.',
        contentBlocks: [
          { type: 'text', text: 'Перерабатываемость пластика зависит от его типа и чистоты. Лучше всего поддаются переработке монопластики с известным составом: ПЭТ (бутылки, упаковка), ПНД (канистры, трубы), ПП (ящики, поддоны). Эти материалы химически однородны и дают на выходе предсказуемое по качеству вторичное сырьё.' },
          { type: 'image', src: 'https://s3.datary-dev.ru/tp1219/articles/1974381371_0_160_3072_1888_1920x0_80_0_0_782ea9df51653ba97579162899324cbd.jpg', alt: 'Переработка промышленных пластиковых отходов', caption: 'Промышленная переработка пластика — от отходов к вторичному сырью' },
          { type: 'text', text: 'Смешанный пластик (несколько типов в одном изделии), многослойные плёнки и загрязнённые материалы — переработать сложнее: требуется сортировка или они теряют ценность при смешении.' },
          { type: 'text', text: 'Производственный брак и технологические обрезки — наиболее ценное сырьё: чистый состав, минимальное загрязнение, однородная фракция. Такой пластик принимается в первую очередь и даёт наилучший результат при повторной переработке.' },
        ],
        image: 'https://s3.datary-dev.ru/tp1219/articles/1974381371_0_160_3072_1888_1920x0_80_0_0_782ea9df51653ba97579162899324cbd.jpg',
        readTime: '4 мин',
        tags: ['Пластик', 'Переработка', 'Вторсырьё'],
        relatedItemIds: ['rec-service-waste-1', 'rec-service-secondary-1'],
      },
      {
        id: 'recycling-kb-2',
        title: 'Переработка древесных отходов: что идёт в щепу, а что нет',
        excerpt: 'Древесные отходы от производства — ценное сырьё, а не проблема утилизации.',
        contentBlocks: [
          { type: 'text', text: 'Древесные отходы делятся на две категории по пригодности к переработке. Чистые отходы — горбыль, рейки, обрезки досок, опилки, стружка без покрытия — это ценное сырьё: идёт в щепу, топливные гранулы (пеллеты) или в производство ДСП и МДФ.' },
          { type: 'image', src: 'https://s3.datary-dev.ru/tp1219/articles/pererabotka-drevesiny-v-shchepu-stanki-tekhnologicheskoe-opisanie-protsessa.jpeg', alt: 'Переработка древесных отходов в щепу', caption: 'Измельчение и переработка древесных отходов производства' },
          { type: 'text', text: 'Отходы с покрытиями — ламинат, МДФ с меламиновой плёнкой, окрашенные панели — перерабатывать сложнее: химические добавки снижают качество продукта и требуют отдельной обработки.' },
          { type: 'text', text: 'Для мебельных производств, деревообрабатывающих цехов и строительных компаний регулярный вывоз и переработка чистых древесных отходов — способ избавиться от накоплений и одновременно получить полезный продукт вместо расходов на утилизацию.' },
        ],
        image: 'https://s3.datary-dev.ru/tp1219/articles/pererabotka-drevesiny-v-shchepu-stanki-tekhnologicheskoe-opisanie-protsessa.jpeg',
        readTime: '4 мин',
        tags: ['Дерево', 'Щепа', 'Переработка'],
        relatedItemIds: ['rec-service-waste-2', 'rec-service-waste-3'],
      },
      {
        id: 'recycling-kb-3',
        title: 'Мифы о качестве вторичного сырья из переработанных материалов',
        excerpt: '"Вторичка хуже первичного" — не всегда правда. Разбираем, где это так, а где нет.',
        contentBlocks: [
          { type: 'text', text: 'Качество вторичного сырья зависит не от самого факта переработки, а от исходного материала. Промышленные производственные отходы — принципиально другое сырьё по сравнению с бытовыми: известный состав, минимальное загрязнение, предсказуемые механические и химические свойства.' },
          { type: 'image', src: 'https://s3.datary-dev.ru/tp1219/articles/polimery-3.jpg', alt: 'Вторичное сырьё из промышленных отходов', caption: 'Вторичное сырьё из чистых производственных отходов сопоставимо с первичным' },
          { type: 'text', text: 'Вторичный пластик из монопотока производственных отходов успешно применяется в изготовлении технических изделий, труб, строительных материалов и упаковки. По ряду характеристик он неотличим от первичного.' },
          { type: 'text', text: 'Вторичная древесная щепа из чистых обрезков используется для производства пеллет, ДСП и строительных панелей. Снижение качества заметно лишь при многократной переработке или при использовании загрязнённого и смешанного сырья.' },
        ],
        image: 'https://s3.datary-dev.ru/tp1219/articles/polimery-3.jpg',
        readTime: '4 мин',
        tags: ['Вторсырьё', 'Качество', 'Переработка'],
        relatedItemIds: ['rec-service-secondary-1', 'rec-service-waste-1', 'rec-service-waste-2'],
      },
      {
        id: 'recycling-kb-4',
        title: 'Качество пеллет: почему состав сырья важнее формы гранулы',
        excerpt: 'Пеллеты из коры дешевле, но дают в 5–10 раз больше золы. Что скрывается за словом «древесные».',
        contentBlocks: [
          { type: 'text', text: 'Топливные пеллеты классифицируются по EN ISO 17225-2: класс A1 (премиум) — древесина без коры, зольность ≤0.7%, теплотворность ≥18 МДж/кг; класс A2 — допускается небольшое количество коры и примесей, зольность ≤1.5%; класс B (промышленный) — смешанное сырьё, зольность ≤3.0%. На практике в мешках часто продаётся без указания класса.' },
          { type: 'image', src: 'https://s3.datary-dev.ru/tp1219/articles/ChatGPT%20Image%209%20%D0%B8%D1%8E%D0%BB.%202026%20%D0%B3.%2C%2013_48_15.png', alt: 'Качество пеллет — разные классы по зольности и теплотворности', caption: 'Класс A1 и B: разная зольность — разная частота обслуживания котла' },
          { type: 'text', text: 'Кора — главный источник золы в пеллетах. Она содержит минеральные вещества и кремний, которые при горении образуют шлак и остекловывают колосник котла. Пеллеты класса A1 из хвойной древесины без коры требуют чистки котла раз в 1–2 недели, промышленные из коры — ежедневно или чаще.' },
          { type: 'text', text: 'Теплотворность: хвойные породы (сосна, ель) дают чуть больше тепла, чем лиственные (берёза, осина), из-за содержания смол. Разница незначительна (≈5%), но хвойные пеллеты горят интенсивнее — важно для котлов с ограниченной регулировкой мощности. Влажность сырья — критический параметр: каждый лишний процент влаги снижает теплотворность готовой гранулы.' },
        ],
        image: 'https://s3.datary-dev.ru/tp1219/articles/ChatGPT%20Image%209%20%D0%B8%D1%8E%D0%BB.%202026%20%D0%B3.%2C%2013_48_15.png',
        readTime: '5 мин',
        tags: ['Пеллеты', 'Качество топлива', 'Зольность'],
        relatedItemIds: ['rec-product-pellets-1', 'rec-service-waste-2'],
      },
      {
        id: 'recycling-kb-5',
        title: 'Маркировка на пластике: что означают цифры 1–7 и почему это важно при сдаче',
        excerpt: 'Цифра внутри треугольника — не «степень перерабатываемости». Это тип пластика, и от него зависит всё.',
        contentBlocks: [
          { type: 'text', text: 'Маркировка пластика (RIC — Resin Identification Code) — цифра 1–7 внутри треугольника из стрелок. Это не символ переработки и не гарантия, что материал примут. Это только идентификатор типа полимера. Коротко о каждом: 1 (ПЭТ) — бутылки, упаковка; 2 (ПНД/HDPE) — канистры, трубы, крышки; 3 (ПВХ/PVC) — трубы, оконные профили, плёнка; 4 (ПВД/LDPE) — пакеты, плёнка; 5 (ПП/PP) — ящики, поддоны, контейнеры; 6 (ПС/PS) — одноразовая посуда, упаковка; 7 (прочие) — поликарбонат, ABS, смеси.' },
          { type: 'image', src: 'https://s3.datary-dev.ru/tp1219/articles/ChatGPT%20Image%209%20%D0%B8%D1%8E%D0%BB.%202026%20%D0%B3.%2C%2013_48_50.png', alt: 'Маркировка пластика 1-7 — типы полимеров', caption: 'Маркировка 1–7: тип полимера, а не «можно переработать»' },
          { type: 'text', text: 'Хорошо перерабатываются: 1 (ПЭТ) и 2 (ПНД) — самые востребованные типы, стабильный рынок вторсырья. 5 (ПП) — активно перерабатывается. Сложнее: 3 (ПВХ) — при переработке выделяет хлор, принимается не везде. 6 (ПС) — хрупкий, быстро загрязняется. 4 (ПВД) — принимают, но низкая плотность создаёт сложности с транспортировкой. Практически не перерабатывается в России: 7 (прочие) — смеси и многокомпонентные пластики.' },
          { type: 'text', text: 'Для промышленных предприятий: производственный брак с известной маркировкой — самое ценное. Особенно если это чистый монопластик без загрязнений клеем, красителем или другим полимером. Такие отходы перерабатываются практически без потерь в качестве.' },
        ],
        image: 'https://s3.datary-dev.ru/tp1219/articles/ChatGPT%20Image%209%20%D0%B8%D1%8E%D0%BB.%202026%20%D0%B3.%2C%2013_48_50.png',
        readTime: '4 мин',
        tags: ['Маркировка пластика', 'Переработка', 'Полимеры'],
        relatedItemIds: ['rec-service-waste-1', 'rec-service-secondary-1'],
      },
      {
        id: 'recycling-kb-6',
        title: 'Что нельзя сдавать на переработку: опасные заблуждения о «перерабатываемой» упаковке',
        excerpt: 'Некоторые материалы выглядят как пластик, но перерабатываются только в идеальных условиях — или не перерабатываются вообще.',
        contentBlocks: [
          { type: 'text', text: 'Многослойная упаковка (тетрапак, ламинированный картон, чипсовые пакеты) — наиболее распространённое заблуждение. Внешне она похожа на бумагу или пластик, но внутри — склеенные слои разных материалов (картон + алюминиевая фольга + полиэтилен). Разделить их без специального оборудования невозможно, поэтому большинство приёмных пунктов такие материалы не берут.' },
          { type: 'image', src: 'https://s3.datary-dev.ru/tp1219/articles/ChatGPT%20Image%209%20%D0%B8%D1%8E%D0%BB.%202026%20%D0%B3.%2C%2013_50_28.png', alt: 'Многослойная упаковка — не перерабатывается без специального оборудования', caption: 'Тетрапак — пример многослойной упаковки, не пригодной для стандартной переработки' },
          { type: 'text', text: 'ПВХ-плёнка и ПВХ-трубы: при переработке выделяют хлорсодержащие соединения, которые разрушают оборудование и загрязняют партию. Многие переработчики отказываются принимать ПВХ, даже если он чистый и промаркирован «3». Плёнка с напечатанным текстом или ламинированная — хуже чистой прозрачной из-за красителей и адгезивов.' },
          { type: 'text', text: 'Загрязнённый пластик: пищевые загрязнения (масло, остатки продуктов) не удаляются при стандартной переработке и резко снижают качество вторсырья. На производстве промывка отходов перед сдачей не требуется, но хранение сухого и чистого брака отдельно от загрязнённого — это часть качества партии.' },
        ],
        image: 'https://s3.datary-dev.ru/tp1219/articles/ChatGPT%20Image%209%20%D0%B8%D1%8E%D0%BB.%202026%20%D0%B3.%2C%2013_50_28.png',
        readTime: '4 мин',
        tags: ['Переработка', 'Многослойная упаковка', 'Отходы'],
        relatedItemIds: ['rec-service-waste-1', 'rec-service-waste-2', 'rec-service-waste-3'],
      },
      {
        id: 'recycling-kb-7',
        title: 'Шредер и дробилка: чем измельчают пластик и дерево и зачем это вообще нужно',
        excerpt: 'Объём отходов до и после шредирования отличается в 4–10 раз. Но главное — это подготовка к следующему переделу.',
        contentBlocks: [
          { type: 'text', text: 'Шредер (измельчитель с медленным вращением ножей) и дробилка (быстроходный ротор) — разные машины для разных задач. Шредер работает на низких оборотах (20–100 об/мин) с высоким крутящим моментом: рвёт и режет материал на куски 20–100 мм. Тихий, меньше нагревает материал, меньше пыли. Подходит для объёмных отходов, плёнок, труб, паллет.' },
          { type: 'image', src: 'https://s3.datary-dev.ru/tp1219/articles/ChatGPT%20Image%209%20%D0%B8%D1%8E%D0%BB.%202026%20%D0%B3.%2C%2013_50_07.png', alt: 'Промышленный шредер для измельчения пластика и дерева', caption: 'Промышленный шредер: низкие обороты, высокий момент, крупная фракция' },
          { type: 'text', text: 'Дробилка (гранулятор) работает на высоких оборотах (500–1500 об/мин): ротор с ножами и неподвижный контрнож создают режущее усилие. Даёт мелкую фракцию 5–15 мм — готовую к гранулированию или повторному литью. Шумная, нагревает материал, требует предварительной очистки от металлических включений.' },
          { type: 'text', text: 'Зачем измельчать: плотность рыхлых пластиковых отходов — 20–50 кг/м³ (как у подушки). После шредирования — 100–200 кг/м³, после гранулирования — 500–600 кг/м³. Разница в плотности напрямую влияет на стоимость транспортировки и хранения. Кроме того, мелкая фракция равномерно подаётся в экструдер или пресс — крупные куски создают перегрузки и неравномерный нагрев.' },
        ],
        image: 'https://s3.datary-dev.ru/tp1219/articles/ChatGPT%20Image%209%20%D0%B8%D1%8E%D0%BB.%202026%20%D0%B3.%2C%2013_50_07.png',
        readTime: '4 мин',
        tags: ['Шредер', 'Дробилка', 'Измельчение'],
        relatedItemIds: ['rec-service-waste-1', 'rec-service-waste-2', 'rec-service-waste-3'],
      },
      {
        id: 'recycling-kb-8',
        title: 'Хранение пеллет: как влага превращает премиум-гранулу в труху',
        excerpt: 'Класс A1 на мешке не гарантирует ничего, если мешок пролежал зиму в сыром гараже на бетонном полу.',
        contentBlocks: [
          { type: 'text', text: 'Пеллеты производятся из высушенного сырья: влажность готовой гранулы составляет 8–10 %. Именно низкая влажность обеспечивает теплотворность 17–18 МДж/кг и целостность гранулы — связующим в ней служит собственный лигнин древесины, размягчённый при прессовании. Но лигнин не делает гранулу водостойкой: спрессованная древесина остаётся гигроскопичной и активно набирает влагу из воздуха.' },
          { type: 'image', src: '', alt: 'Хранение топливных пеллет в мешках на поддонах в сухом помещении', caption: 'Поддон под мешками и сухой воздух — два условия сохранности партии' },
          { type: 'text', text: 'Что происходит при увлажнении: гранула разбухает, лигниновая связка ослабевает, и пеллета рассыпается в опилки. Практические последствия — рост доли мелочи (в норме до 1 %), из-за которой заклинивает шнековая подача котла, падение теплотворности, поскольку часть тепла уходит на испарение влаги, и общий рост расхода топлива. При длительном хранении в сырости появляется плесень, а с ней запах и риск для здоровья при погрузке.' },
          { type: 'text', text: 'Условия хранения: сухое помещение с влажностью воздуха не выше 60–70 %, поддоны или обрешётка под мешками (бетонный пол всегда отдаёт влагу вверх), зазор от стен, отсутствие прямых солнечных лучей на плёнке. Неотапливаемый склад допустим — критична не температура, а влажность и отсутствие конденсата. Мешки, занесённые с холода в тёплое помещение, дают конденсат на плёнке: вскрывать их стоит после того, как содержимое прогреется.' },
          { type: 'text', text: 'Как оценить партию перед покупкой или после хранения: качественная гранула гладкая, блестящая, ломается с усилием и характерным щелчком, в воде не расползается мгновенно. Матовая шершавая поверхность, трещины по длине, обильная мелочь на дне мешка, кисловатый запах — признаки увлажнённой или испорченной партии. Такие пеллеты не стоит брать даже со скидкой: перерасход и обслуживание котла съедят всю выгоду.' },
        ],
        image: '',
        readTime: '4 мин',
        tags: ['Пеллеты', 'Хранение', 'Влажность'],
        relatedItemIds: ['rec-product-pellets-1', 'rec-service-waste-2'],
      },
      {
        id: 'recycling-kb-9',
        title: 'Загрязнённый пластик: почему партию с остатками содержимого не принимают',
        excerpt: '«Отмоете у себя» — не работает. Разбираем, что считается чистой фракцией и как подготовить сырьё на своей площадке.',
        contentBlocks: [
          { type: 'text', text: 'Переработка пластика — это дробление, плавление и повторная экструзия. Всё, что попало в дроблёнку вместе с пластиком, попадёт и в расплав: остатки продукта, вода, песок, бумага этикеток, клей, металлические элементы. Часть из них разлагается при 200–260 °C с выделением газов, часть не плавится вовсе и остаётся включениями в готовом грануляте.' },
          { type: 'image', src: '', alt: 'Подготовка полимерных отходов к переработке: сортировка по видам', caption: 'Раздельный сбор по виду полимера на месте образования дешевле любой последующей сортировки' },
          { type: 'text', text: 'Что это даёт на выходе: поры и пузыри в грануле от испаряющейся влаги, деструкция полимера от органических остатков и снижение прочности вторичного материала, изменение цвета и посторонний запах, забивание фильтров экструдера. Партия с сильным загрязнением способна остановить линию и потребовать чистки фильтрующего пакета — поэтому такое сырьё либо не принимается, либо принимается по существенно более низкой цене с учётом затрат на подготовку.' },
          { type: 'text', text: 'Что считается приемлемой чистотой на практике: тара опорожнена и не содержит остатков жидкости, отсутствуют посторонние фракции (металл, стекло, резина, дерево), партия разделена по типу полимера согласно маркировке, нет замасленности и следов химии. Этикетки и бумажные вкладыши допустимы в разумном количестве — они отделяются при флотации, но их доля влияет на выход годного. Отдельно: тара из-под химии, ГСМ и агрохимии относится к другим классам опасности и требует отдельного обращения.' },
          { type: 'text', text: 'Как готовят сырьё на своей площадке без больших вложений: организовать раздельный сбор по видам полимера прямо там, где отходы образуются (это в разы дешевле, чем разделять уже смешанное), опорожнять тару сразу, а не при накоплении, хранить под навесом, чтобы не набиралась вода, и прессовать однородные партии. Если состав и объём отходов пока непонятны — привезите пробную партию: по ней мы определим состав, дадим заключение о пригодности и рассчитаем условия приёма.' },
        ],
        image: '',
        readTime: '5 мин',
        tags: ['Подготовка сырья', 'Чистота фракции', 'Переработка пластика'],
        relatedItemIds: ['rec-service-waste-1', 'rec-service-secondary-1', 'rec-service-waste-3'],
      },
      {
        id: 'recycling-kb-10',
        title: 'Документы при передаче отходов: что предприятие обязано подтвердить',
        excerpt: 'Отдать отходы «на переработку» без документов — не экономия, а неисполненная обязанность с прямой ответственностью.',
        contentBlocks: [
          { type: 'text', text: 'Обращение с отходами регулируется Федеральным законом № 89-ФЗ. Для предприятия ключевой принцип таков: собственник отвечает за свои отходы до момента документально подтверждённой передачи лицу, имеющему право с ними обращаться. Устная договорённость и вывоз «своими силами» этой обязанности не снимают: при проверке отсутствие документов трактуется как несанкционированное размещение отходов.' },
          { type: 'image', src: '', alt: 'Оформление документов на передачу отходов предприятия', caption: 'Акт приёма-передачи по каждой партии — основной документ, подтверждающий передачу' },
          { type: 'text', text: 'Базовый комплект со стороны образователя отходов: отнесение отходов к классу опасности и паспорт отхода для отходов I–IV классов (составляется на основании ФККО), учёт в области обращения с отходами — журналы движения по видам, договор с принимающей организацией и акты приёма-передачи по каждой партии с указанием вида, кода и массы. Для отходов I–IV классов принимающая сторона должна иметь действующую лицензию: её реквизиты стоит проверять, а не принимать на слово.' },
          { type: 'text', text: 'Отчётность. Предприятия сдают декларацию о плате за негативное воздействие на окружающую среду и отчётность по форме 2-ТП (отходы) — от них напрямую зависит размер платежей. Корректно оформленная передача отходов на утилизацию уменьшает объём размещаемых отходов, а значит и платёж. Отсутствие документов означает, что весь образовавшийся объём считается размещённым.' },
          { type: 'text', text: 'Практический совет: начните с инвентаризации — какие отходы и в каком объёме реально образуются, к каким кодам ФККО они относятся и какой у них класс опасности. Отходы V класса, к которым относятся многие виды чистых полимеров и древесных отходов, требуют существенно меньше формальностей, чем IV класс, и именно на этом этапе часто выясняется, что часть потока можно передавать проще и дешевле. Конкретный перечень документов зависит от вида деятельности и состава отходов — при заключении договора мы подскажем, что понадобится с вашей стороны.' },
        ],
        image: '',
        readTime: '5 мин',
        tags: ['Документы', 'Паспорт отхода', '89-ФЗ'],
        relatedItemIds: ['rec-service-waste-1', 'rec-service-waste-2', 'rec-service-waste-3'],
      },
    ],
  },
  tooling: {
    residentSlug: 'tooling',
    intro:
      '',
    productCategories: createCategories([
      ['stamps', 'Штампы'],
      ['tooling', 'Оснастка и инструменты'],
    ]),
    products: buildAtomicCatalogSeeds('tool-product', 'Производство механизмов и оснастки', [
      {
        categoryId: 'stamps',
        categoryTitle: 'Штампы',
        items: ['Штампы', 'Пресс-оснастка'],
      },
      {
        categoryId: 'tooling',
        categoryTitle: 'Оснастка и инструменты',
        items: ['Формовочные инструменты', 'Пуансоны'],
      },
    ]),
    serviceCategories: createCategories([['tool-services', 'Услуги по механизмам и оснастке']]),
    services: buildAtomicServiceSeeds('tool-service', 'Производство механизмов и оснастки', [
      {
        categoryId: 'tool-services',
        categoryTitle: 'Услуги по механизмам и оснастке',
        items: ['Изготовление штампов', 'Проектирование оснастки', 'Ремонт штампов'],
      },
    ]),
    galleryCaption: ['Инструментальный участок', 'Оснастка и штампы', 'Готовые рабочие элементы'],
    knowledgeArticles: [
      {
        id: 'tooling-kb-1',
        title: 'Штамп или пресс-оснастка: в чём разница и когда что нужно',
        excerpt: 'Эти понятия часто путают, хотя задачи у них разные.',
        contentBlocks: [
          { type: 'text', text: 'Для мелкосерийного производства часто достаточно универсальной гибочной оснастки. Для больших серий с высокими требованиями к точности изготавливается индивидуальный штамп под конкретную деталь.' },
          { type: 'image', src: '/residents/metalworks.svg', alt: 'Штампы и пресс-оснастка', caption: 'Инструментальное производство' },
          { type: 'text', text: 'Проектируем штампы с учётом материала заготовки, толщины листа, допусков на деталь и производительности пресса заказчика.' },
        ],
        image: '/residents/metalworks.svg',
        readTime: '5 мин',
        tags: ['Штамп', 'Оснастка', 'Производство'],
        relatedItemIds: ['tool-product-stamps-1', 'tool-product-stamps-2'],
      },
      {
        id: 'tooling-kb-2',
        title: 'Когда штамп ремонтируют, а когда заказывают новый',
        excerpt: 'Ремонт штампа — часто выгоднее нового. Но не всегда.',
        contentBlocks: [
          { type: 'text', text: 'Режущие кромки штампа можно восстановить шлифовкой несколько раз подряд. Каждый цикл правки немного изменяет геометрию, поэтому важно контролировать высоту матрицы.' },
          { type: 'image', src: '/residents/metalworks.svg', alt: 'Ремонт штампов', caption: 'Восстановление инструментальной оснастки' },
          { type: 'text', text: 'Выполняем дефектовку, ремонт и изготовление новых штампов. Для типовых операций — гибки, вырубки, формовки — разрабатываем оснастку под оборудование заказчика.' },
        ],
        image: '/residents/metalworks.svg',
        readTime: '4 мин',
        tags: ['Ремонт штампов', 'Оснастка', 'Восстановление'],
        relatedItemIds: ['tool-service-tool-services-3', 'tool-service-tool-services-1'],
      },
      {
        id: 'tooling-kb-3',
        title: 'Пуансоны и матрицы: что нужно знать при заказе',
        excerpt: 'Правильно составленное задание на изготовление пуансона экономит время и деньги.',
        contentBlocks: [
          { type: 'text', text: 'Материал пуансона выбирается исходя из серийности и твёрдости штампуемой заготовки. Для мягкого листа до 1 мм достаточно инструментальной стали У10. Для нержавейки и твёрдых сплавов — легированные стали.' },
          { type: 'image', src: '/residents/metalworks.svg', alt: 'Пуансоны и матрицы', caption: 'Инструментальные элементы для штамповки' },
          { type: 'text', text: 'Изготавливаем пуансоны, матрицы и вставные рабочие элементы с закалкой и финишной шлифовкой. Срок — от 3 рабочих дней для стандартных конфигураций.' },
        ],
        image: '/residents/metalworks.svg',
        readTime: '5 мин',
        tags: ['Пуансоны', 'Матрицы', 'Штамповка'],
        relatedItemIds: ['tool-product-tooling-2', 'tool-product-tooling-1', 'tool-service-tool-services-2'],
      },
    ],
  },
  '3d-printing': {
    residentSlug: '3d-printing',
    intro:
      '',
    productCategories: [],
    products: [],
    serviceCategories: [
      { id: 'scan-model', title: 'Сканирование и моделирование' },
      { id: 'print', title: 'Печать и постобработка' },
    ],
    services: [
      {
        id: '3d-service-modeling',
        title: '3D-моделирование под производство',
        categoryId: 'scan-model',
        shortDescription: 'Создаём CAD-модели и дорабатываем существующие модели под печать.',
        images: ['https://s3.datary-dev.ru/tp1219/3d/Screen_Shot_2020-09-21_at_11.20.42_AM_sixeiw.webp'],
        description:
          'Готовим модели под FDM и SLA с учётом геометрии, посадок, поддержек и постобработки. При необходимости делаем тестовый прототип перед серией.',
        specs: [
          ['САПР', 'Fusion, SolidWorks, FreeCAD'],
          ['Подготовка', 'DFM и техкарта печати'],
          ['Срок', '2–4 дня'],
        ],
      },
      {
        id: '3d-service-print',
        title: 'Печать FDM и SLA',
        categoryId: 'print',
        shortDescription: 'Прототипы и малые серии с подбором материала под задачу.',
        images: ['https://s3.datary-dev.ru/tp1219/3d/SLA_vs._FDM_10_11zon.webp'],
        description:
          'Печатаем функциональные детали, корпуса, мастер-модели и прототипы по технологиям FDM и SLA. Подбираем материал, проводим постобработку и контроль геометрии.',
        specs: [
          ['Материалы', 'PLA, PETG, ABS, TPU, фотополимеры'],
          ['Размер', 'До 300 × 300 × 400 мм'],
          ['Срок', '24–72 часа'],
        ],
      },
    ],
    galleryCaption: ['Лаборатория печати', 'Контроль геометрии', 'Готовые прототипы'],
    knowledgeArticles: [
      {
        id: '3d-printing-kb-1',
        title: 'FDM или SLA: как выбрать технологию под задачу',
        excerpt: 'Две популярные технологии 3D-печати дают разный результат по качеству поверхности, прочности и стоимости.',
        contentBlocks: [
          { type: 'text', text: 'FDM (послойное наплавление пластика) — наиболее доступная технология. Подходит для функциональных деталей, кронштейнов, корпусов, крышек и испытательных прототипов. Материалы: PLA — для прототипов, PETG — для деталей с умеренной нагрузкой, ABS — для термостойких изделий, TPU — для гибких элементов.' },
          { type: 'image', src: 'https://s3.datary-dev.ru/tp1219/3d/SLA_vs._FDM_10_11zon.webp', alt: 'Сравнение технологий FDM и SLA 3D-печати', caption: 'FDM и SLA — разные технологии для разных задач' },
          { type: 'text', text: 'SLA (фотополимерная печать) даёт значительно более гладкую поверхность и высокую точность деталей. Используется для мастер-моделей под заливку силикона, ювелирных прототипов, деталей с мелкой резьбой и изделий, которые требуют чистового вида без постобработки.' },
          { type: 'text', text: 'Главный критерий выбора: FDM — прочность и размер, SLA — точность и качество поверхности. Для большинства функциональных задач FDM достаточно; SLA нужен, когда важна геометрическая точность на уровне десятых долей миллиметра.' },
        ],
        image: 'https://s3.datary-dev.ru/tp1219/3d/SLA_vs._FDM_10_11zon.webp',
        readTime: '4 мин',
        tags: ['FDM', 'SLA', '3D-печать'],
        relatedItemIds: ['3d-service-print'],
      },
      {
        id: '3d-printing-kb-2',
        title: '3D-моделирование для печати: почему не любой CAD-файл подходит',
        excerpt: 'Файл может открываться, но модель всё равно не напечатается корректно.',
        contentBlocks: [
          { type: 'text', text: 'Файл для 3D-печати и файл для фрезеровки — разные вещи, хотя оба могут быть в формате STEP или STL. Деталь, спроектированная под мехобработку, часто имеет тонкие стенки менее 1 мм, нависающие элементы без опоры и внутренние полости, которые принтер просто не сможет воспроизвести корректно.' },
          { type: 'image', src: 'https://s3.datary-dev.ru/tp1219/3d/Screen_Shot_2020-09-21_at_11.20.42_AM_sixeiw.webp', alt: 'Подготовка 3D-модели к печати', caption: 'Подготовка и оптимизация модели перед 3D-печатью' },
          { type: 'text', text: 'Типичные проблемы: незамкнутые поверхности (non-manifold геометрия), перевёрнутые нормали, слишком мелкие элементы, отсутствие допусков под посадку. Всё это становится видно только в слайсере — программе, которая нарезает модель на слои.' },
          { type: 'text', text: 'Чтобы избежать переделок, достаточно предоставить модель и описать требования: материал, назначение, нужна ли посадка под вал или резьбу, какая точность критична. Остальное — задача специалиста по подготовке к печати.' },
        ],
        image: 'https://s3.datary-dev.ru/tp1219/3d/Screen_Shot_2020-09-21_at_11.20.42_AM_sixeiw.webp',
        readTime: '4 мин',
        tags: ['Моделирование', 'CAD', 'Подготовка'],
        relatedItemIds: ['3d-service-modeling', '3d-service-print'],
      },
      {
        id: '3d-printing-kb-3',
        title: 'Прототип или малая серия: что выгоднее для проверки изделия',
        excerpt: '3D-печать малой серии часто дешевле литья под давлением до достижения определённого объёма.',
        contentBlocks: [
          { type: 'text', text: 'Прототип — это первая физическая версия изделия, цель которой выявить проблемы геометрии, посадок и эргономики до запуска в серию. Исправить CAD-модель после испытаний прототипа — это несколько часов работы. Переделать литьевую оснастку после первой партии — десятки и сотни тысяч рублей.' },
          { type: 'image', src: 'https://s3.datary-dev.ru/tp1219/articles/3d-prototyping.webp', alt: 'Прототипирование и малые серии 3D-печатью', caption: 'Прототип и малая серия — проверка изделия перед массовым производством' },
          { type: 'text', text: 'Малая серия (10–200 штук) на 3D-принтере экономически оправдана, когда затраты на оснастку для литья под давлением или штамповки не окупаются при таком объёме. Порог окупаемости оснастки — обычно от 500–1000 штук.' },
          { type: 'text', text: 'Итог: прототип на 3D-печати — обязательный этап перед любым серийным производством. Малая серия — оптимальный вариант при объёмах, когда традиционные методы нерентабельны.' },
        ],
        image: 'https://s3.datary-dev.ru/tp1219/articles/3d-prototyping.webp',
        readTime: '4 мин',
        tags: ['Прототип', 'Малая серия', 'Тестирование'],
        relatedItemIds: ['3d-service-print', '3d-service-modeling'],
      },
      {
        id: '3d-printing-kb-4',
        title: 'Точность 3D-печати: чего реально ожидать от FDM и SLA',
        excerpt: 'Цифры в рекламе часто не соответствуют практике. Разбираем, какую точность даёт каждая технология в реальных условиях.',
        contentBlocks: [
          { type: 'text', text: 'Точность FDM-печати: в плоскости XY — ±0.2–0.5 мм для стандартных принтеров, ±0.1–0.2 мм для хорошо настроенных машин. По оси Z — ±0.1–0.3 мм (зависит от высоты слоя и усадки материала). Это означает, что деталь с номинальным размером 50 мм может оказаться 49.6–50.4 мм. Для корпусов и прототипов — достаточно, для посадочных мест под подшипники и валы — нет.' },
          { type: 'image', src: 'https://s3.datary-dev.ru/tp1219/articles/ChatGPT%20Image%209%20%D0%B8%D1%8E%D0%BB.%202026%20%D0%B3.%2C%2013_51_41.png', alt: 'Точность 3D-печати FDM и SLA — сравнение технологий', caption: 'SLA даёт точность ±0.05 мм; FDM — ±0.2–0.5 мм в реальных условиях' },
          { type: 'text', text: 'Точность SLA: ±0.05–0.1 мм в XY, ±0.01–0.05 мм по Z. Это приближается к точности литья под давлением. Для деталей с мелкой резьбой, пресс-посадками или требованиями к качеству поверхности SLA — единственная разумная альтернатива фрезеровке при малых объёмах.' },
          { type: 'text', text: 'Важный нюанс: указанная точность — это номинальная при идеальных условиях. На практике на неё влияют деформация при охлаждении, ориентация детали на платформе, качество модели и тип материала. Для деталей с жёсткими допусками (±0.1 мм и меньше) всегда делается тестовый экземпляр с замерами — это стандартная практика.' },
        ],
        image: 'https://s3.datary-dev.ru/tp1219/articles/ChatGPT%20Image%209%20%D0%B8%D1%8E%D0%BB.%202026%20%D0%B3.%2C%2013_51_41.png',
        readTime: '5 мин',
        tags: ['Точность печати', 'FDM', 'SLA'],
        relatedItemIds: ['3d-service-print', '3d-service-modeling'],
      },
      {
        id: '3d-printing-kb-5',
        title: 'Поддержки в 3D-печати: что это такое, зачем нужны и как они влияют на деталь',
        excerpt: 'Поддержки необходимы для нависающих элементов. Но они оставляют следы — и это нужно учитывать при проектировании.',
        contentBlocks: [
          { type: 'text', text: 'В FDM-печати каждый слой опирается на предыдущий. Если деталь имеет нависающий элемент под углом менее 45° к горизонтали — материал будет «провисать» в воздухе и деформироваться. Для таких элементов слайсер автоматически строит поддержки — временные структуры из того же материала, которые удаляются после печати.' },
          { type: 'image', src: 'https://s3.datary-dev.ru/tp1219/articles/ChatGPT%20Image%209%20%D0%B8%D1%8E%D0%BB.%202026%20%D0%B3.%2C%2013_52_45.png', alt: 'Поддержки при 3D-печати FDM — нависающие элементы', caption: 'Поддержки строятся под нависающими элементами и удаляются после печати' },
          { type: 'text', text: 'Проблема поддержек — они оставляют следы на поверхности детали в точках касания. Качество поверхности в этих местах значительно хуже, чем на открытых поверхностях. Для видовых и функциональных поверхностей, где важна чистота, это критично. Решение: правильная ориентация детали при печати (чтобы критичные поверхности были сверху), или редизайн геометрии с учётом правила 45°.' },
          { type: 'text', text: 'Для SLA поддержки тоньше и оставляют меньший след, но они обязательны для подвесных элементов — смола стекает вниз до отверждения. Растворимые поддержки (из второго материала, например PVA) полностью решают проблему следов, но требуют двухматериальный принтер.' },
        ],
        image: 'https://s3.datary-dev.ru/tp1219/articles/ChatGPT%20Image%209%20%D0%B8%D1%8E%D0%BB.%202026%20%D0%B3.%2C%2013_52_45.png',
        readTime: '4 мин',
        tags: ['Поддержки', '3D-печать', 'Постобработка'],
        relatedItemIds: ['3d-service-modeling', '3d-service-print'],
      },
      {
        id: '3d-printing-kb-6',
        title: 'ABS против PETG: что выбрать для функциональных деталей',
        excerpt: 'ABS жёстче и термостойче. PETG проще в печати и не коробится. В большинстве задач PETG выигрывает.',
        contentBlocks: [
          { type: 'text', text: 'ABS (акрилонитрил-бутадиен-стирол): предел прочности на разрыв ~40–50 МПа, температура размягчения ~100–105°C. Это материал выбора для деталей, работающих в условиях повышенной температуры (корпуса у двигателей, авторадиаторы). Существенный недостаток: при печати ABS сильно усаживается (1.5–2.5%), что вызывает коробление — отлипание углов от платформы и деформацию детали. Требует закрытого принтера с поддержанием температуры в камере.' },
          { type: 'image', src: 'https://s3.datary-dev.ru/tp1219/articles/ChatGPT%20Image%209%20%D0%B8%D1%8E%D0%BB.%202026%20%D0%B3.%2C%2013_55_05.png', alt: 'ABS и PETG — сравнение свойств пластиков для 3D-печати', caption: 'PETG: лёгкая печать без коробления; ABS: выше термостойкость' },
          { type: 'text', text: 'PETG (полиэтилентерефталат гликоль): предел прочности ~50 МПа, температура размягчения ~80°C. Практически не коробится, хорошо прилипает к платформе, не выделяет вредных паров. Химически стоек к воде, слабым кислотам и щелочам. Для большинства механических деталей — кронштейнов, корпусов, крышек, инструментальных приспособлений — PETG покрывает все требования при значительно более простой печати.' },
          { type: 'text', text: 'Практическое правило: если деталь работает при температуре выше 60–70°C — смотреть в сторону ABS или ASA. Если температурные требования умеренные — PETG почти всегда предпочтительнее из-за предсказуемости результата. TPU — для гибких и амортизирующих элементов; PLA — только для прототипов, которые не будут нагружаться.' },
        ],
        image: 'https://s3.datary-dev.ru/tp1219/articles/ChatGPT%20Image%209%20%D0%B8%D1%8E%D0%BB.%202026%20%D0%B3.%2C%2013_55_05.png',
        readTime: '4 мин',
        tags: ['ABS', 'PETG', 'Материалы для печати'],
        relatedItemIds: ['3d-service-print'],
      },
      {
        id: '3d-printing-kb-7',
        title: '3D-печать металлом: когда это оправдано и чем отличается от обычной печати',
        excerpt: 'DMLS и SLM — не «металлический FDM». Это принципиально другая технология с другой экономикой.',
        contentBlocks: [
          { type: 'text', text: 'Металлическая 3D-печать (DMLS/SLM — Direct Metal Laser Sintering / Selective Laser Melting) — это послойное спекание металлического порошка мощным лазером в защитной атмосфере инертного газа. В отличие от FDM, где пластиковая нить плавится и укладывается, здесь мельчайший порошок (20–60 мкм) сплавляется в монолитную деталь с механическими свойствами, близкими к литым или кованым.' },
          { type: 'image', src: 'https://s3.datary-dev.ru/tp1219/articles/ChatGPT%20Image%209%20%D0%B8%D1%8E%D0%BB.%202026%20%D0%B3.%2C%2013_57_02.png', alt: 'Металлическая 3D-печать DMLS — спекание металлического порошка лазером', caption: 'DMLS: детали со сложной геометрией, недостижимой фрезеровкой' },
          { type: 'text', text: 'Главное преимущество — свобода геометрии. Фрезеровка не может создать внутренние каналы охлаждения, решётчатые структуры или детали с поднутрениями без составных элементов. DMLS делает это за один цикл. Именно поэтому технология используется в авиации, медицинских имплантах и высокопроизводительных теплообменниках.' },
          { type: 'text', text: 'Экономика: стоимость металлической печати в 5–30 раз выше пластиковой для той же геометрии. Это оправдано при: уникальной геометрии, недостижимой механообработкой; малой серии (1–20 штук) сложных деталей, где стоимость оснастки не окупается; работе с материалами, сложными для механообработки (титан, инконель, кобальт-хром). Для простых деталей, которые можно выточить или отфрезеровать — фрезеровка всегда дешевле.' },
        ],
        image: 'https://s3.datary-dev.ru/tp1219/articles/ChatGPT%20Image%209%20%D0%B8%D1%8E%D0%BB.%202026%20%D0%B3.%2C%2013_57_02.png',
        readTime: '5 мин',
        tags: ['Металлическая печать', 'DMLS', 'SLM'],
        relatedItemIds: ['3d-service-print', '3d-service-modeling'],
      },
      {
        id: '3d-printing-kb-8',
        title: 'Деталь ломается «по слоям»: анизотропия прочности в 3D-печати',
        excerpt: 'Напечатанная деталь прочна вдоль слоёв и слаба поперёк. Ориентация на столе определяет, выдержит она нагрузку или нет.',
        contentBlocks: [
          { type: 'text', text: 'FDM-печать формирует деталь послойно: расплавленный пластик укладывается дорожками, и каждый следующий слой сплавляется с предыдущим за счёт остаточного тепла. В плоскости слоя материал практически монолитен, а между слоями соединение обеспечивается только этим частичным переплавлением. Отсюда фундаментальное свойство технологии — анизотропия: прочность вдоль слоёв и поперёк них различается.' },
          { type: 'image', src: '', alt: 'Разрушение напечатанной детали по плоскости слоя', caption: 'Характерный скол по плоскости слоя — признак неверной ориентации при печати' },
          { type: 'text', text: 'Порядок цифр: для типовых материалов прочность на разрыв поперёк слоёв составляет 40–70 % от прочности вдоль. У крупных деталей с неоптимальным температурным режимом печати разница бывает и больше. Именно поэтому напечатанный крюк, кронштейн или переходник ломается характерно — ровно по плоскости слоя, оставляя гладкий скол.' },
          { type: 'text', text: 'Практический вывод: деталь нужно ориентировать так, чтобы основное растягивающее или изгибающее усилие действовало вдоль слоёв, а не разделяло их. Кронштейн, работающий на изгиб, печатается лёжа, а не стоя; проушина — так, чтобы слои шли поперёк оси нагрузки; резьбовой переходник — с осью, лежащей в плоскости стола. Иногда ради прочности приходится мириться с худшим качеством поверхности и большим количеством поддержек, и это осознанный размен.' },
          { type: 'text', text: 'Помимо ориентации на межслойную прочность влияют температура сопла (выше — лучше сплавление), обдув (для ABS избыточный обдув ухудшает адгезию слоёв), высота слоя и температура камеры. Если деталь функциональная и нагруженная, скажите об этом при заказе и опишите характер нагрузки — направление печати подбирается под неё, а не под скорость или внешний вид поверхности.' },
        ],
        image: '',
        readTime: '4 мин',
        tags: ['Анизотропия', 'Прочность', 'FDM'],
        relatedItemIds: ['3d-service-print', '3d-service-modeling'],
      },
      {
        id: '3d-printing-kb-9',
        title: 'Заполнение 20 % или 100 %: почему больше пластика не значит прочнее',
        excerpt: '«Сделайте посплошнее, чтобы не сломалась» — просьба, которая чаще увеличивает цену, чем прочность.',
        contentBlocks: [
          { type: 'text', text: 'Внутри напечатанной детали находится не сплошной пластик, а решётка — заполнение (infill). Плотность заполнения задаётся в процентах, а форма ячейки бывает разной: сетка, соты, гироид, кубическая. Снаружи деталь ограничена периметрами (стенками) и сплошными верхними и нижними слоями.' },
          { type: 'image', src: '', alt: 'Структура напечатанной детали: периметры и заполнение разной плотности', caption: 'За прочность на изгиб отвечают периметры, а не плотность внутренней решётки' },
          { type: 'text', text: 'Ключевой факт: при изгибе основная нагрузка приходится на наружные слои детали, то есть на периметры, а не на внутреннюю решётку. Увеличение количества периметров с двух до четырёх повышает жёсткость и прочность на изгиб существенно сильнее, чем рост заполнения с 20 до 50 %, и обходится дешевле по времени и материалу. Заполнение работает иначе: оно поддерживает верхние слои, воспринимает сжатие и не даёт стенкам терять устойчивость.' },
          { type: 'text', text: 'Ещё одно неочевидное следствие: заполнение 100 % не только дорого и долго, но часто и хуже. Плотная укладка накапливает внутренние напряжения — деталь сильнее коробится, растёт риск отслоения от стола и расслоения крупных массивов. Для большинства функциональных деталей рабочий диапазон — 25–40 % заполнения при трёх-четырёх периметрах.' },
          { type: 'text', text: 'Как выбирать на практике: декоративные и макетные детали — 10–15 % заполнения и два периметра; функциональные детали общего назначения — 25–40 % и три-четыре периметра; детали под ударную и знакопеременную нагрузку — 40–60 %, четыре-пять периметров и по возможности ориентация нагрузки вдоль слоёв. Сплошная печать оправдана только для мелких деталей, где толщина стенки и так близка к габариту. Опишите при заказе, какую нагрузку несёт деталь, — параметры мы подберём под задачу и сразу дадим точную стоимость.' },
        ],
        image: '',
        readTime: '4 мин',
        tags: ['Заполнение', 'Периметры', 'Стоимость печати'],
        relatedItemIds: ['3d-service-print', '3d-service-modeling'],
      },
      {
        id: '3d-printing-kb-10',
        title: 'Можно ли напечатать деталь по фотографии или сломанному образцу',
        excerpt: 'Самый частый запрос — и самый неоднозначный. Что реально нужно, чтобы получить работающую копию.',
        contentBlocks: [
          { type: 'text', text: 'По фотографии деталь напечатать нельзя. Фотография не содержит размеров: даже с линейкой в кадре перспективные искажения дают ошибку в единицы миллиметров, а посадочные размеры требуют точности в сотые доли. Фотография полезна для другого — понять, о какой детали идёт речь, оценить сложность и определить, что именно придётся измерять.' },
          { type: 'image', src: '', alt: 'Обмеры сломанной детали штангенциркулем перед 3D-моделированием', caption: 'Образец и обмеры дают то, чего никогда не даст фотография, — размеры' },
          { type: 'text', text: 'По сломанному образцу — можно, и это самый частый рабочий сценарий. Нужен либо сам образец, даже в нескольких частях, если сохранились все посадочные поверхности, либо полный набор обмеров штангенциркулем: габариты, диаметры отверстий и валов, межосевые расстояния, толщины стенок, шаг и тип резьбы. Если утрачен фрагмент с ответственной поверхностью, потребуется ответная деталь, к которой изделие присоединяется, — размеры снимаются с неё.' },
          { type: 'text', text: 'Отдельная тема — точность и посадки. Прямое копирование номинального размера почти никогда не даёт работающую деталь: нужно учесть характер посадки (с зазором, переходная, с натягом), усадку материала при печати и реальную точность процесса. Отверстие, напечатанное точно по номиналу, всегда получается меньше — для валов и подшипников зазор закладывается в модель заранее. Поэтому этап 3D-моделирования не формальность, а место, где деталь становится работоспособной.' },
          { type: 'text', text: 'Что учитывать до заказа: пластиковая копия не всегда заменяет металлический оригинал. Шестерни силового привода, нагруженные кронштейны и детали, работающие при высокой температуре или в контакте с топливом и маслом, требуют либо инженерных материалов, либо перехода к металлу. В таких случаях 3D-печать применяется как этап проверки геометрии и посадок, а по утверждённой модели изделие изготавливается механообработкой. Привозите образец или присылайте обмеры и фото — по ним оценим, что реально сделать.' },
        ],
        image: '',
        readTime: '5 мин',
        tags: ['Реверс-инжиниринг', 'Обмеры', '3D-моделирование'],
        relatedItemIds: ['3d-service-modeling', '3d-service-print'],
      },
    ],
  },
  'container-homes': {
    residentSlug: 'container-homes',
    intro:
      '',
    productCategories: [
      { id: 'residential', title: 'Жилые модули' },
      { id: 'sauna', title: 'Бани' },
    ],
    products: [
      {
        id: 'cont-house-20',
        title: 'Жилой модуль 20 футов',
        categoryId: 'residential',
        shortDescription: 'Компактный жилой модуль с кухней, санузлом и спальной зоной.',
        images: [
            'https://40futov.ru/upload/iblock/5ae/j2aftu3yzycxts7ur7j8yf3x991uop4u.jpg',
            'https://40futov.ru/upload/iblock/ee7/ajed7bkjpnu4izdzd8i2vl2b2t0eiody.jpg',
            'https://40futov.ru/upload/iblock/54d/ys55f2n5uv5kf8yany5qn8wcn327qn7q.jpg',
            'https://40futov.ru/upload/iblock/a31/fajogq9ws1ualsnq22v5a316ajk2gzh8.jpg',
        ],
        description:
          'Полностью укомплектованный модуль на базе 20-футового контейнера с утеплением, электрикой, отделкой и инженерной подготовкой для круглогодичного использования.',
        specs: [
          ['Площадь', '14.8 м²'],
          ['Размеры', '6.06 × 2.44 × 2.59 м'],
          ['Утепление', 'ППУ 80 мм / минеральная вата 100 мм'],
        ],
      },
      {
        id: 'cont-house-30',
        title: 'Жилой модуль 30 футов',
        categoryId: 'residential',
        shortDescription: 'Модуль со спальней, кухней-гостиной и полноценным санузлом.',
        images: [
            'https://40futov.ru/upload/iblock/73c/y2g2uciykj8cgx91ny8nxtiqap817d5g.jpg',
            'https://40futov.ru/upload/iblock/a02/sr5z05z0jf8kh0kiz8ijv62ambiby6or.jpg',
            'https://40futov.ru/upload/iblock/135/4925sk7q3fgq17wxcac2itr1pnktlm0r.jpg',
            'https://40futov.ru/upload/iblock/5c3/6j5ltneccwz6f0jqqskpcfw0q5t0fsha.jpg',
        ],
        description:
          'Жилой модуль средней площади для дачи, гостевого дома или служебного размещения с готовой отделкой и подготовкой к подключению коммуникаций.',
        specs: [
          ['Площадь', '22.1 м²'],
          ['Размеры', '9.12 × 2.44 × 2.59 м'],
          ['Окна', 'ПВХ двухкамерные'],
        ],
      },
      {
        id: 'cont-house-40',
        title: 'Жилой модуль 40 футов',
        categoryId: 'residential',
        shortDescription: 'Просторный модуль с гостиной, спальней и кухней-столовой.',
        images: [
            'https://40futov.ru/upload/iblock/bb3/0flm2x7wyv166qis635yub6sd9o6irxn.jpg',
            'https://40futov.ru/upload/iblock/c67/px5az4moyipfbhukb5cd4fhh6jqfyjpa.jpg',
            'https://40futov.ru/upload/iblock/d95/sobjg6gdvk77llbpdhav8bhb4oqxvopb.jpg',
            'https://40futov.ru/upload/iblock/691/o3v234u2rwvb7j58dz6jtqt31z15unvy.jpg',
        ],
        description:
          'Полноценный жилой модуль на базе 40-футового контейнера с расширенной планировкой, внутренней отделкой и инженерной разводкой.',
        specs: [
          ['Площадь', '29.7 м²'],
          ['Размеры', '12.19 × 2.44 × 2.59 м'],
          ['Электрика', 'Полная разводка и щиток'],
        ],
      },
      {
        id: 'cont-sauna-20',
        title: 'Баня 20 футов',
        categoryId: 'sauna',
        shortDescription: 'Компактная баня с парной, моечной и раздевалкой.',
        images: [
            'https://40futov.ru/upload/iblock/006/tatadpcfgsawr3zuuqjjnbnub9socjcs.jpg',
            'https://40futov.ru/upload/iblock/6f5/49n6lt2es9dadb1x9wetu4ulmy242aww.jpg',
            'https://40futov.ru/upload/iblock/b61/plpu9wqzanxsu0x1u64ub7zocnf08yok.jpg',
            'https://40futov.ru/upload/iblock/4fe/vqoakhheb1nqgljvp7ctoith7lyoo83m.jpg',
        ],
        description:
          'Мобильная баня с утеплением, парной, душевой и влагостойкой отделкой на базе 20-футового контейнера.',
        specs: [
          ['Площадь', '14.8 м²'],
          ['Парная', 'До 4 человек'],
          ['Обшивка', 'Липа / кедр'],
        ],
      },
      {
        id: 'cont-sauna-30',
        title: 'Баня 30 футов',
        categoryId: 'sauna',
        shortDescription: 'Баня с парной, моечной и комнатой отдыха.',
        images: [
            'https://40futov.ru/upload/iblock/743/1qc0y5znav00a6ag56jtcxb1irdz208x.jpg',
            'https://40futov.ru/upload/iblock/836/rxieslebmdeis6faptkgs0axoazgf2bw.jpg',
            'https://40futov.ru/upload/iblock/4b7/rot82tt45ddbo032dem36qe6nkli94g6.jpg',
            'https://40futov.ru/upload/iblock/337/qy1iqvg0rgfptz914frpajvb6oada7de.jpg',
        ],
        description:
          'Модульная баня увеличенного формата с отдельной комнатой отдыха и выбором типа печи под задачу заказчика.',
        specs: [
          ['Площадь', '22.1 м²'],
          ['Парная', 'До 6 человек'],
          ['Печь', 'Электрокаменка / дровяная'],
        ],
      },
      {
        id: 'cont-sauna-40',
        title: 'Баня 40 футов',
        categoryId: 'sauna',
        shortDescription: 'Банный комплекс с зоной отдыха и дополнительными опциями.',
        images: [
            'https://40futov.ru/upload/iblock/563/l33178nxt6dvkfa84tzt4pyhqu4fpczk.jpg',
            'https://40futov.ru/upload/iblock/110/lt2971jjh8rod1msf4y2jdzt3z0c71pn.jpg',
            'https://40futov.ru/upload/iblock/26b/bxj4uep416dq0ptdi48zpg3l2wsywya4.jpg',
            'https://40futov.ru/upload/iblock/87e/s3g481lyzta4my3c2c3quk6htrf7zt8u.jpg',
        ],
        description:
          'Большой банный модуль с расширенной парной, зоной отдыха, купелью и опциональным панорамным остеклением.',
        specs: [
          ['Площадь', '29.7 м²'],
          ['Парная', 'До 8 человек'],
          ['Опции', 'Купель, панорамное окно'],
        ],
      },
    ],
    serviceCategories: [
      { id: 'design', title: 'Проектирование' },
      { id: 'delivery', title: 'Монтаж и доставка' },
    ],
    services: [
    ],
    galleryCaption: ['Готовый модуль', 'Интерьер', 'Монтаж на площадке'],
    knowledgeArticles: [
      {
        id: 'container-homes-kb-1',
        title: '20, 30 или 40 футов: как выбрать размер модуля под задачу',
        excerpt: 'Размер модуля влияет не только на площадь, но и на планировку, стоимость доставки и логистику.',
        contentBlocks: [
          { type: 'text', text: 'Модули выпускаются в трёх базовых размерах: 20 футов (6 × 2,4 м, ~14 м²), 30 футов (~9 × 2,4 м, ~21 м²) и 40 футов (12 × 2,4 м, ~29 м²). Площадь напрямую определяет планировку: в 20-футовом реально разместить спальню и санузел, в 40-футовом — полноценную гостиную, кухню и две комнаты.' },
          { type: 'image', src: 'https://40futov.ru/upload/iblock/bb3/0flm2x7wyv166qis635yub6sd9o6irxn.jpg', alt: 'Жилой модуль 40 футов', caption: '40-футовый жилой модуль — максимальная площадь и комфорт' },
          { type: 'text', text: 'Логистика — не менее важный фактор. 20-футовый модуль доставляется грузовиком с манипулятором, что не требует специальных разрешений. 40-футовый нужно везти на длинномере или трале — это важно, если въезд на участок ограничен по габаритам или есть низкие мосты.' },
          { type: 'text', text: 'Если нужна большая площадь, но доставка 40 футов затруднена — оптимальное решение: два 20-футовых модуля, состыкованных на площадке. Это гибче по планировке и проще в транспортировке.' },
        ],
        image: 'https://40futov.ru/upload/iblock/bb3/0flm2x7wyv166qis635yub6sd9o6irxn.jpg',
        readTime: '4 мин',
        tags: ['Размер модуля', 'Жилые контейнеры', 'Выбор'],
        relatedItemIds: ['cont-house-20', 'cont-house-30', 'cont-house-40'],
      },
      {
        id: 'container-homes-kb-2',
        title: 'Мобильные бани из контейнера: мифы об утеплении и работе парной',
        excerpt: '"Металл не держит тепло" — главное заблуждение о контейнерных банях.',
        contentBlocks: [
          { type: 'text', text: 'Главное заблуждение о контейнерных банях — «металл не держит тепло». Стены модуля — не голый металл: каркас заполняется утеплителем 80–100 мм (минеральная вата или ППУ), сверху — паробарьер и внутренняя вагонка. Такой пирог даёт тепловое сопротивление, сопоставимое с бревенчатым срубом 200 мм.' },
          { type: 'image', src: 'https://40futov.ru/upload/iblock/006/tatadpcfgsawr3zuuqjjnbnub9socjcs.jpg', alt: 'Банный модуль из контейнера', caption: 'Контейнерная баня — полноценная парная с утеплением и отделкой' },
          { type: 'text', text: 'Баня на базе 20-футового модуля вмещает парную на 4 человека и небольшую зону отдыха. 30- и 40-футовые позволяют добавить предбанник, купель, душевую и террасу.' },
          { type: 'text', text: 'Тип печи — на выбор заказчика: электрокаменка (проще в управлении, не нужен дымоход) или дровяная (традиционный пар, классическая атмосфера). Оба варианта полностью интегрируются в готовый модуль.' },
        ],
        image: 'https://40futov.ru/upload/iblock/006/tatadpcfgsawr3zuuqjjnbnub9socjcs.jpg',
        readTime: '4 мин',
        tags: ['Баня', 'Утепление', 'Контейнерные модули'],
        relatedItemIds: ['cont-sauna-20', 'cont-sauna-30', 'cont-sauna-40'],
      },
      {
        id: 'container-homes-kb-3',
        title: 'Подключение коммуникаций к модульному дому: что нужно подготовить',
        excerpt: 'Модуль готов к проживанию, но подключение — ответственность заказчика. Что нужно знать.',
        contentBlocks: [
          { type: 'text', text: 'Модуль поставляется с готовой внутренней разводкой электрики: щиток, розетки, освещение. Для подключения достаточно завести кабель от точки учёта — это работа на 1–2 часа. Водоснабжение и канализация выведены патрубками наружу — подключаются к централизованным сетям или автономным системам.' },
          { type: 'image', src: 'https://40futov.ru/upload/iblock/5ae/j2aftu3yzycxts7ur7j8yf3x991uop4u.jpg', alt: 'Жилой модульный дом с коммуникациями', caption: 'Жилой модуль готов к подключению коммуникаций на участке' },
          { type: 'text', text: 'Для объектов без центральных сетей используются автономные решения: септик или накопительная ёмкость для канализации, накопительный бак для воды с насосной станцией, генератор или солнечные панели для электроснабжения.' },
          { type: 'text', text: 'Что нужно подготовить до доставки модуля: ровная площадка с основанием (бетонные блоки или сваи), подведённый кабель до точки ввода, траншея для водопровода и канализации. Всё остальное — в комплекте с модулем.' },
        ],
        image: 'https://40futov.ru/upload/iblock/5ae/j2aftu3yzycxts7ur7j8yf3x991uop4u.jpg',
        readTime: '4 мин',
        tags: ['Коммуникации', 'Электрика', 'Водоснабжение'],
        relatedItemIds: ['cont-house-20', 'cont-house-40', 'cont-sauna-20'],
      },
      {
        id: 'container-homes-kb-4',
        title: 'Фундамент под контейнерный модуль: что обязательно, а что лишнее',
        excerpt: 'Ленточный фундамент под модульный дом — распространённая, но необязательная трата. Есть более быстрые и дешёвые решения.',
        contentBlocks: [
          { type: 'text', text: 'Контейнерный модуль имеет собственную жёсткую стальную раму — он не требует фундамента для обеспечения несущей способности. Задача основания — только горизонтальное и ровное размещение, защита от проседания в грунт и гидроизоляция от прямого контакта рамы с землёй.' },
          { type: 'image', src: 'https://s3.datary-dev.ru/tp1219/articles/ChatGPT%20Image%209%20%D0%B8%D1%8E%D0%BB.%202026%20%D0%B3.%2C%2013_57_57.png', alt: 'Фундамент под контейнерный модуль — свайный и блочный варианты', caption: 'Бетонные блоки или винтовые сваи — быстрое основание без заливки фундамента' },
          { type: 'text', text: 'Три варианта основания по нарастанию стоимости и срока. Бетонные блоки (ФБС или готовые опорные блоки) — укладываются под угловые фитинги модуля за несколько часов. Подходит для временного размещения и мягкого грунта с хорошей несущей способностью. Стоимость — минимальная.' },
          { type: 'text', text: 'Винтовые сваи — вкручиваются в грунт без земляных работ, установка занимает 1–2 дня. Подходят для большинства типов грунта, в том числе с высоким уровнем грунтовых вод. Хорошо работают на пучинистых грунтах — не поднимаются и не проседают при промерзании. Ленточный и монолитный фундамент — избыточны для одного-двух модулей; оправданы только при объединении 4+ модулей в капитальное строение или при строительстве в сложных инженерно-геологических условиях.' },
        ],
        image: 'https://s3.datary-dev.ru/tp1219/articles/ChatGPT%20Image%209%20%D0%B8%D1%8E%D0%BB.%202026%20%D0%B3.%2C%2013_57_57.png',
        readTime: '4 мин',
        tags: ['Фундамент', 'Монтаж модуля', 'Основание'],
        relatedItemIds: ['cont-house-20', 'cont-house-30', 'cont-house-40'],
      },
      {
        id: 'container-homes-kb-5',
        title: 'Конденсат в контейнерном модуле: почему он появляется и как это исключить при строительстве',
        excerpt: '"Металл потеет" — типичная жалоба на дешёвые модули. Но это не свойство металла, а следствие неправильного утепления.',
        contentBlocks: [
          { type: 'text', text: 'Конденсат внутри стены образуется, когда влажный тёплый воздух из помещения достигает зоны с температурой ниже точки росы. В стандартном контейнере без утепления эта зона — сам металлический лист. В утеплённом модуле — потенциально внутри слоя утеплителя, если паробарьер отсутствует или нарушен.' },
          { type: 'image', src: 'https://s3.datary-dev.ru/tp1219/articles/ChatGPT%20Image%209%20%D0%B8%D1%8E%D0%BB.%202026%20%D0%B3.%2C%2013_58_38.png', alt: 'Конденсат в контейнерном модуле — паробарьер и утепление', caption: 'Паробарьер изнутри утеплителя исключает конденсат внутри стенового «пирога»' },
          { type: 'text', text: 'Правильный «пирог» стены модуля изнутри наружу: внутренняя отделка (вагонка, гипсокартон) → паробарьер (полиэтиленовая плёнка или специальная мембрана) → утеплитель (минеральная вата или ППУ 80–100 мм) → металлический каркас → наружная обшивка. Паробарьер — это барьер для молекул воды, которые движутся от тепла к холоду сквозь стену. Без него влага конденсируется внутри утеплителя, мочит его и разрушает.' },
          { type: 'text', text: 'Ошибки при монтаже: разрывы в паробарьере (стыки не проклеены, прорывы в местах розеток и трубопроводов), укладка утеплителя с зазорами (мостики холода), недостаточная толщина утеплителя. Также важна вентиляция: при закрытом модуле без притока воздуха влажность от дыхания и готовки поднимается, и никакой паробарьер не поможет без нормального воздухообмена.' },
        ],
        image: 'https://s3.datary-dev.ru/tp1219/articles/ChatGPT%20Image%209%20%D0%B8%D1%8E%D0%BB.%202026%20%D0%B3.%2C%2013_58_38.png',
        readTime: '5 мин',
        tags: ['Конденсат', 'Утепление', 'Паробарьер'],
        relatedItemIds: ['cont-house-20', 'cont-house-40', 'cont-sauna-20'],
      },
      {
        id: 'container-homes-kb-6',
        title: 'Нужно ли разрешение на строительство для контейнерного модуля',
        excerpt: 'Ответ зависит от того, на каком основании стоит модуль и как долго планируется его использовать.',
        contentBlocks: [
          { type: 'text', text: 'В российском законодательстве ключевое разграничение — «объект капитального строительства» против «некапитального строения». Капитальное строительство требует разрешения (ст. 51 ГрК РФ). Некапитальные строения — временные, без заглублённого фундамента — по общему правилу разрешения не требуют.' },
          { type: 'image', src: 'https://s3.datary-dev.ru/tp1219/articles/ChatGPT%20Image%209%20%D0%B8%D1%8E%D0%BB.%202026%20%D0%B3.%2C%2013_59_40.png', alt: 'Контейнерный модуль как временное строение без разрешения на строительство', caption: 'Модуль на блоках или сваях — временное строение, не требующее разрешения' },
          { type: 'text', text: 'Контейнерный модуль на бетонных блоках или винтовых сваях (без заглублённого фундамента) в большинстве случаев квалифицируется как некапитальное строение. Это значит: не нужно разрешение на строительство, не нужен ввод в эксплуатацию, постановка на кадастровый учёт не обязательна (или производится в упрощённом порядке). Срок использования при этом не ограничен.' },
          { type: 'text', text: 'Важные нюансы: если вы хотите зарегистрировать модуль как жилой дом (прописка) — потребуется соответствие санитарным нормам и технический план от кадастрового инженера. Для СНТ и ДНТ — свои уставные правила. Для строительства на землях ИЖС — нужно уведомление о строительстве (упрощённый порядок, не разрешение). Рекомендуется уточнить категорию земли и ВРИ (вид разрешённого использования) до размещения модуля.' },
        ],
        image: 'https://s3.datary-dev.ru/tp1219/articles/ChatGPT%20Image%209%20%D0%B8%D1%8E%D0%BB.%202026%20%D0%B3.%2C%2013_59_40.png',
        readTime: '5 мин',
        tags: ['Разрешение на строительство', 'Юридический статус', 'Временное строение'],
        relatedItemIds: ['cont-house-20', 'cont-house-30', 'cont-house-40'],
      },
      {
        id: 'container-homes-kb-7',
        title: 'Состыковка модулей: как из двух контейнеров получить один дом',
        excerpt: 'Два модуля рядом — это не просто удвоение площади. Есть нюансы в соединении, несущих элементах и единой кровле.',
        contentBlocks: [
          { type: 'text', text: 'Горизонтальная состыковка — два модуля устанавливаются рядом, общая стена между ними либо убирается (если позволяет конструктив), либо прорезается для проёма. Это самый простой вариант: каждый модуль несёт собственную нагрузку, соединение — только по периметру и кровле. Площадь удваивается, но ширина ограничена суммой двух 2.4-метровых секций — примерно 5 м без внутренних стен.' },
          { type: 'image', src: 'https://s3.datary-dev.ru/tp1219/articles/ChatGPT%20Image%209%20%D0%B8%D1%8E%D0%BB.%202026%20%D0%B3.%2C%2014_00_37.png', alt: 'Состыковка контейнерных модулей — горизонтальная и вертикальная компоновка', caption: 'Два модуля рядом или двухэтажное размещение — разные решения для разных участков' },
          { type: 'text', text: 'Вертикальная состыковка (двухэтажный дом) — верхний модуль устанавливается на нижний. Стальные угловые фитинги модуля рассчитаны на эту нагрузку (стандарт ISO 1161). Важно: перекрытие между этажами — это пол верхнего модуля, который нужно дополнительно утеплить и звукоизолировать. Внутренняя лестница прорезается в перекрытии.' },
          { type: 'text', text: 'Единая кровля поверх нескольких модулей — оптимальное решение для горизонтального варианта: скрывает стыки, улучшает теплоизоляцию и внешний вид. Монтируется как отдельная каркасная или металлическая конструкция поверх. Это дополнительные расходы, но они полностью меняют восприятие постройки: вместо «поставили два контейнера» — «построили дом».' },
        ],
        image: 'https://s3.datary-dev.ru/tp1219/articles/ChatGPT%20Image%209%20%D0%B8%D1%8E%D0%BB.%202026%20%D0%B3.%2C%2014_00_37.png',
        readTime: '5 мин',
        tags: ['Состыковка модулей', 'Планировка', 'Двухэтажный'],
        relatedItemIds: ['cont-house-20', 'cont-house-30', 'cont-house-40', 'cont-sauna-20'],
      },
      {
        id: 'container-homes-kb-8',
        title: 'Проёмы в модуле: почему окно нельзя вырезать где угодно',
        excerpt: '«Металл же — вырежем в любом месте». Гофрированная стенка контейнера работает как несущий элемент, и вырез в ней меняет всю схему.',
        contentBlocks: [
          { type: 'text', text: 'Прочность морского контейнера обеспечивается пространственной схемой: угловые стойки и рама воспринимают вертикальную нагрузку, а гофрированные стенки работают как жёсткие диафрагмы, не дающие каркасу складываться от перекоса. Волна на стенке — не декор, а система рёбер жёсткости: гладкий лист той же толщины на порядок менее устойчив.' },
          { type: 'image', src: '', alt: 'Обрамление оконного проёма в стенке контейнерного модуля', caption: 'Проём в гофрированной стенке требует рамки жёсткости по контуру' },
          { type: 'text', text: 'Когда в стенке вырезается проём, диафрагма разрывается и жёсткость на сдвиг падает. На месте модуль этого может не показать — нагрузки от кровли невелики. Проблема проявляется при перевозке и погрузке: при подъёме краном и движении по неровностям корпус испытывает именно перекручивающие нагрузки. Модуль с непродуманными вырезами приезжает с заклинившими дверями и трещинами по углам проёмов.' },
          { type: 'text', text: 'Правильное решение — обрамление. По контуру проёма вваривается рамка из профильной трубы, возвращающая вырезанному участку жёсткость и распределяющая нагрузку на соседние волны. Углы проёма закругляются или усиливаются косынками: прямой угол — классический концентратор напряжений, откуда и идёт трещина. Широкие проёмы (панорамное остекление, ворота) требуют дополнительной стойки или ригеля, а иногда и усиления рамы пола.' },
          { type: 'text', text: 'Отсюда практическое правило: расположение и размеры окон и дверей согласуются до начала работ, вместе с планировкой и расстановкой мебели. Особенно это касается угловых зон — в пределах примерно 300–500 мм от угловых стоек проёмы не делают. Если модуль планируется стыковать со вторым или ставить в два этажа, схема усилений просчитывается сразу под эту компоновку: добавить усиление в уже отделанный модуль значительно дороже, чем заложить его на этапе изготовления.' },
        ],
        image: '',
        readTime: '5 мин',
        tags: ['Проёмы', 'Усиление каркаса', 'Конструктив'],
        relatedItemIds: ['cont-house-20', 'cont-house-30', 'cont-house-40'],
      },
      {
        id: 'container-homes-kb-9',
        title: 'Печь и электрика в контейнерной бане: металл не горит — значит, безопасно?',
        excerpt: 'Стальной корпус создаёт ложное чувство защищённости. Именно в нём пожарный и электрический риски работают иначе, чем в срубе.',
        contentBlocks: [
          { type: 'text', text: 'Утверждение «металл не горит, значит баня из контейнера пожаробезопасна» ошибочно по простой причине: горит не корпус, а внутренняя отделка, утеплитель и деревянные конструкции вокруг печи. Внутри контейнерной бани та же вагонка, тот же полок и та же дровяная печь, что и в срубе, только в замкнутом объёме с металлическими стенами.' },
          { type: 'image', src: '', alt: 'Установка печи в контейнерной бане: экран, разделка дымохода, негорючее основание', caption: 'Разделка дымохода и защитные экраны обязательны независимо от материала корпуса' },
          { type: 'text', text: 'Пожарные требования к установке печи от материала корпуса не зависят. Ключевые узлы: расстояние от печи до горючих поверхностей (для металлических печей без экранирования — от 500 мм, с защитным экраном — по паспорту печи), негорючее основание с выносом перед топкой, разделка в месте прохода дымохода через потолок и кровлю с зазором, заполненным негорючим материалом, и защитный экран между печью и стеной. Проход дымохода через утеплённую конструкцию — самый ответственный узел: минеральная вата не горит, а вот древесина обрешётки рядом с горячим металлом за годы эксплуатации подвергается пиролизу и воспламеняется при температуре заметно ниже обычной.' },
          { type: 'text', text: 'Второй риск специфичен именно для металлического корпуса — электрический. Стальные стены, каркас и обшивка представляют собой единый проводник, а высокая влажность и температура парной резко снижают сопротивление тела человека. Пробой изоляции на корпус в такой ситуации опаснее, чем в деревянном строении. Обязательный минимум: заземление металлического корпуса и каркаса, УЗО с током срабатывания 10–30 мА на линии бани, влагозащищённая проводка и арматура соответствующей степени защиты, термостойкие светильники для парной и отсутствие розеток в самой парной.' },
          { type: 'text', text: 'Третий аспект — вентиляция. Металлический корпус герметичен, и без организованного притока и вытяжки в парной падает содержание кислорода, а при неполной тяге продукты сгорания поступают в помещение. Приточное отверстие делается внизу рядом с печью, вытяжное — по диагонали вверху, оба с регулируемыми задвижками. Все эти узлы закладываются на этапе изготовления модуля: переделывать их в готовой бане означает вскрывать отделку и утепление.' },
        ],
        image: '',
        readTime: '6 мин',
        tags: ['Пожарная безопасность', 'Электробезопасность', 'Баня'],
        relatedItemIds: ['cont-sauna-20', 'cont-sauna-30', 'cont-sauna-40'],
      },
      {
        id: 'container-homes-kb-10',
        title: 'Что подготовить на участке до приезда манипулятора',
        excerpt: 'Половина срывов доставки — не проблема техники, а неготовность площадки. Список того, что проверяется заранее.',
        contentBlocks: [
          { type: 'text', text: 'Модуль привозится в собранном виде и разгружается краном-манипулятором или автокраном. Это значит, что машина полной массой 20–40 тонн должна доехать до участка, встать в устойчивое положение и дотянуться стрелой до точки установки. Каждый из этих трёх пунктов проверяется до дня доставки, а не в день доставки.' },
          { type: 'image', src: '', alt: 'Разгрузка контейнерного модуля краном-манипулятором на участке', caption: 'Подъезд, место под опоры и готовое основание — три условия успешной установки' },
          { type: 'text', text: 'Подъезд. Оценивается ширина проезда (для длинномера — не менее 3,5 м плюс место для разворота), радиус поворота на въезде и высота препятствий: провода, ветви, арки, навесы. Отдельно — сезонное состояние дороги: весной и после затяжных дождей грунтовые подъезды часто не держат тяжёлую технику, и доставку разумнее планировать на сухой период или на зиму по промёрзшему грунту.' },
          { type: 'text', text: 'Позиция крана и вылет стрелы. Грузоподъёмность манипулятора быстро падает с увеличением вылета: то, что машина поднимает у борта, на вылете десять метров превращается в считаные тонны. Поэтому важно, чтобы техника могла встать как можно ближе к точке установки. Место под выносные опоры должно быть ровным и плотным — под опоры подкладываются щиты, а над коммуникациями (септик, водопровод, кабель) кран не ставится.' },
          { type: 'text', text: 'Площадка под модуль. К приезду должно быть готово основание — блоки, ленты или сваи с выверенной горизонтальностью: модуль ставится сразу на своё место, «подвинуть потом» его нельзя. Также заранее продумываются точки ввода коммуникаций, чтобы они оказались под модулем в нужном месте, и ориентация модуля — с какой стороны будут вход и окна. За несколько дней до доставки мы уточняем эти детали и при необходимости просим прислать фото подъезда и площадки: по ним видно большинство проблем заранее.' },
        ],
        image: '',
        readTime: '5 мин',
        tags: ['Доставка', 'Манипулятор', 'Подготовка площадки'],
        relatedItemIds: ['cont-house-20', 'cont-house-40', 'cont-sauna-30'],
      },
    ],
  },
};

const contentBySlug = Object.values(portalSeeds).reduce<Record<string, ResidentPortalContent>>((acc, seed) => {
  acc[seed.residentSlug] = buildPortalContent(seed);
  return acc;
}, {});

const defaultPortalContent = (resident: Resident): ResidentPortalContent => {
  const articleIds = getArticleIds(resident.slug);
  const services: ResidentServiceItem[] = resident.services.map((service, index) => ({
    id: `${resident.slug}-service-${index + 1}`,
    title: service,
    shortDescription: `Услуга резидента ${resident.shortName.toLowerCase()} с фокусом на качество, сроки и понятную коммуникацию.`,
    description:
      'Работаем по заявке, чертежу, образцу или описанию задачи. Уточняем требования, согласовываем результат и сопровождаем проект до готового решения.',
    specs: [
      { label: 'Формат', value: 'Разовый и серийный заказ' },
      { label: 'Старт работ', value: 'После согласования задачи' },
      { label: 'Контроль', value: 'По согласованной спецификации' },
    ],
    images: getRotatedImages(resident.slug, index),
    relatedArticleIds: [articleIds.overview, articleIds.order],
  }));

  return {
    residentSlug: resident.slug,
    intro: `Раздел резидента ${resident.name}: товары, услуги, новости, база знаний и фото.`,
    productCategories: [],
    products: [],
    serviceCategories: [],
    services,
    news: buildNews(resident.slug, resident.fullDescription),
    knowledgeBase: buildKnowledgeBase(resident.slug, resident.fullDescription, [], services),
    gallery: buildGallery(resident.slug),
  };
};

export const getResidentPortalContent = (resident: Resident): ResidentPortalContent =>
  contentBySlug[resident.slug] ?? defaultPortalContent(resident);

