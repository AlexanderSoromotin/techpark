export interface Partner {
  id: string;
  name: string;
  description: string;
  logo?: string;
  url: string;
}

export const partners: Partner[] = [
  {
    id: 'blma',
    name: 'BLMA',
    description: 'Высококачественные станки для обработки листового металла',
    logo: 'http://s3.datary-dev.ru/tp1219/partners/BLMA (1).webp',
    url: 'http://ru.blmagroup.com/',
  },
];


