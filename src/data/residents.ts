export interface Resident {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  category: string;
  description: string;
  fullDescription: string;
  services: string[];
  advantages: string[];
  gradientFrom: string;
  gradientTo: string;
  iconName: string;
  image: string;
  imageAlt: string;
  phone?: string;
  email?: string;
  website?: string;
}

export const residents: Resident[] = [
  {
    id: '1',
    slug: 'hydraulics',
    name: 'РВД и гидравлика',
    shortName: 'Гидравлика',
    category: 'Промышленное оборудование',
    description: 'Ремонт и изготовление рукавов высокого давления для любой техники',
    fullDescription:
      'Специализируемся на ремонте, изготовлении и поставке рукавов высокого давления (РВД) для строительной, горнодобывающей и сельскохозяйственной техники. Используем только сертифицированные материалы и передовое оборудование. Готовы изготовить РВД любой длины и конфигурации в кратчайшие сроки.',
    services: [
      'Изготовление РВД любой длины и конфигурации',
      'Ремонт гидравлических шлангов на месте',
      'Поставка гидравлической арматуры',
      'Выездной ремонт на объект заказчика',
      'Гидравлическое тестирование под давлением',
    ],
    advantages: [
      'Срок изготовления от 1 часа',
      'Работа с техникой любых марок',
      'Сертифицированные материалы',
      'Гарантия 12 месяцев',
    ],
    gradientFrom: '#2563eb',
    gradientTo: '#1e40af',
    iconName: 'Wrench',
    image: 'http://s3.datary-dev.ru/api/v1/download-shared-object/aHR0cDovLzEyNy4wLjAuMTo5MDAwL3RwMTIxOS9tYWluX2NvbnRlbnQvcGhvdG8tMTY1MTk1NDc5NDM3NC1mM2M1ZmRkOWMwNzcuYXZpZj9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPVJBWUU4Vjc2NjVOUjFXRTJDTFJHJTJGMjAyNjA1MTMlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjYwNTEzVDE0MDAyMlomWC1BbXotRXhwaXJlcz00MzIwMCZYLUFtei1TZWN1cml0eS1Ub2tlbj1leUpoYkdjaU9pSklVelV4TWlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKaFkyTmxjM05MWlhraU9pSlNRVmxGT0ZZM05qWTFUbEl4VjBVeVEweFNSeUlzSW1WNGNDSTZNVGMzT0RjeU1EVTFOeXdpY0dGeVpXNTBJam9pWkdGMFlYSjVJbjAuVnBfekhTaGJBVFhvUEEyUWRFUzdCemNpUkJUaG8waUFJWDdVQ1puNFdZWE1HcDJWcEdiajJRNHlyMU9uSWczYzlpRjktWlZWcG1HS180M2xrUThlU3cmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JnZlcnNpb25JZD1udWxsJlgtQW16LVNpZ25hdHVyZT00OTVhMjdkOGE4YWFmM2Q4YjQ5YjFkOTc3YzBjYjdlYjIwN2Q4ZmZjNmM3NmJmMTViOGVhYzZhYTA1NDM1MGRl',
    imageAlt: 'Гидравлические рукава и промышленное оборудование в производственном цехе',
    phone: '+7 (908) 047-70-30',
    email: 'rvd@tp1219.ru',
  },
  {
    id: '2',
    slug: 'driveshafts',
    name: 'Карданные валы',
    shortName: 'Карданные валы',
    category: 'Автокомпоненты',
    description: 'Ремонт и изготовление карданных валов для всех видов техники',
    fullDescription:
      'Производство и ремонт карданных валов для грузовых автомобилей, строительной и сельскохозяйственной техники. Работаем с отечественными и импортными автомобилями всех марок. Динамическая балансировка на собственном стенде.',
    services: [
      'Изготовление карданных валов на заказ',
      'Динамическая балансировка',
      'Замена крестовин и шарниров',
      'Ремонт промежуточных опор',
      'Диагностика трансмиссии',
    ],
    advantages: [
      'Балансировочный стенд европейского класса',
      'Гарантия на все виды работ',
      'Работа с любыми марками',
      'Быстрые сроки выполнения',
    ],
    gradientFrom: '#475569',
    gradientTo: '#334155',
    iconName: 'Settings',
    image: 'http://s3.datary-dev.ru/api/v1/download-shared-object/aHR0cDovLzEyNy4wLjAuMTo5MDAwL3RwMTIxOS9tYWluX2NvbnRlbnQvaXN0b2NrcGhvdG8tMTE2NzE3Njk0OC02MTJ4NjEyLndlYnA_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1SQVlFOFY3NjY1TlIxV0UyQ0xSRyUyRjIwMjYwNTEzJTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI2MDUxM1QxNDAxMTJaJlgtQW16LUV4cGlyZXM9NDMxOTkmWC1BbXotU2VjdXJpdHktVG9rZW49ZXlKaGJHY2lPaUpJVXpVeE1pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmhZMk5sYzNOTFpYa2lPaUpTUVZsRk9GWTNOalkxVGxJeFYwVXlRMHhTUnlJc0ltVjRjQ0k2TVRjM09EY3lNRFUxTnl3aWNHRnlaVzUwSWpvaVpHRjBZWEo1SW4wLlZwX3pIU2hiQVRYb1BBMlFkRVM3QnpjaVJCVGhvMGlBSVg3VUNabjRXWVhNR3AyVnBHYmoyUTR5cjFPbklnM2M5aUY5LVpWVnBtR0tfNDNsa1E4ZVN3JlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCZ2ZXJzaW9uSWQ9bnVsbCZYLUFtei1TaWduYXR1cmU9YmU4ZDNmNWRmNTNmY2RlNzIzMDJlNzEwYWU4MDI5NTg5OWIwZTc4NzliNmVkOWI0ZWJkNzQwNTliZWUxNzdlYQ',
    imageAlt: 'Карданный вал и балансировочный стенд в индустриальном интерьере',
    phone: '+7 (908) 047-70-30',
    email: 'val@tp1219.ru',
  },
  {
    id: '3',
    slug: 'metalworks',
    name: 'Металлоконструкции',
    shortName: 'Металлоконструкции',
    category: 'Металлообработка',
    description: 'Производство металлоконструкций любой сложности под ключ',
    fullDescription:
      'Изготовление металлоконструкций для промышленного, коммерческого и жилого строительства. Полный цикл производства: проектирование — изготовление — антикоррозийная обработка — монтаж. Работаем по ГОСТ и ТУ заказчика.',
    services: [
      'Несущие конструкции и фермы',
      'Сварные изделия любой сложности',
      'Лестницы, ограждения, заборы',
      'Металлические двери и ворота',
      'Антикоррозийная обработка и покраска',
    ],
    advantages: [
      'Проектирование по чертежам заказчика',
      'Сертифицированные сварщики',
      'Покраска и грунтовка в комплексе',
      'Монтаж под ключ',
    ],
    gradientFrom: '#64748b',
    gradientTo: '#334155',
    iconName: 'Building2',
    image: 'http://s3.datary-dev.ru/api/v1/download-shared-object/aHR0cDovLzEyNy4wLjAuMTo5MDAwL3RwMTIxOS9tYWluX2NvbnRlbnQvcG5ndHJlZS0zZC1yZW5kZXJpbmctb2YtemluYy1nYWx2YW5pemVkLXdhdmUtc2hlZXRzLWZvci1yb29mLXBpY3R1cmUtaW1hZ2VfMTMyNzc0MDguanBnP1gtQW16LUFsZ29yaXRobT1BV1M0LUhNQUMtU0hBMjU2JlgtQW16LUNyZWRlbnRpYWw9UkFZRThWNzY2NU5SMVdFMkNMUkclMkYyMDI2MDUxMyUyRnVzLWVhc3QtMSUyRnMzJTJGYXdzNF9yZXF1ZXN0JlgtQW16LURhdGU9MjAyNjA1MTNUMTQwMTU4WiZYLUFtei1FeHBpcmVzPTQzMjAwJlgtQW16LVNlY3VyaXR5LVRva2VuPWV5SmhiR2NpT2lKSVV6VXhNaUlzSW5SNWNDSTZJa3BYVkNKOS5leUpoWTJObGMzTkxaWGtpT2lKU1FWbEZPRlkzTmpZMVRsSXhWMFV5UTB4U1J5SXNJbVY0Y0NJNk1UYzNPRGN5TURVMU55d2ljR0Z5Wlc1MElqb2laR0YwWVhKNUluMC5WcF96SFNoYkFUWG9QQTJRZEVTN0J6Y2lSQlRobzBpQUlYN1VDWm40V1lYTUdwMlZwR2JqMlE0eXIxT25JZzNjOWlGOS1aVlZwbUdLXzQzbGtROGVTdyZYLUFtei1TaWduZWRIZWFkZXJzPWhvc3QmdmVyc2lvbklkPW51bGwmWC1BbXotU2lnbmF0dXJlPWQ3ZTQ3YmJlZjI0MTJhNGE5ODZhNGY4MzQyYmEwODg5N2NlYzA0Mjk5OTM4ZWRhMWY5ZTU5MTQ5N2U2OTUwMzM',
    imageAlt: 'Металлоконструкции, балки и сварочный участок в цехе',
    phone: '+7 (908) 047-70-30',
    email: 'metal@tp1219.ru',
  },
  {
    id: '4',
    slug: 'fasteners',
    name: 'Крепёж',
    shortName: 'Крепёж',
    category: 'Производство',
    description: 'Производство гвоздей, саморезов и строительного крепежа',
    fullDescription:
      'Производство широкого ассортимента строительного крепежа: гвозди, саморезы, шурупы, болты и гайки. Собственная производственная линия позволяет обеспечивать стабильное качество и конкурентные цены для строительных и торговых компаний.',
    services: [
      'Гвозди строительные всех типоразмеров',
      'Саморезы строительные и кровельные',
      'Анкерные крепления',
      'Болты, гайки, шайбы',
      'Оптовые и мелкооптовые поставки',
    ],
    advantages: [
      'Собственное производство',
      'Широкий ассортимент типоразмеров',
      'Оптовые и мелкооптовые цены',
      'Быстрая отгрузка со склада',
    ],
    gradientFrom: '#0284c7',
    gradientTo: '#0369a1',
    iconName: 'Package',
    image: 'http://s3.datary-dev.ru/api/v1/download-shared-object/aHR0cDovLzEyNy4wLjAuMTo5MDAwL3RwMTIxOS9tYWluX2NvbnRlbnQvcGhvdG8tMTYwNTcwMTI0OTk4Ny1mMGJiOWI1MDVkMDYuamZpZj9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPVJBWUU4Vjc2NjVOUjFXRTJDTFJHJTJGMjAyNjA1MTMlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjYwNTEzVDE0MDI0NVomWC1BbXotRXhwaXJlcz00MzE5OSZYLUFtei1TZWN1cml0eS1Ub2tlbj1leUpoYkdjaU9pSklVelV4TWlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKaFkyTmxjM05MWlhraU9pSlNRVmxGT0ZZM05qWTFUbEl4VjBVeVEweFNSeUlzSW1WNGNDSTZNVGMzT0RjeU1EVTFOeXdpY0dGeVpXNTBJam9pWkdGMFlYSjVJbjAuVnBfekhTaGJBVFhvUEEyUWRFUzdCemNpUkJUaG8waUFJWDdVQ1puNFdZWE1HcDJWcEdiajJRNHlyMU9uSWczYzlpRjktWlZWcG1HS180M2xrUThlU3cmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JnZlcnNpb25JZD1udWxsJlgtQW16LVNpZ25hdHVyZT0xNDQxNzM0NjYwZWIzMzBhYjI4ZDQ4NjJkZGFjMTBjMjBmMzg4ZjQyM2ZhZTk4YTlmNWEwNTZhNmJkMmY3NGIw',
    imageAlt: 'Строительный крепёж, саморезы и производственная линия',
    phone: '+7 (908) 047-70-30',
    email: 'fasteners@tp1219.ru',
  },
  {
    id: '5',
    slug: 'chemistry',
    name: 'Автохимия',
    shortName: 'Автохимия',
    category: 'Химическое производство',
    description: 'Производство незамерзающих жидкостей и технической автохимии',
    fullDescription:
      'Производство высококачественных незамерзающих жидкостей для систем стеклоомывателей и охлаждения двигателей. Собственная лаборатория контроля качества, возможность фасовки под торговую марку заказчика.',
    services: [
      'Незамерзающие жидкости −20 / −30 / −40 °C',
      'Антифриз для двигателей G11/G12',
      'Жидкость для стеклоомывателей',
      'Технические смазки',
      'Фасовка под СТМ клиента',
    ],
    advantages: [
      'Сертифицированное производство',
      'Собственная лаборатория QC',
      'Разработка рецептур под заказ',
      'Фасовка от 1 л до 200 л',
    ],
    gradientFrom: '#0891b2',
    gradientTo: '#0e7490',
    iconName: 'Droplets',
    image: 'http://s3.datary-dev.ru/api/v1/download-shared-object/aHR0cDovLzEyNy4wLjAuMTo5MDAwL3RwMTIxOS9tYWluX2NvbnRlbnQvaXN0b2NrcGhvdG8tMTM0MDA4ODcxOS02MTJ4NjEyLndlYnA_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1SQVlFOFY3NjY1TlIxV0UyQ0xSRyUyRjIwMjYwNTEzJTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI2MDUxM1QxNDAzMjBaJlgtQW16LUV4cGlyZXM9NDMyMDAmWC1BbXotU2VjdXJpdHktVG9rZW49ZXlKaGJHY2lPaUpJVXpVeE1pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmhZMk5sYzNOTFpYa2lPaUpTUVZsRk9GWTNOalkxVGxJeFYwVXlRMHhTUnlJc0ltVjRjQ0k2TVRjM09EY3lNRFUxTnl3aWNHRnlaVzUwSWpvaVpHRjBZWEo1SW4wLlZwX3pIU2hiQVRYb1BBMlFkRVM3QnpjaVJCVGhvMGlBSVg3VUNabjRXWVhNR3AyVnBHYmoyUTR5cjFPbklnM2M5aUY5LVpWVnBtR0tfNDNsa1E4ZVN3JlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCZ2ZXJzaW9uSWQ9bnVsbCZYLUFtei1TaWduYXR1cmU9NzdmYjc2MDJiZWVhMzgxMzY5NDkxZTFiN2RmM2QwYjZmYjMxYzhhM2QxOWZkMmVmYTlmMmJhMzcwNWMwMDU2Mw',
    imageAlt: 'Линия розлива автохимии с канистрами и лабораторным оборудованием',
    phone: '+7 (908) 047-70-30',
    email: 'chem@tp1219.ru',
  },
  {
    id: '6',
    slug: '3d-printing',
    name: '3D-печать',
    shortName: '3D-печать',
    category: 'Аддитивные технологии',
    description: 'Прототипирование и производство методами FDM и SLA печати',
    fullDescription:
      'Услуги аддитивного производства с использованием технологий FDM и SLA. Изготовление прототипов, мастер-моделей, оснастки и конечных изделий. Работаем с чертежами, эскизами и 3D-моделями заказчика.',
    services: [
      'FDM печать: PLA, PETG, ABS, TPU, PC',
      'SLA/MSLA печать из фотополимеров',
      '3D-сканирование деталей',
      'Постобработка и покраска изделий',
      'Разработка 3D-моделей по чертежам',
    ],
    advantages: [
      'Работаем с чертежами и эскизами',
      'Печать деталей от 1 штуки',
      'Точность до 0.1 мм',
      'Готовность за 24–48 часов',
    ],
    gradientFrom: '#6366f1',
    gradientTo: '#3730a3',
    iconName: 'Printer',
    image: 'http://s3.datary-dev.ru/api/v1/download-shared-object/aHR0cDovLzEyNy4wLjAuMTo5MDAwL3RwMTIxOS9tYWluX2NvbnRlbnQvcGhvdG8tMTY0Mjk2OTE2NDk5OS05Nzk0ODNlMjE2MDEuamZpZj9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPVJBWUU4Vjc2NjVOUjFXRTJDTFJHJTJGMjAyNjA1MTMlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjYwNTEzVDE0MDM1NVomWC1BbXotRXhwaXJlcz00MzIwMCZYLUFtei1TZWN1cml0eS1Ub2tlbj1leUpoYkdjaU9pSklVelV4TWlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKaFkyTmxjM05MWlhraU9pSlNRVmxGT0ZZM05qWTFUbEl4VjBVeVEweFNSeUlzSW1WNGNDSTZNVGMzT0RjeU1EVTFOeXdpY0dGeVpXNTBJam9pWkdGMFlYSjVJbjAuVnBfekhTaGJBVFhvUEEyUWRFUzdCemNpUkJUaG8waUFJWDdVQ1puNFdZWE1HcDJWcEdiajJRNHlyMU9uSWczYzlpRjktWlZWcG1HS180M2xrUThlU3cmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JnZlcnNpb25JZD1udWxsJlgtQW16LVNpZ25hdHVyZT01ZTkxMTA5MzkwNjk4ZTkwNzUzOWE4N2E1OGZkYTEwMWM5ZDRkZTFhOGZhZmQ1MjAyZDA5MzFiNzk4ODIwMDA1',
    imageAlt: '3D-принтеры и прототипы в современной аддитивной лаборатории',
    phone: '+7 (908) 047-70-30',
    email: '3d@tp1219.ru',
  },
  {
    id: '7',
    slug: 'container-homes',
    name: 'Контейнерные дома',
    shortName: 'Контейнерные дома',
    category: 'Модульное строительство',
    description: 'Модульные здания и дома из контейнеров под ключ',
    fullDescription:
      'Проектирование и производство модульных зданий на основе морских контейнеров. Жилые дома, офисы, магазины — быстро, прочно, мобильно. Полная внутренняя отделка включена в комплектацию.',
    services: [
      'Жилые дома и коттеджи из контейнеров',
      'Офисные и административные здания',
      'Торговые павильоны и киоски',
      'Складские комплексы',
      'Быстровозводимые временные объекты',
    ],
    advantages: [
      'Строительство в сжатые сроки',
      'Полная внутренняя отделка',
      'Перемещаемые конструкции',
      'Широкая кастомизация фасада',
    ],
    gradientFrom: '#0f766e',
    gradientTo: '#155e75',
    iconName: 'Home',
    image: 'http://s3.datary-dev.ru/api/v1/download-shared-object/aHR0cDovLzEyNy4wLjAuMTo5MDAwL3RwMTIxOS9tYWluX2NvbnRlbnQvZmlyc3Qtc2NyZWVuLmpwZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPVJBWUU4Vjc2NjVOUjFXRTJDTFJHJTJGMjAyNjA1MTMlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjYwNTEzVDE0MDQyNFomWC1BbXotRXhwaXJlcz00MzIwMCZYLUFtei1TZWN1cml0eS1Ub2tlbj1leUpoYkdjaU9pSklVelV4TWlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKaFkyTmxjM05MWlhraU9pSlNRVmxGT0ZZM05qWTFUbEl4VjBVeVEweFNSeUlzSW1WNGNDSTZNVGMzT0RjeU1EVTFOeXdpY0dGeVpXNTBJam9pWkdGMFlYSjVJbjAuVnBfekhTaGJBVFhvUEEyUWRFUzdCemNpUkJUaG8waUFJWDdVQ1puNFdZWE1HcDJWcEdiajJRNHlyMU9uSWczYzlpRjktWlZWcG1HS180M2xrUThlU3cmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JnZlcnNpb25JZD1udWxsJlgtQW16LVNpZ25hdHVyZT1hZjEyZWE5NmQ2ODg0MzM0OWZhYzc4MWI4OGM3NDZlN2JmZjFlNzNhNzE3ZTc5MTBjMmMwNGYxNGIxMzQwYWFl',
    imageAlt: 'Контейнерный дом на производственной площадке с модульными блоками',
    phone: '+7 (908) 047-70-30',
    email: 'dom@40futov.ru',
  },
];

export const getResidentBySlug = (slug: string): Resident | undefined =>
  residents.find((r) => r.slug === slug);



