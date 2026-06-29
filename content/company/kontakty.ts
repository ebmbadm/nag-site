import type { ContactsContent } from "@/lib/content/types";

export const kontakty: ContactsContent = {
  eyebrow: "Контакты",
  title: "Свяжитесь с нами",
  lede: "Остались вопросы? Напишите нам и оставьте свои контакты, мы обязательно свяжемся с вами.",
  phone: { display: "+7 921 937 25 08", href: "tel:+79219372508" },
  email: { display: "novikamps@mail.ru", href: "mailto:novikamps@mail.ru" },
  address: { lines: ["Санкт-Петербург", "Московское шоссе, 25 литера А", "Офис 216А"] },
  form: {
    title: "Оставить заявку",
    note: "Форма скоро заработает. Пока пишите на почту или звоните.",
    disabled: true,
  },
};
