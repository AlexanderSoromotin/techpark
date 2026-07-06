# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Бизнес-контекст

**Технопарк 1219** — промышленный технопарк полного цикла в г. Троицке, Челябинская область. Сайт выполняет роль маркетингового лендинга и каталога резидентов. Основная задача — привлечение арендаторов производственных помещений от 50 м² и продвижение услуг резидентов.

Резиденты — это компании-арендаторы внутри технопарка (производство РВД, металлообработка, 3D-печать, переработка, стройматериалы и др.). Каждый резидент получает собственный мини-портал на сайте с каталогом товаров, услуг, новостями и базой знаний.

## Команды

```bash
npm run dev      # Dev-сервер (Vite)
npm run build    # TypeScript + Vite production build
npm run lint     # ESLint
npm run preview  # Предпросмотр production-сборки
```

Тестов нет.

## Технический стек

- **React 19** + **TypeScript** + **Vite 8**
- **Tailwind CSS v4** (подключён через `@tailwindcss/vite`, конфиг в `vite.config` — не через `tailwind.config.js`)
- **React Router DOM v7** (BrowserRouter)
- **framer-motion** — анимации
- **lucide-react** — иконки
- **react-helmet-async** — SEO-теги (`<Helmet>` на каждой странице)
- **React Compiler** включён через `babel-plugin-react-compiler` — не использовать `useMemo`/`useCallback` там, где компилятор может это сделать сам, но в текущем коде они встречаются в ResidentPage

## Архитектура

### Данные (всё статично, бэкенда нет)

Весь контент хранится в `src/data/` как TypeScript-массивы:

- **`residents.ts`** — главный массив резидентов (`Resident[]`). Поле `is_hidden: true` скрывает резидента из сетки на главной. Здесь: базовое описание, градиенты для шапки страницы, контакты, иконка Lucide по имени (`iconName`).
- **`residentPortalContentData.ts`** — расширенный контент каждого резидента: товары (`ResidentCatalogItem`), услуги (`ResidentServiceItem`), новости, база знаний (`ResidentKnowledgeArticle`), галерея. Экспортируется через `residentPortalContent.ts` + функция `getResidentPortalContent(resident)`.
- **`vacancies.ts`**, **`faqData.ts`**, **`partners.ts`** — статические данные для соответствующих секций.

### Страницы и роуты

```
/                          → HomePage
/resident/:slug            → ResidentPage
/resident/:slug/article/:articleId → ResidentPage (статья открыта как модалка)
/vacancies                 → VacanciesPage
*                          → NotFoundPage
```

`ScrollRestorer` в `App.tsx` управляет прокруткой: `state.scrollTo` — плавный скролл к ID секции, `state.noScroll` — без прокрутки (используется при открытии/закрытии модалок статей).

### ResidentPage

Самая сложная страница. Управляет несколькими модальными состояниями одновременно:
- `selectedItem` — карточка товара или услуги
- `openArticleId` — статья базы знаний (синхронизируется с URL через `/article/:id`)
- `openNewsId` — новость
- `lightboxIndex` — лайтбокс галереи

Статья меняет URL (`navigate` без reload), чтобы ссылка на статью была копируемой. Функция `buildCategorizedSections` группирует товары/услуги по категориям для вкладок-фильтров.

### Форма обратной связи

`ContactFormContext` хранит `prefillMessage` — предзаполненный текст сообщения. Любая секция может вызвать `setPrefillMessage(...)`, и при скролле к форме контактов поле уже заполнено.

Отправка через `src/services/feedbackApi.ts` на внешний API. Конфигурируется через `.env`:
```
VITE_FEEDBACK_API_URL=https://feedback.datary-dev.ru/api/v1/submit
VITE_FEEDBACK_API_TOKEN=...
```

### SEO

`src/utils/schema.ts` — все JSON-LD схемы (Organization, WebSite, BreadcrumbList, LocalBusiness для резидента, FAQPage, JobPosting) + константы сайта (`SITE_URL`, `SITE_NAME`, координаты). Каждая страница рендерит мета-теги через `<Helmet>`.

### База знаний (knowledgeArticles)

Каждый резидент имеет секцию `knowledgeArticles` в `portalSeeds`. Это **редакционный контент** — не маркетинговые тексты, а статьи, которые:
- Развенчивают конкретные заблуждения целевой аудитории (например, «РВД можно не менять до полного износа», «металл не держит тепло в бане»)
- Дают практические ответы на важные вопросы покупателей и заказчиков
- Несут познавательный характер — с техническими деталями, цифрами, ссылками на стандарты

Каждая статья привязана к конкретным товарам/услугам через `relatedItemIds`, и обратно — через `relatedArticleIds` у товаров/услуг. Эта связь строится автоматически в `buildPortalContent` при наличии `knowledgeArticles`.

Хорошие примеры для понимания стиля и глубины: статьи `hydraulics-kb-4` (про шланги автокондиционера) и `metalworks-kb-2` (порошковая vs жидкая покраска).

Если `knowledgeArticles` не задан в seed, `buildKnowledgeBase` генерирует два шаблонных placeholder-текста — их нужно заменять на реальные статьи.

### Добавление нового резидента

1. Добавить объект в массив `residents` в `src/data/residents.ts` с уникальным `id`, `slug`, `iconName` (имя компонента из `lucide-react`).
2. Создать объект `ResidentPortalContent` в `src/data/residentPortalContentData.ts` с тем же `residentSlug`.
3. Зарегистрировать его в `getResidentPortalContent()` в том же файле.
4. Изображения хранятся на S3: `https://s3.datary-dev.ru/tp1219/main_content/`.
