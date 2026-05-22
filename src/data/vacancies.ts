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
    residentName: 'Металлообработка и изделия из металла',
    residentCategory: 'Металлообработка',
    position: 'Сварщик (MIG/MAG, РДС)',
    schedule: 'Полный день, Пн–Пт',
    salary: 'от 65 000 ₽',
    requirements: [
      'Опыт сварки от 2 лет',
      'Умение читать чертежи',
      'Официальное трудоустройство',
    ],
    contact: 'metal@tp1219.ru',
  },
  {
    id: '2',
    residentSlug: 'hydraulics',
    residentName: 'РВД и гидравлика',
    residentCategory: 'Гидравлика',
    position: 'Слесарь-гидравлик',
    schedule: 'Полный день',
    salary: 'от 55 000 ₽',
    requirements: [
      'Знание гидравлических систем',
      'Опыт работы с РВД приветствуется',
      'Ответственность и аккуратность',
    ],
    contact: 'rvd@tp1219.ru',
  },
  {
    id: '3',
    residentSlug: 'driveshafts',
    residentName: 'Карданные валы и восстановление деталей',
    residentCategory: 'Автокомпоненты',
    position: 'Токарь / Оператор стенда балансировки',
    schedule: 'Сменный график',
    salary: 'от 60 000 ₽',
    requirements: [
      'Опыт работы на токарном станке',
      'Знание динамической балансировки — плюс',
      'Желание развиваться',
    ],
    contact: 'val@tp1219.ru',
  },
  {
    id: '4',
    residentSlug: 'construction-materials',
    residentName: 'Строительные материалы и конструкции',
    residentCategory: 'Строительство',
    position: 'Оператор линии профлиста',
    schedule: 'Полный день',
    salary: 'от 52 000 ₽',
    requirements: [
      'Опыт работы на гибочном или прокатном оборудовании приветствуется',
      'Внимательность к размерам и маркировке',
      'Готовность к серийному производству',
    ],
    contact: 'stroy@tp1219.ru',
  },
  {
    id: '5',
    residentSlug: 'ventilation',
    residentName: 'Вентиляция и инженерные системы',
    residentCategory: 'Инженерные системы',
    position: 'Жестянщик / Сборщик воздуховодов',
    schedule: 'Полный день',
    salary: 'от 50 000 ₽',
    requirements: [
      'Навыки работы с листовым металлом',
      'Понимание сборки фасонных элементов',
      'Аккуратность и соблюдение размеров',
    ],
    contact: 'vent@tp1219.ru',
  },
  {
    id: '6',
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
    contact: '3d@tp1219.ru',
  },
  {
    id: '7',
    residentSlug: 'fasteners',
    residentName: 'Крепёж и метизы',
    residentCategory: 'Метизы',
    position: 'Оператор производственной линии',
    schedule: 'Сменный график',
    salary: 'от 48 000 ₽',
    requirements: [
      'Опыт на производстве от 1 года',
      'Соблюдение норм охраны труда',
    ],
    contact: 'fasteners@tp1219.ru',
  },
  {
    id: '8',
    residentSlug: 'industrial-equipment',
    residentName: 'Промышленное оборудование и изделия',
    residentCategory: 'Промышленное производство',
    position: 'Слесарь-сборщик промышленного оборудования',
    schedule: 'Полный день, Пн–Пт',
    salary: 'от 58 000 ₽',
    requirements: [
      'Чтение сборочных чертежей',
      'Опыт слесарной сборки и подгонки узлов',
      'Умение работать с ручным инструментом',
    ],
    contact: 'equip@tp1219.ru',
  },
  {
    id: '9',
    residentSlug: 'recycling',
    residentName: 'Переработка и экология',
    residentCategory: 'Экология и переработка',
    position: 'Оператор линии переработки',
    schedule: 'Сменный график',
    salary: 'от 47 000 ₽',
    requirements: [
      'Опыт работы на дробильном или шредерном оборудовании приветствуется',
      'Готовность к сменному графику',
      'Соблюдение техники безопасности',
    ],
    contact: 'recycling@tp1219.ru',
  },
  {
    id: '10',
    residentSlug: 'tooling',
    residentName: 'Производство механизмов и оснастки',
    residentCategory: 'Инструментальное производство',
    position: 'Слесарь-инструментальщик',
    schedule: 'Полный день',
    salary: 'от 62 000 ₽',
    requirements: [
      'Опыт изготовления или ремонта штампов и оснастки',
      'Навыки измерений и доводки деталей',
      'Умение читать чертежи',
    ],
    contact: 'tooling@tp1219.ru',
  },
  {
    id: '11',
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

