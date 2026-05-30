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
    url: 'https://www.blmamachinery.com/',
  },
  {
    id: 'feitian',
    name: 'ФЭЙТЯНЬ',
    description: 'Высококачественное профилегибочное оборудование',
    logo: 'http://s3.datary-dev.ru/tp1219/partners/rfmtf (1).png',
    url: 'https://rfmtf.ru/',
  },
];


