import Link from "next/link";
import type { Metadata } from "next";
import { Container, Section, ProductRow, Theme } from "@/components/ds";
import { InquiryButton } from "@/components/inquiry";
import { getProduct } from "@/lib/content/products";
import { productRow } from "@/lib/content/catalog";

const PHONE = "+7 921 937 25 08";
const TEL = "tel:+79219372508";

/** Catalog order on the home page: amplifiers, processors, modules, NOVIK tube amps. */
const CATALOG = [
  {
    id: "amps",
    title: "Усилители мощности",
    description: "Class-TD, два и четыре канала, высота 1U–2U.",
    all: { label: "Все усилители", href: "/catalog/amplifiers" },
    slugs: ["qm-400", "td-series"],
  },
  {
    id: "dsp",
    title: "DSP-процессоры",
    description: "Корректоры-контроллеры для акустических систем, 4 × 8.",
    all: { label: "Все процессоры", href: "/catalog/processors" },
    slugs: ["d-8000", "f-8", "f-8-pro"],
  },
  {
    id: "modules",
    title: "Встраиваемые модули",
    description: "Усилители Class-TD внутрь корпуса активной акустики.",
    all: { label: "Модули TDS и TDH", href: "/catalog/modules" },
    slugs: ["modules"],
  },
  {
    id: "novik",
    title: (
      <>
        Ламповые усилители <span className="text-novik">NOVIK</span>
      </>
    ),
    description: "Ламповые усилители — часть истории Сергея Новикова с 1976 года. Цена — по запросу.",
    all: { label: "Все ламповые усилители", href: "/catalog/tubes" },
    slugs: ["black-fire", "e12"],
  },
];

const SERVICES = [
  {
    title: "Подготовка к поставке",
    text: "Параметры и состав оборудования проверяются перед поставкой в рамках согласованной конфигурации проекта.",
  },
  {
    title: "Настройка тракта",
    text: "Для модулей можно согласовать параметры входного тракта под задачу системы и способ её дальнейшего управления.",
  },
  {
    title: "Согласованные работы",
    text: "Техническую документацию и порядок допустимых изменений обсуждаем до начала работ — для конкретной модели и проекта.",
  },
  {
    title: "Сервисный маршрут",
    text: "Способ диагностики и обслуживания определяется по ситуации: с учётом модели, задачи и доступной логистики.",
  },
];

export const metadata: Metadata = {
  // Absolute: the default layout title leads with the brand, which almost nobody
  // searches. Lead with the category words instead.
  //
  // Metadata here deliberately makes no claim about where the hardware is made.
  // The gear is OEM, so "производство в Санкт-Петербурге" / "от производителя"
  // would be a false origin claim — and this copy is what Yandex shows in the
  // SERP snippet and in the Direct ad link preview. What is safe to state:
  // "на рынке с 1992 года", the guarantee, and the service department in SPb.
  title: { absolute: "Усилители мощности и DSP-процессоры NAG · NOVIK" },
  description:
    "Усилители мощности, DSP-процессоры и встраиваемые модули для активной акустики. NAG · NOVIK.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "NAG · NOVIK — профессиональное звуковое оборудование",
    description:
      "Профессиональное звуковое оборудование NAG и NOVIK: DSP-процессоры, усилители мощности Class-TD, ламповые усилители. Компания NOVIK создана в 1992 году; NAG — её бренд.",
  },
};

export default function HomePage() {
  return (
    <>
      <Container className="pt-12 sm:pt-20">
        <h1 className="enter m-0 max-w-3xl text-site-section sm:text-site-display">
          Усилители мощности, DSP-процессоры и модули NAG. Ламповые усилители NOVIK.
        </h1>
        <p className="enter [--delay:80ms] mt-6 mb-0 max-w-2xl text-site-lead text-ink-2">
          Санкт-Петербург, с 1992 года. Подбор и инженерная адаптация под задачу проекта.
        </p>
        <div className="enter [--delay:160ms] mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
          <InquiryButton />
          <span className="text-ink-2">
            или позвоните:{" "}
            <a href={TEL} className="font-medium text-ink">
              {PHONE}
            </a>
          </span>
        </div>
      </Container>

      <Container className="flex flex-col gap-24 pt-28">
        {CATALOG.map((group) => (
          <Section
            key={group.id}
            id={group.id}
            title={group.title}
            description={group.description}
            aside={
              <Link href={group.all.href} className="text-ink">
                {group.all.label}
              </Link>
            }
          >
            {group.slugs.map((slug) => (
              <ProductRow key={slug} {...productRow(getProduct(slug).frontmatter)} />
            ))}
          </Section>
        ))}
      </Container>

      <Theme dark data-band-end className="mt-32">
        <Container className="reveal flex flex-wrap gap-12 py-20">
          <div className="flex min-w-0 flex-[1_1_360px] flex-col items-start gap-5">
            <h2 className="m-0 text-site-section">Подбор под задачу проекта</h2>
            <p className="m-0 max-w-lg text-ink-2">
              Расскажите, где и на какую акустику будет работать система. Состав и параметры согласуем до
              поставки.
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-x-7 gap-y-4">
              <InquiryButton />
              <a href={TEL} className="font-medium text-ink">
                {PHONE}
              </a>
            </div>
          </div>
          <dl className="m-0 grid min-w-0 flex-[1_1_520px] gap-x-10 gap-y-8 sm:grid-cols-2">
            {SERVICES.map((s) => (
              <div key={s.title}>
                <dt className="font-semibold">{s.title}</dt>
                <dd className="mt-2 ml-0 text-site-small text-ink-2">{s.text}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </Theme>
    </>
  );
}
