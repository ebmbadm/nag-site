import type { BoutiquePage } from "@/lib/content/types";

const FEATURES = {
  title: "Особенности разработки и производства",
  items: [
    { title: "Оригинальные, винтажные компоненты" },
    { title: "Ручная сборка" },
    { title: "Качественные материалы" },
    { title: "Уникальная технология" },
  ],
};

const SHORT_CUSTOM = {
  title: "Индивидуальный заказ",
  body: [
    "Не нашли нужный переходник или сейвер?",
    "Изготовим устройство на заказ, учитывая ваши пожелания по материалам.",
  ],
  cta: { label: "Заполнить заявку на заказ", href: "/kontakty" },
};

export const boutique: BoutiquePage = {
  slug: "boutique",
  eyebrow: "NOVIK TUBES BOUTIQUE",
  title: "Ламповый бутик NOVIK",
  lede:
    "Подбор ламп и аксессуары для ламповой техники. Новый раздел: сейверы и конвертеры для винтажных ламп, позже появятся подобранные лампы. Есть конкретный запрос - свяжитесь с нами.",
  hero: {
    src: "/boutique/vintage-radio-tubes-collection.jpg",
    alt: "Коллекция винтажных радиоламп NOVIK",
    caption: "NOVIK Tubes Boutique",
  },
  areaCards: [
    {
      title: "Сейверы",
      text: "Делаем вручную из старых (NOS) советских деталей: винтажные лампы как основа плюс бакелитовые и керамические панельки.",
      href: "/catalog/savers",
    },
    {
      title: "Конвертеры",
      text: "Позволяют использовать разные лампы в одном усилителе. Из NOS советских деталей, часть из них уникальна - таких переходников не найти больше нигде.",
      href: "/catalog/converters",
    },
    {
      title: "Индивидуальный заказ",
      text: "Ищете конкретную советскую лампу определённого года, завода, параметров? Найдём, проверим и подберём. Изготовим сейвер или конвертер по вашим материалам.",
      href: "#custom",
    },
  ],
  custom: {
    title: "Индивидуальный заказ",
    body: [
      "Ищете конкретную советскую лампу - определённого года, завода или с нужными параметрами? Мы найдём, проверим и подберём для вас эксклюзивную лампу.",
      "Также изготовим сейвер или конвертер по индивидуальному заказу, учитывая ваши пожелания по материалам и методам изготовления.",
    ],
    cta: { label: "Связаться с нами", href: "/kontakty" },
  },
  cta: { label: "Связаться с нами", href: "/kontakty" },
};

export const savers: BoutiquePage = {
  slug: "savers",
  eyebrow: "NOVIK TUBES BOUTIQUE",
  title: "Сейверы для винтажных радиоламп",
  lede:
    "Сейверы сохраняют оригинальные разъёмы в усилителях и избавляют от дорогой замены панелек. Пригодятся, когда вы проверяете лампы. И, конечно, сейвер бывает просто красивой деталью.",
  hero: {
    src: "/boutique/savers/novik-tube-saver-amphenol-black.png",
    alt: "Сейвер NOVIK на бакелитовой панельке Amphenol",
    caption: "Сейвер NOVIK",
  },
  features: FEATURES,
  custom: SHORT_CUSTOM,
  cta: { label: "Заполнить заявку на заказ", href: "/kontakty" },
};

export const converters: BoutiquePage = {
  slug: "converters",
  eyebrow: "NOVIK TUBES BOUTIQUE",
  title: "Конвертеры для ламп",
  lede: "Конвертеры позволяют использовать в вашем устройстве больший спектр ламп.",
  hero: {
    src: "/boutique/converters/novik-converter-pro-40-light.png",
    alt: "Конвертер NOVIK для винтажных ламп",
    caption: "Конвертер NOVIK",
  },
  heroDark: {
    src: "/boutique/converters/novik-converter-pro-40-dark.png",
    alt: "Конвертер NOVIK, деталь",
  },
  features: FEATURES,
  custom: SHORT_CUSTOM,
  cta: { label: "Заполнить заявку на заказ", href: "/kontakty" },
};
