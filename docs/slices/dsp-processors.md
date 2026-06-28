# Slice: DSP-процессоры (звуковые корректоры NAG F & D) — Phase P2

## Overview

Линейка цифровых звуковых процессоров (контроллеров-корректоров акустических
систем) NAG. Слайс покрывает **5 продуктовых страниц** + **1 категорийную
(лендинг) страницу**:

| Семейство | Модель | Позиционирование |
|---|---|---|
| **NAG F** (новое поколение, FIR) | F-8 PRO | Флагман: 4×8, FIR-фильтры, AES/EBU, экспертные ЦАП/АЦП |
| **NAG F** | F-8 | 4×8, FIR, Wi-Fi/Ethernet/USB, ПО продвинутого уровня |
| **NAG D** (флагман — уже построен) | **D-8000 Wi-Fi** | *Уже реализован как референс-шаблон, см. `content/products/d-8000.mdx`* |
| **DSP BY NAG** (бюджетная линейка, трансформаторный БП) | D-4 | 2×6, USB, передняя панель |
| **DSP BY NAG** | D-8 | 4×8, USB, передняя панель |
| **DSP BY NAG** | THE ROGUE | Бюджетный 2×4, простой интерфейс |

Плюс категорийный лендинг `/catalog/processors`, агрегирующий весь модельный
ряд (источник: `dsp/dsp.md`).

D-8000 **уже построен** и служит шаблоном для клонирования всех пяти новых
продуктовых страниц. Этот слайс НЕ переписывает D-8000 — только добавляет
5 продуктов + 1 категорию.

> Важно про линейки: F-8 PRO и F-8 относятся к серии **NAG F**; D-4, D-8 и
> THE ROGUE — к суб-бренду **DSP BY NAG** (трансформаторный блок питания,
> «простая и надёжная техника за разумные деньги»). D-8000 — серия **NAG D**.
> THE ROGUE — это ранее известный процессор производства **D-Factory**,
> включённый в линейку DSP BY NAG.

## Pages

| Продукт / Страница | Маршрут | Источник .md | Изображения (dir · кол-во) | Одной строкой | Ключевые специф. / цена |
|---|---|---|---|---|---|
| NAG F-8 PRO | `/catalog/f-8-pro` | `f8000/f8000.md` | `f8000/images` · 5 | Продвинутый 4×8 DSP с FIR (512 taps), AES-входами, ЦАП/АЦП экспертного уровня | 4×8 · 512 taps FIR · AES/EBU · THD+N −92 dB · SNR 113 dB · **139 900 ₽** |
| NAG F-8 | `/catalog/f-8` | `f8wifi/f8wifi.md` | `f8wifi/images` · 6 | 4×8 DSP с FIR, Wi-Fi-управлением и продвинутым ПО | 4×8 · 512 taps FIR · Wi-Fi/LAN/USB · ADAU1452 + ES9018K2M · 24 пресета · **79 900 ₽** |
| DSP BY NAG D-4 | `/catalog/d-4` | `dspd4/dspd4.md` | `dspd4/images` · 11 | 2×6 контроллер-корректор 96 кГц/32 бит, USB + передняя панель, трансформаторный БП | 2×6 · 96 кГц/32 бит · 24-бит ЦАП/АЦП · GEQ 31 + PEQ 10 · задержка 1000 мс · **34 900 ₽** |
| DSP BY NAG D-8 | `/catalog/d-8` | `dspd8/dspd8.md` | `dspd8/images` · 10 | 4×8 контроллер-корректор 96 кГц/32 бит, USB + передняя панель, трансформаторный БП | 4×8 · 96 кГц/32 бит · 24-бит ЦАП/АЦП · GEQ 31 + PEQ 10 · задержка 1000 мс · **39 900 ₽** |
| DSP BY NAG THE ROGUE | `/catalog/the-rogue` | `therogue/therogue.md` | `therogue/images` · 6 | Бюджетный 2×4 96 кГц/32 бит с простым интерфейсом и трансформаторным БП | 2×4 · 96 кГц · 8-полос PEQ · генератор розового шума · задержка 40 мс · **24 900 ₽** |
| **Категория: Процессоры** | `/catalog/processors` | `dsp/dsp.md` | — (реюз обложек продуктов) | Лендинг всего модельного ряда процессоров NAG | Сетка из 6 моделей со ссылками на карточки |

Все исходные `images/` лежат в `/Users/viktor/Documents/kimi/workspace/novikamps/<folder>/images/`.
При сборке копировать в `public/products/<slug>/` (как для d-8000 — см.
`public/products/d-8000`).

### Точный список изображений (для копирования и frontmatter)

**f8000/images** (5):
`nag-f8pro-front-panel.png`, `nag-f8pro-software-channel-settings.jpg`,
`nag-f8pro-software-compressor.jpg`, `nag-f8pro-software-eq.jpg`,
`nag-f8pro-software-routing.jpg`
→ `public/products/f-8-pro/`

**f8wifi/images** (6):
`nag-f8-front-panel-interface.png`, `nag-f8-software-eq-screen.png`,
`nag-f8-software-fir-screen.png`, `nag-f8-software-level-meters.png`,
`nag-f8-software-matrix-screen.png`, `nag-f8-software-routing-screen.png`
→ `public/products/f-8/`

**dspd4/images** (11):
`nag-d4-front-panel.jpg`, `nag-d4-front-rear-panel.png`,
`nag-d4-pcb-internal.jpg`, `nag-d4-promo-features.png`,
`nag-d4-software-channel-copy.png`, `nag-d4-software-channel-overview.png`,
`nag-d4-software-eq-graph.png`, `nag-d4-software-multiple-units.png`,
`nag-d4-software-routing-matrix.png`, `nag-d4-specifications-sheet.jpg`,
`power-connector-icon.png`
→ `public/products/d-4/`

**dspd8/images** (10):
`nag-d8-front-panel.jpg`, `nag-d8-front-rear-panel.png`,
`nag-d8-pcb-internal.jpg`, `nag-d8-promo-d4-d8-comparison.png`,
`nag-d8-software-channel-copy.png`, `nag-d8-software-channel-overview.png`,
`nag-d8-software-eq-graph.png`, `nag-d8-software-multiple-units.png`,
`nag-d8-software-routing-matrix.png`, `nag-d8-specifications-sheet.jpg`,
`power-connector-icon.png`
→ `public/products/d-8/`

**therogue/images** (6):
`nag-therogue-front-panel.jpg`, `nag-therogue-promo-features.png`,
`nag-therogue-rear-panel.png`, `nag-therogue-software-main-screen.png`,
`nag-therogue-software-routing.png`, `nag-therogue-specifications-sheet.png`
→ `public/products/the-rogue/`

**dsp/images** — пустая. Категорийная страница реюзит обложки продуктов
(передние панели).

> Примечание: `*-specifications-sheet.*` и `*-promo-features.png` — это
> готовые маркетинговые «простыни» с таблицами/иконками. Их НЕ обязательно
> разбирать пиксель-в-пиксель: данные уже перенесены в `specGroups` /
> `features` из `.md`. Спецшиты можно использовать как один из слайдов галереи
> или вовсе пропустить. PCB-снимки (`*-pcb-internal.jpg`) — для tech-band /
> галереи. Скриншоты ПО (`*-software-*`) — для software-секции.

## Design reference

**Клонировать продуктовый шаблон D-8000 без изменений.** Источник правды:
- Шаблон страницы: `app/catalog/[slug]/page.tsx` (уже отрисовывает Breadcrumb →
  ProductHero → MDX body → FeatureBand → TechBand → SoftwareSection →
  SpecsSection — всё условно по наличию полей).
- Секции: `components/product/sections.tsx`.
- Референс-контент: `content/products/d-8000.mdx`.

Каждый новый продукт = **один новый `.mdx` файл** в `content/products/`.
Никакого нового кода рендеринга для продуктовых страниц не требуется — только
данные. Это и есть смысл паттерна.

**Токены и DS-примитивы (только токены, без хардкода hex):**
- Hero: `Eyebrow`, `Badge`, `Chip`, `Divider`, `Gallery`, `buttonVariants`,
  `formatPrice`. Заголовок — `font-display uppercase text-text`, цена —
  `text-4xl`.
- Тёмные технические банды: `FeatureBand` и `TechBand` используют
  `<Surface mode="dark">` (TechBand дополнительно `var(--nag-black-980)`).
- Галерея в hero: да (`Gallery` из `components/ds/gallery.tsx`).
- Аккордеон спецификаций: да (`SpecsSection` → `AccordionItem` + `SpecTable`,
  первая группа `defaultOpen: true`).
- Feature-band: да (4 карточки с иконками).
- Tech-band: для F-8 PRO / F-8 — да (чипы DSP/ЦАП). Для D-4/D-8/THE ROGUE —
  опционально (можно опустить `tech`, секция не отрендерится).
- Software-секция: да для всех (у всех есть скриншоты ПО).

**Отличия от D-8000 (важно при наполнении):**
1. **Логотипы поставщиков в hero захардкожены под D-8000.** В
   `ProductHero` (`components/product/sections.tsx`, строки ~125–128) жёстко
   зашиты `"/products/d-8000/burr-brown-logo.png"` и
   `"/products/d-8000/wifi-usb-rj45-connectivity.png"`. Для других продуктов
   этих файлов нет → будет битая картинка. **Нужно сделать этот блок
   data-driven** (новое опциональное поле `partnerLogos?: media[]` во
   frontmatter, рендерить блок только если поле задано) ИЛИ убрать блок из
   общего hero. См. «Components needed».
2. **F-серия** богаче по DSP (FIR-дизайнер, до 512 taps, AES/EBU) → больше
   групп `specGroups` и карточек `software.items`.
3. **DSP BY NAG (D-4/D-8/THE ROGUE)** проще: акцент на «трансформаторный блок
   питания», «PLUG N PLAY», «настройка с передней панели». У них нет Wi-Fi и
   AES. `tech`-band можно опустить.
4. **D-4 и D-8 делят один источник** (`dspd4.md` и `dspd8.md` — почти
   идентичны, общая таблица «Модель D-4 / Модель D-8»). Различия только:
   входы/выходы (2×6 vs 4×8), цена (34 900 vs 39 900). Остальные специф.
   общие. Это два отдельных `.mdx`, но контент почти зеркальный.
5. **Цены присутствуют у всех** (см. таблицу выше) — все продаются, у каждого
   есть `price.amount`.

## Data model

Реюз `productFrontmatterSchema` из `lib/content/schema.ts` **как есть** для
всех полей. Одно предлагаемое **дополнение схемы** (опциональное, без поломки
существующего D-8000):

```ts
// добавить в productFrontmatterSchema (после software, перед specGroups)
partnerLogos: z.array(media).optional(),  // лого ЦАП/DSP-поставщиков в hero
```

…и перевести захардкоженный блок логотипов в `ProductHero` на это поле
(рендерить только если `product.partnerLogos?.length`). Для D-8000 — добавить
поле в его frontmatter, чтобы сохранить текущий вид. Если future-agent решит
не трогать hero — тогда просто убрать жёсткий блок логотипов и поле не нужно
(допустимо). Все остальные поля схемы покрывают потребности слайса полностью.

### Конкретный пример: `content/products/f-8-pro.mdx` (репрезентативный)

```mdx
---
name: "NAG F-8 PRO"
line: "DSP Processor · Серия NAG F"
subtitle: "Продвинутый процессор 4 × 8 с FIR"
badges: ["FIR", "AES/EBU"]
category: "Процессоры"
breadcrumb:
  - { label: "Каталог", href: "/catalog" }
  - { label: "Процессоры", href: "/catalog/processors" }
  - { label: "F-8 PRO" }
price:
  amount: 139900
  currency: "₽"
  note: "Без НДС · Гарантия 2 года · EAC"
summary: "Продвинутый 4×8 DSP-процессор с FIR-фильтрами (до 512 taps на каждом входе и выходе), цифровыми AES-входами и ЦАП/АЦП экспертного уровня. Свободная маршрутизация, гибкий DSP, кроссоверы до 48 dB/oct и задержки до 2000 мс."
specChips:
  - "4 вх. XLR"
  - "8 вых. XLR"
  - "512 taps FIR"
  - "AES/EBU"
  - "Ethernet · USB"
  - "SNR 113 dB"
gallery:
  - { src: "/products/f-8-pro/nag-f8pro-front-panel.png", alt: "NAG F-8 PRO — передняя панель", caption: "Передняя панель" }
  - { src: "/products/f-8-pro/nag-f8pro-software-routing.jpg", alt: "ПО F-8 PRO — маршрутизация", caption: "Маршрутизация" }
  - { src: "/products/f-8-pro/nag-f8pro-software-eq.jpg", alt: "ПО F-8 PRO — эквалайзер", caption: "Графический эквалайзер" }
features:
  eyebrow: "Ключевые преимущества"
  title: "Почему F-8 PRO"
  cards:
    - { icon: "activity", title: "FIR-фильтры 512 taps", text: "До 512 taps на каждом из 4 входов и 8 выходов; импорт внешних кривых и автокалибровка." }
    - { icon: "git-branch", title: "Свободная маршрутизация", text: "Любые физические входы/выходы, смешение и комбинация каналов до и после FIR." }
    - { icon: "sliders", title: "Гибкий DSP", text: "15 полос PEQ, High/Low-Shelf, All-Pass, Phase, Band-Pass, Notch + HP/LP (3 типа)." }
    - { icon: "wifi", title: "Ethernet / USB", text: "Прямое подключение к ПК по USB и Ethernet с группировкой нескольких устройств." }
tech:
  eyebrow: "Архитектура"
  title: "DSP и преобразователи экспертного уровня"
  lede: "Низкие искажения и широкий динамический диапазон: THD+N −92 dB, SNR 113 dB, Crosstalk 110 dB."
  cards:
    - { label: "FIR", chip: "512 taps", text: "512 на вход / 512 на выход · окна Kaiser, Nuttall, Hanning, Blackman" }
    - { label: "Кроссоверы", chip: "3 типа · 48 dB/oct", text: "Крутизна до 48 dB/oct" }
    - { label: "Задержка", chip: "0–2000 мс", text: "На каждом входе и выходе" }
software:
  eyebrow: "Программное обеспечение"
  title: "Графическая панель управления"
  lede: "Логичная цепочка модулей: NOISE GATE → PEQ-X → DEQ → DELAY → MATRIX1 → FIR → PEQ-X → COMP → LIMIT. Каждый модуль — отдельная иконка с активацией и глубокой настройкой."
  hero: { src: "/products/f-8-pro/nag-f8pro-software-routing.jpg", alt: "Главный экран ПО F-8 PRO", caption: "Маршрутизация и цепочка обработки" }
  items:
    - { src: "/products/f-8-pro/nag-f8pro-software-eq.jpg", alt: "Графический эквалайзер", title: "Эквалайзер", text: "До 15 полос PEQ на входах, 10 на выходах. Parametric, Shelf, Allpass, Notch, Elliptic, VariQ." }
    - { src: "/products/f-8-pro/nag-f8pro-software-channel-settings.jpg", alt: "Настройка каналов", title: "Настройка каналов", text: "Источник, mute, фаза, маршрутизация — независимо по каждому каналу." }
    - { src: "/products/f-8-pro/nag-f8pro-software-compressor.jpg", alt: "Компрессор и лимитер", title: "Компрессор и лимитер", text: "Threshold, Ratio, Attack, Release, Knee с мгновенной визуализацией." }
specGroups:
  - title: "Аналоговые интерфейсы и уровни"
    defaultOpen: true
    rows:
      - { label: "Аналоговые интерфейсы", value: "4 × XLR F (бал.), 8 × XLR M (бал.)" }
      - { label: "Макс. уровень", value: "+20 dBu" }
      - { label: "Частотный диапазон", value: "20 Гц – 20 кГц (A-wt)" }
      - { label: "Уровень шума", value: "−93 dBu (A-wt)" }
      - { label: "THD+N", value: "−92 dB @ 0 dBu, 1 kHz" }
      - { label: "Динамический диапазон / SNR", value: "113 dB @ 20 dBu, 1 kHz" }
      - { label: "Crosstalk", value: "110 dB" }
  - title: "Обработка сигнала"
    rows:
      - { label: "FIR-taps", value: "512 на вход / 512 на выход" }
      - { label: "Кроссоверы", value: "3 типа, до 48 dB/oct" }
      - { label: "EQ-полосы", value: "Вход — 15, Выход — 10" }
      - { label: "Задержка", value: "0 – 2000 мс (вход/выход)" }
      - { label: "Матрица маршрутизации", value: "4 × 4 (любые комбинации вход⇄выход)" }
      - { label: "Пресеты", value: "30, с опцией блокировки" }
  - title: "Питание и габариты"
    rows:
      - { label: "Питание", value: "90 – 245 В AC, 50/60 Hz" }
      - { label: "Энергопотребление", value: "< 20 W" }
      - { label: "Габариты / Вес", value: "481 × 268 × 45 мм, ~3,6 кг" }
---

Процессор **NAG F-8 PRO** — продвинутый цифровой контроллер-корректор 4 × 8
серии NAG F с поддержкой FIR-фильтров, цифровых входов AES и ЦАП/АЦП
экспертного уровня. Логично выстроенная цепочка обработки, свободная
маршрутизация каналов и встроенный FIR-дизайнер с поддержкой до 512 taps.
```

Этот пример — точная калька структуры `d-8000.mdx`. Остальные 4 продукта
строятся так же; ниже — их специфика (см. «Content notes»).

## Components needed

**Реюз из `components/ds` (ничего нового для рендеринга не требуется):**
`Container`, `Eyebrow`, `Badge`, `Chip`, `Divider`, `Surface`, `SpecTable`,
`AccordionItem`, `Figure`, `Gallery`, `buttonVariants` + продуктовые секции
`Breadcrumb`, `ProductHero`, `FeatureBand`, `TechBand`, `SoftwareSection`,
`SpecsSection` (`components/product/sections.tsx`).

**Изменения, которые понадобятся (не новые примитивы, а правки существующего):**

1. **icon-map** (`components/product/icon-map.tsx`) — текущая карта содержит
   только: `cpu, wifi, activity, layers, star, sliders`. Для feature-карточек
   DSP-слайса нужны новые иконки lucide. Предлагаемые добавления:
   - `git-branch` (маршрутизация), `plug`/`power` (трансформаторный БП),
     `usb` (USB plug-n-play), `gauge` (низкие искажения), `monitor`
     (передняя панель), `waves`/`audio-waveform` (розовый шум / FIR).
   Любая иконка без записи в MAP молча падает на `Star` (fallback есть), но
   для точности — расширить MAP. Это правка одного файла, не новый компонент.

2. **ProductHero partner-logos** (`components/product/sections.tsx`) — см.
   «Data model»: либо сделать блок логотипов data-driven через
   `partnerLogos?`, либо убрать. Обязательно решить до сборки, иначе все
   страницы кроме D-8000 покажут битые `/products/d-8000/*-logo.png`.

**НОВЫЙ компонент — категорийная страница `/catalog/processors`:**

- Файл: `app/catalog/processors/page.tsx` (статический, без `[slug]`).
- Это **категорийный/лендинг шаблон**, не продуктовый. В проекте его ещё нет
  (нет ни `/catalog` индекса, ни категорий) — это первая категорийная
  страница. Обоснование нового кода: продуктовый шаблон управляется
  данными MDX, а лендинг — это hand-built страница с hero + сеткой карточек
  моделей. Переиспользовать `Container`, `Eyebrow`, `SectionHeader`, `Surface`,
  `Badge`, `Chip`, `buttonVariants`, `Figure`.
- Предлагаемый **новый presentational-компонент** `ProductCard`
  (`components/catalog/product-card.tsx`): обложка (передняя панель) + название
  + линейка + короткое описание + цена + ссылка на `/catalog/<slug>`.
  Обоснование: карточка понадобится и будущему `/catalog` индексу, и другим
  категориям (процессоры, усилители и т.д.) — стоит вынести сразу. Если
  future-agent хочет минимизировать — допустимо инлайнить разметку карточки
  прямо в `processors/page.tsx` и вынести позже.
- Данные категории можно держать прямо в `processors/page.tsx` (массив из 6
  моделей со slug/названием/ценой/обложкой/одной строкой) — отдельный data
  module не обязателен для одной страницы. Контент берётся из `dsp/dsp.md`.

> Минимально новый код в слайсе: (а) 1 категорийная страница
> `app/catalog/processors/page.tsx` (+ опц. `ProductCard`); (б) правка
> `icon-map.tsx`; (в) решение по partner-logos в `ProductHero`. Пять продуктов
> — чистые данные (`.mdx`), кода не требуют.

## Content notes

- **Цены (все продаются, EAC/гарантия):** F-8 PRO — 139 900 ₽; F-8 — 79 900 ₽;
  D-8000 — 122 900 ₽ (уже на сайте); D-4 — 34 900 ₽; D-8 — 39 900 ₽;
  THE ROGUE — 24 900 ₽. Использовать `price.note` как у D-8000:
  «Без НДС · Гарантия 2 года · EAC» (EAC/гарантия упомянуты в реф-контенте
  D-8000; для DSP BY NAG акцент в note можно сместить на «Трансформаторный БП»).
- **Серии в `line` (eyebrow):** F-8 PRO / F-8 → «Серия NAG F»; D-4 / D-8 /
  THE ROGUE → «DSP BY NAG»; (D-8000 → «NAG Pro Audio», уже задано).
- **Бренд-абзац DSP BY NAG** (повторяется в dspd4/dspd8/therogue, строки 6–7):
  «Компания NOVIK представляет совершенно новую линейку продуктов “BY NAG”…
  Отличительная особенность всех моделей — трансформаторный блок питания…».
  Использовать как MDX-body или часть `summary` для трёх бюджетных моделей.
- **D-4 vs D-8 — общий источник.** `dspd4.md` и `dspd8.md` почти идентичны
  (одна таблица «Модель D-4 / Модель D-8»). Различия: D-4 = 2 вх / 6 вых, цена
  34 900; D-8 = 4 вх / 8 вых, цена 39 900. ВНИМАНИЕ на расхождение в источнике:
  заголовок dspd8.md строка 21 говорит «192кГц/32 бит», но таблица специф.
  (строка 73) и врезка (строка 15) — «96кГц». Источник внутренне
  противоречив → **брать 96 кГц / 32 бит** (совпадает с таблицей и врезкой;
  192 кГц — опечатка заголовка). Зафиксировать в спецификации 96 кГц для D-8.
- **THE ROGUE специфика:** производитель — D-Factory; «генератор розового
  шума» на каждый канал (уникальная фича — feature-карточка, icon
  `waves`/`audio-waveform`); задержка всего 40 мс суммарно (20 мс/канал);
  частотный диапазон шире — 20 Гц – 30 кГц; вес всего 1.3 кг; питание
  фиксированное 220 В (не 90–245). USB TYPE B (у D-4/D-8 — USB TYPE A).
- **F-8 vs F-8 PRO специфика:** F-8 PRO — AES-входы, ЦАП/АЦП экспертного
  уровня, до 512 taps на вход И выход, 15 полос PEQ; габариты 481×268×45,
  ~3,6 кг. F-8 — Wi-Fi-модуль (опц.), конкретные чипы `ADAU1452` +
  `ES9018K2M`, 8-полос PEQ, задержка с шагом 21 µs, 24 пресета с паролями;
  габариты 485×200×45 (1U), 4 кг. У обоих FIR 512 taps, но у F-8 — «3–512
  taps/канал, IIR→FIR».
- **Категория `/catalog/processors`** (источник `dsp/dsp.md`): агрегатор. В
  исходнике 6 позиций со ссылками — F8 PRO, F8, D-8000 Wi-Fi (флагман,
  «наше лучшее решение»), THE ROGUE, D-4, D-8. Исходные ссылки ведут на
  старые роуты (`/f-series`, `/d8000`, `/therogue`, `/dspd4`, `/dspd8`) —
  **переписать на новые** `/catalog/f-8-pro`, `/catalog/f-8`,
  `/catalog/d-8000`, `/catalog/the-rogue`, `/catalog/d-4`, `/catalog/d-8`.
  Выделить D-8000 как флагман (Badge «BEST SELLER» / «Флагман»).
- **«Материалы для загрузки» / ПРОГРАММА** — в источниках есть ссылки на ПО
  (Яндекс.Диск): THE ROGUE → `disk.yandex.ru/d/c553-lrsMrqrLA`; D-4/D-8 →
  `disk.yandex.ru/d/EDKxSOM4s-4yfg`. Схема сейчас не имеет поля для
  «скачать ПО». Можно: (а) добавить ссылку в MDX-body, либо (б) не включать
  (вне рамок токенов/схемы). Рекомендация: упомянуть в MDX-body одной строкой,
  не плодить новое поле.
- **RU-копирайт:** сохранять единицы как в источнике (dBu, dB/oct, кОм, Гц,
  мс, taps). Не переводить технические аббревиатуры (FIR, PEQ, GEQ, AES/EBU,
  THD+N, SNR, RMS, HPF/LPF). Использовать «×» для конфигурации (4 × 8).

## Acceptance criteria

- [ ] `npm run build` зелёный; `generateStaticParams` (в
  `app/catalog/[slug]/page.tsx`) порождает 6 продуктов: `d-8000`, `f-8-pro`,
  `f-8`, `d-4`, `d-8`, `the-rogue`.
- [ ] Категория `/catalog/processors` собирается статически (SSG), без
  `[slug]`-конфликта.
- [ ] Каждый из 5 новых `.mdx` проходит `productFrontmatterSchema.safeParse`
  (иначе билд падает — это by design в `lib/content/products.ts`).
- [ ] Все изображения скопированы в `public/products/<slug>/`; в frontmatter
  ссылки на реально существующие файлы; нет битых картинок (особо —
  partner-logos в hero, см. правку).
- [ ] Только токены: ни одного hardcoded hex; тёмные банды через
  `<Surface mode="dark">`; тип-скейл `text-*`, шрифты `font-display/text/mono`.
- [ ] Контент верен источнику: цены, конфигурации (2×6 / 4×8 / 2×4), специф.
  не выдуманы; D-8 = 96 кГц (не 192); THE ROGUE = D-Factory, розовый шум,
  40 мс.
- [ ] `generateMetadata` отдаёт `title`/`description`/OG-image для каждого
  продукта (механика уже есть в шаблоне).
- [ ] Breadcrumb у каждого продукта: Каталог → Процессоры → <модель>;
  ссылка «Процессоры» ведёт на рабочий `/catalog/processors`.
- [ ] Категорийная страница линкует на актуальные `/catalog/<slug>` (не на
  старые `/f-series`, `/d8000` и т.п.).
- [ ] Lighthouse/accessibility: у всех `Image`/`Figure` заданы осмысленные
  `alt` (на русском, как в галерее D-8000).

## Run-recipe

Future-agent выполняет по шагам:

1. **`/brainstorming`** — согласовать: (а) решение по partner-logos в
   `ProductHero` (data-driven `partnerLogos?` vs удалить блок); (б) нужен ли
   отдельный `ProductCard` сейчас; (в) трактовку 96 vs 192 кГц для D-8
   (взять 96).
2. **Анализ источников** — прочитать полностью:
   `f8000/f8000.md`, `f8wifi/f8wifi.md`, `dspd4/dspd4.md`, `dspd8/dspd8.md`,
   `therogue/therogue.md`, `dsp/dsp.md` (все в
   `/Users/viktor/Documents/kimi/workspace/novikamps/<folder>/`); просмотреть
   `images/` каждой папки; свериться с референсом
   `content/products/d-8000.mdx`, `components/product/sections.tsx`,
   `lib/content/schema.ts`.
3. **`/writing-plans`** — план: (1) копирование изображений в
   `public/products/<slug>/`; (2) правка `icon-map.tsx`; (3) правка/решение
   `ProductHero` + (опц.) `partnerLogos` в схеме и в `d-8000.mdx`; (4) 5 новых
   `.mdx`; (5) `app/catalog/processors/page.tsx` (+ опц. `ProductCard`).
4. **Имплементация** (TDD где есть логика): чистая логика тут — только
   валидатор frontmatter и `generateStaticParams`. Тест-кейс: каждый новый
   slug загружается через `getProduct(slug)` без throw; `getProductSlugs()`
   возвращает 6 ожидаемых slug. Для категорийной страницы — smoke-проверка
   рендера и валидности ссылок. Контент `.mdx` — данные, покрываются
   schema-валидацией при билде.
5. **`/requesting-code-review`** — проверить: токены-онли, отсутствие битых
   ассетов, точность цен/специфик против источника, корректность маршрутов и
   breadcrumb, зелёный билд.
