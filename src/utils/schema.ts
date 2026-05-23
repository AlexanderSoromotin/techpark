/**
 * Утилиты для генерации JSON-LD schema.org разметки
 */

export const SITE_URL = 'https://tp1219.ru';
export const SITE_NAME = 'Технопарк 1219';
export const SITE_PHONE = '+79080477030';
export const SITE_PHONE_DISPLAY = '+7 (908) 047-70-30';
export const SITE_EMAIL = 'info@1219.ru';
export const SITE_ADDRESS = {
  locality: 'Троицк',
  region: 'Челябинская область',
  country: 'RU',
};
export const SITE_GEO = { lat: 54.107308, lng: 61.602056 };

/** Organization + LocalBusiness (главная страница) */
export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'LocalBusiness'],
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    alternateName: 'ТП 1219',
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description:
      'Промышленный технопарк полного цикла в Троицке, Челябинская область. Аренда производственных помещений от 50 м².',
    telephone: SITE_PHONE,
    email: SITE_EMAIL,
    address: {
      '@type': 'PostalAddress',
      addressLocality: SITE_ADDRESS.locality,
      addressRegion: SITE_ADDRESS.region,
      addressCountry: SITE_ADDRESS.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: SITE_GEO.lat,
      longitude: SITE_GEO.lng,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '18:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '09:00',
        closes: '14:00',
      },
    ],
  };
}

/** WebSite schema */
export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    inLanguage: 'ru-RU',
    publisher: { '@id': `${SITE_URL}/#organization` },
  };
}

/** BreadcrumbList schema */
export function breadcrumbSchema(
  items: Array<{ name: string; url: string }>,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/** LocalBusiness для страницы резидента */
export function residentBusinessSchema(opts: {
  name: string;
  description: string;
  telephone: string;
  email: string;
  slug: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: `${opts.name} — ${SITE_NAME}`,
    url: `${SITE_URL}/resident/${opts.slug}`,
    description: opts.description,
    telephone: opts.telephone.replace(/\D/g, '').startsWith('7')
      ? `+${opts.telephone.replace(/\D/g, '')}`
      : opts.telephone,
    email: opts.email,
    parentOrganization: { '@id': `${SITE_URL}/#organization` },
    address: {
      '@type': 'PostalAddress',
      addressLocality: SITE_ADDRESS.locality,
      addressRegion: SITE_ADDRESS.region,
      addressCountry: SITE_ADDRESS.country,
    },
  };
}

/** FAQPage schema */
export function faqSchema(
  items: Array<{ question: string; answer: string }>,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

/** JobPosting schema */
export function jobPostingSchema(opts: {
  title: string;
  description: string;
  salaryMin: number;
  datePosted?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: opts.title,
    description: opts.description,
    hiringOrganization: { '@id': `${SITE_URL}/#organization` },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: SITE_ADDRESS.locality,
        addressRegion: SITE_ADDRESS.region,
        addressCountry: SITE_ADDRESS.country,
      },
    },
    employmentType: 'FULL_TIME',
    baseSalary: {
      '@type': 'MonetaryAmount',
      currency: 'RUB',
      value: {
        '@type': 'QuantitativeValue',
        minValue: opts.salaryMin,
        unitText: 'MONTH',
      },
    },
    datePosted: opts.datePosted ?? '2026-05-01',
  };
}

/** Конвертация schema-объекта в строку для <script> */
export function toJsonLd(schema: object): string {
  return JSON.stringify(schema);
}

