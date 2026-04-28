export interface Vacancy {
  id: string;
  residentSlug: string;
  residentName: string;
  residentCategory: string;
  position: string;
  schedule: string;
  salary: string;
  requirements: string[];
  contact: string;
}

export const vacancies: Vacancy[] = [
  {
    id: '1',
    residentSlug: 'metalworks',
    residentName: 'Металлоконструкции',
    residentCategory: 'Металлообработка',
    position: 'Сварщик (MIG/MAG, РДС)',
    schedule: 'Полный день, Пн–Пт',
    salary: 'от 65 000 ₽',
    requirements: [
      'Опыт сварки от 2 лет',
      'Умение читать чертежи',
      'Официальное трудоустройство',
    ],
    contact: 'metal@techpark1219.ru',
  },
  {
    id: '2',
    residentSlug: 'hydraulics',
    residentName: 'РВД и гидравлика',
    residentCategory: 'Промышленное оборудование',
    position: 'Слесарь-гидравлик',
    schedule: 'Полный день',
    salary: 'от 55 000 ₽',
    requirements: [
      'Знание гидравлических систем',
      'Опыт работы с РВД приветствуется',
      'Ответственность и аккуратность',
    ],
    contact: 'hydraulics@techpark1219.ru',
  },
  {
    id: '3',
    residentSlug: 'driveshafts',
    residentName: 'Карданные валы',
    residentCategory: 'Автокомпоненты',
    position: 'Токарь / Оператор стенда балансировки',
    schedule: 'Сменный график',
    salary: 'от 60 000 ₽',
    requirements: [
      'Опыт работы на токарном станке',
      'Знание динамической балансировки — плюс',
      'Желание развиваться',
    ],
    contact: 'driveshafts@techpark1219.ru',
  },
  // {
  //   id: '4',
  //   residentSlug: 'meat-production',
  //   residentName: 'Мясное производство',
  //   residentCategory: 'Пищевое производство',
  //   position: 'Обвальщик мяса',
  //   schedule: 'Сменный график 2/2',
  //   salary: 'от 50 000 ₽',
  //   requirements: [
  //     'Опыт работы в пищевой промышленности',
  //     'Медицинская книжка',
  //     'Физическая выносливость',
  //   ],
  //   contact: 'meat@techpark1219.ru',
  // },
  {
    id: '5',
    residentSlug: '3d-printing',
    residentName: '3D-печать',
    residentCategory: 'Аддитивные технологии',
    position: 'Оператор 3D-печати',
    schedule: 'Полный день',
    salary: 'от 45 000 ₽',
    requirements: [
      'Опыт работы с FDM/SLA принтерами',
      'Понимание G-кода и слайсеров',
      'Внимательность к деталям',
    ],
    contact: '3dprint@techpark1219.ru',
  },
  {
    id: '6',
    residentSlug: 'fasteners',
    residentName: 'Крепёж',
    residentCategory: 'Производство',
    position: 'Оператор производственной линии',
    schedule: 'Сменный график',
    salary: 'от 48 000 ₽',
    requirements: [
      'Опыт на производстве от 1 года',
      'Соблюдение норм охраны труда',
    ],
    contact: 'fasteners@techpark1219.ru',
  },
  {
    id: '7',
    residentSlug: 'chemistry',
    residentName: 'Автохимия',
    residentCategory: 'Химическое производство',
    position: 'Лаборант ОТК',
    schedule: 'Полный день, Пн–Пт',
    salary: 'от 50 000 ₽',
    requirements: [
      'Образование: химия или смежная специальность',
      'Опыт работы в лаборатории',
      'Знание ГОСТ и методов контроля',
    ],
    contact: 'chem@techpark1219.ru',
  },
  {
    id: '8',
    residentSlug: 'container-homes',
    residentName: 'Контейнерные дома',
    residentCategory: 'Модульное строительство',
    position: 'Монтажник / Отделочник',
    schedule: 'Полный день',
    salary: 'от 58 000 ₽',
    requirements: [
      'Опыт монтажных и отделочных работ',
      'Чтение строительных чертежей',
      'Наличие инструмента — плюс',
    ],
    contact: 'dom@40futov.ru',
  },
];

