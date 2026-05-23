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
  content: string;
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
  return {
    residentSlug: seed.residentSlug,
    intro: seed.intro,
    productCategories: seed.productCategories,
    products,
    serviceCategories: seed.serviceCategories,
    services,
    news: buildNews(seed.residentSlug, seed.intro),
    knowledgeBase: buildKnowledgeBase(seed.residentSlug, seed.intro, products, services),
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
        title: 'Металлические хомуты',
        categoryId: 'metal-structures',
        shortDescription: 'Хомуты различной формы и назначения',
        images: ['https://s3.datary-dev.ru/tp1219/metal/47466.970.jfif'],
        description: 'Изготавливаем металлические хомуты круглой, овальной и специальной формы для вентиляции, трубопроводов и инженерных систем. Производство выполняется на специализированном оборудовании.',
        specs: [
          ['Форма', 'Круглая, овальная'],
          ['Материал', 'Сталь'],
          ['Тип', 'Монтажные изделия'],
          ['Изготовление', 'Серийное'],
          ['Применение', 'Вентиляция и трубопроводы'],
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
        images: ['https://s3.datary-dev.ru/tp1219/metal/rubka_list_materiala1.jpg'],
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
        description: 'Выполняем сварочные работы при изготовлении металлоконструкций, мебели, корпусов и инженерных изделий. Производство включает сборку, подгонку и сварку деталей различной сложности.',
        specs: [
          ['Тип работ', 'Сварка'],
          ['Материал', 'Сталь и нержавейка'],
          ['Назначение', 'Металлоконструкции'],
          ['Производство', 'Под заказ'],
          ['Конструкция', 'Сварная'],
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
        images: ['https://s3.datary-dev.ru/tp1219/main_content/image243.jpg'],
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
        title: 'Изготовление рукавов большого диаметра',
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
      {
        id: 'hyd-service-repair-8',
        title: 'Переобжим фитингов',
        categoryId: 'repair',
        shortDescription: 'Повторная опрессовка соединений РВД',
        images: ['https://s3.datary-dev.ru/tp1219/main_content/obzim-rvd-1024x576.jpg'],
        description: 'Выполняем переобжим фитингов для восстановления надежности соединений.',
        specs: [
          ['Опрессовка', 'профессиональная'],
          ['Контроль качества', 'да'],
          ['Типы фитингов', 'разные'],
          ['Срочное выполнение', 'возможно'],
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
        title: 'Шлифовка посадок под стопорные кольца',
        categoryId: 'machining',
        shortDescription: 'Восстановление канавок и посадочных поверхностей',
        images: ['https://s3.datary-dev.ru/tp1219/kardan/7376061916.jpg'],
        description: 'Восстановление посадочных мест и канавок под стопорные кольца с механической обработкой и доведением размеров. Работы выполняются при износе, деформации или повреждении посадочных поверхностей карданного узла.',
        specs: [
          ['Тип работ', 'Восстановление посадок'],
          ['Обработка', 'Шлифовка'],
          ['Назначение', 'Под стопорные кольца'],
          ['Контроль размеров', 'Да'],
          ['Тип деталей', 'Карданные узлы'],
        ],
      },
      {
        id: 'ds-service-machining-3',
        title: 'Фрезерные работы',
        categoryId: 'machining',
        shortDescription: 'Механическая обработка деталей на фрезерном оборудовании',
        images: ['https://s3.datary-dev.ru/tp1219/kardan/8-1.webp'],
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
        id: 'ds-service-metallization-2',
        title: 'Восстановление трещин и повреждений',
        categoryId: 'metallization',
        shortDescription: 'Заполнение повреждений с последующей механической обработкой',
        images: ['https://s3.datary-dev.ru/tp1219/kardan/cracks.jpg'],
        description: 'Восстановление локальных повреждений и трещин методом напыления металла с дальнейшей обработкой поверхности. Технология позволяет устранить дефекты рабочих участков и восстановить эксплуатационные характеристики детали без изготовления новой.',
        specs: [
          ['Тип дефектов', 'Трещины и выработка'],
          ['Метод ремонта', 'Напыление'],
          ['Обработка после ремонта', 'Да'],
          ['Назначение', 'Восстановление деталей'],
          ['Тип деталей', 'Металлические элементы'],
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
        description: 'Правка деформированных колесных дисков с восстановлением геометрии и рабочих параметров. Работы выполняются на специализированном оборудовании с контролем биения и состояния диска после правки.',
        specs: [
          ['Тип работ', 'Правка дисков'],
          ['Назначение', 'Восстановление геометрии'],
          ['Контроль биения', 'Да'],
          ['Оборудование', 'Станок для правки'],
          ['Тип дисков', 'Металлические'],
        ],
      },
    ] satisfies ServiceSeed[],
    galleryCaption: ['Ремонт карданных валов', 'Балансировочный участок', 'Металлизация и мехобработка'],
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
      {
        id: 'cm-product-sheet-3',
        title: 'Нестандартный профлист',
        categoryId: 'sheet',
        shortDescription: 'Изготовление профлиста нестандартного профиля',
        images: ['https://s3.datary-dev.ru/'],
        description:
          'Производим профлист нестандартной конфигурации по параметрам заказчика. Возможна настройка геометрии профиля, длины, толщины металла и типа покрытия.',
        specs: [
          ['Тип', 'нестандартный профиль'],
          ['Изготовление', 'под заказ'],
          ['Материал', 'рулонная сталь'],
          ['Покрытие', 'оцинковка и окраска'],
          ['Производство', 'индивидуальное'],
        ],
      },
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
        images: ['https://s3.datary-dev.ru/tp1219/constructions/kakie_stolby_ispolzovat_dlya_zabora_2.webp'],
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
    ] satisfies CatalogSeed[],
    serviceCategories: createCategories([
      ['production', 'Производство металлоконструкций'],
      ['installation', 'Монтажные работы'],
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
    ] satisfies ServiceSeed[],
    galleryCaption: ['Прокат и профилирование', 'Ограждения и секции', 'Строительные конструкции'],
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
  },
  recycling: {
    residentSlug: 'recycling',
    intro:
      'Переработка пластиковых и древесных отходов с применением промышленных шредеров и измельчителей. Производство вторичного сырья для повторного использования в производстве.',
    productCategories: [],
    products: [],
    serviceCategories: createCategories([
      ['waste-recycling', 'Переработка отходов'],
      ['secondary-materials', 'Производство вторичного сырья'],
    ]),
    services: [
      {
        id: 'rec-service-waste-1',
        title: 'Переработка пластика',
        categoryId: 'waste-recycling',
        shortDescription: 'Измельчение и переработка пластиковых отходов во вторичное сырьё',
        images: ['https://s3.datary-dev.ru/'],
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
        images: ['https://s3.datary-dev.ru/'],
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
        images: ['https://s3.datary-dev.ru/'],
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
        images: ['https://s3.datary-dev.ru/'],
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

