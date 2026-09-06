type History2Image = { type: "image"; alt: string; src: string };
type History2Paragraph = { type: "paragraph"; text: string };
type History2Block = History2Image | History2Paragraph;

import type { HistoryChapter } from "@/lib/content/types";

export type History2Document = {
  title: string;
  subtitle: string;
  deck: string;
  chapters: { title: string; blocks: History2Block[] }[];
  notesTitle: string;
  notes: string[];
};

const imagePattern = /^!\[(.*)]\((.*)\)$/;

export function parseHistory2(source: string): History2Document {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const document: History2Document = {
    title: "",
    subtitle: "",
    deck: "",
    chapters: [],
    notesTitle: "",
    notes: [],
  };
  let inNotes = false;
  let chapter: History2Document["chapters"][number] | undefined;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;
    if (line === "---") {
      inNotes = true;
      chapter = undefined;
      continue;
    }
    if (line.startsWith("# ")) {
      document.title = line.slice(2);
      continue;
    }
    if (line.startsWith("## ")) {
      if (inNotes) document.notesTitle = line.slice(3);
      else document.subtitle = line.slice(3);
      continue;
    }
    if (line.startsWith("### ")) {
      chapter = { title: line.slice(4), blocks: [] };
      document.chapters.push(chapter);
      continue;
    }
    if (!document.deck && line.startsWith("*") && line.endsWith("*")) {
      document.deck = line.slice(1, -1);
      continue;
    }
    if (inNotes) {
      document.notes.push(line);
      continue;
    }
    const image = line.match(imagePattern);
    if (image && chapter) {
      chapter.blocks.push({ type: "image", alt: image[1], src: image[2] });
    } else if (chapter) {
      chapter.blocks.push({ type: "paragraph", text: line });
    }
  }

  if (!document.title || !document.subtitle || !document.deck || document.chapters.length === 0) {
    throw new Error("The approved History 2.0 source is incomplete");
  }
  return document;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function publicImagePath(relativePath: string) {
  return `/history-2/${relativePath.split("/").map(encodeURIComponent).join("/")}`;
}

const imageDimensions: Record<string, { width: number; height: number }> = {
  "Комплекты_слегка_светлее.png": { width: 1500, height: 1219 },
  "novik_v7_assets/01_K1512.jpg": { width: 1328, height: 1584 },
  "novik_v7_assets/05_AK2512_фронт.jpg": { width: 1336, height: 1724 },
  "novik_v7_assets/05_SW-6025.jpg": { width: 1593, height: 2450 },
  "novik_v7_assets/06_RF400_открытый_корпус_2011.jpg": { width: 1000, height: 522 },
  "novik_v7_assets/06_RF400_фронт_2011.jpg": { width: 1000, height: 91 },
  "novik_v7_assets/07_QM1_внутренний_вид.jpg": { width: 2850, height: 538 },
  "novik_v7_assets/08_QM400_OLD_из_мануала_2014.png": { width: 1818, height: 338 },
  "novik_v7_assets/09_QM40_передняя_панель_2012.jpg": { width: 2850, height: 540 },
  "novik_v7_assets/10_серия_A_фронт_из_техпаспорта_2014.jpg": { width: 1645, height: 235 },
  "novik_v7_assets/11_серия_B_эскиз_из_техпаспорта_2016.jpg": { width: 2190, height: 245 },
  "novik_v7_assets/12_MQ10_открытый_корпус.jpg": { width: 1000, height: 416 },
  "novik_v7_assets/Листовка_NAG_светлый_фон.png": { width: 1325, height: 1187 },
  "novik_v7_assets/nag-qm400-front-panel.jpg": { width: 1680, height: 494 },
};

export function history2ToChapters(document: History2Document): HistoryChapter[] {
  return document.chapters.map((chapter, index) => {
    const datedTitle = chapter.title.match(/^(\d{4}(?:–\d{4})?)\.\s*(.+)$/);
    const fallback = chapter.title === "В Гуанчжоу с Виктором"
      ? { year: "2017–2019", label: "Семейная история" }
      : { year: "2019", label: "Эпилог" };

    return {
      id: `history-2-${index + 1}`,
      year: datedTitle?.[1] ?? fallback.year,
      label: datedTitle ? "История NOVIK" : fallback.label,
      title: datedTitle?.[2] ?? chapter.title,
      blocks: chapter.blocks.map((block) => {
        if (block.type === "paragraph") return { type: "p" as const, text: block.text };
        const dimensions = imageDimensions[block.src] ?? { width: 1200, height: 750 };
        return {
          type: "figure" as const,
          src: publicImagePath(block.src),
          alt: block.alt,
          ...dimensions,
          ...(block.src === "novik_v7_assets/05_AK2512_фронт.jpg" || block.src === "novik_v7_assets/05_SW-6025.jpg"
            ? { displaySize: "compact" as const }
            : {}),
        };
      }),
    };
  });
}

function renderImage(image: History2Image, index: number) {
  const alt = escapeHtml(image.alt);
  const firstImageAttributes =
    index === 0
      ? ' width="1500" height="1219" style="width:100%;height:auto;max-height:none;object-fit:contain"'
      : "";
  const aria = index === 0 ? "Увеличить изображение" : `Увеличить: ${image.alt}`;
  return `<figure class="photo"><button class="zoom" type="button" aria-label="${escapeHtml(aria)}"><img src="${publicImagePath(image.src)}" alt="${alt}" loading="lazy"${firstImageAttributes}></button></figure>`;
}

export function renderHistory2(document: History2Document) {
  let imageIndex = 0;
  const chapters = document.chapters
    .map((chapter) => {
      const blocks = chapter.blocks
        .map((block) => {
          if (block.type === "paragraph") return `<p>${escapeHtml(block.text)}</p>`;
          return renderImage(block, imageIndex++);
        })
        .join("");
      return `<h3>${escapeHtml(chapter.title)}</h3>${blocks}`;
    })
    .join("");
  const notes = document.notes.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("");

  return `<!doctype html><html lang="ru"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>История 2.0 — Развёрнутый</title><style>*{box-sizing:border-box}body{margin:0;background:#eeece6;color:#252822;font:20px/1.75 Georgia,serif}main{max-width:960px;margin:32px auto;padding:55px 65px;background:#fffefb}h1{font-size:46px;line-height:1.1}h2{font-size:27px;line-height:1.35;font-weight:normal}h3{font-size:28px;line-height:1.35;margin:56px 0 22px}p{margin:0 0 24px}figure{margin:32px 0}figure img{max-width:100%;max-height:560px;width:auto;height:auto;display:block;margin:auto}.sheet img{max-height:none;width:100%}.zoom{display:block;border:0;background:transparent;cursor:zoom-in;width:100%;padding:0}figcaption{font:14px/1.5 Arial,sans-serif;color:#656a62;margin:12px auto;max-width:700px}.rf-pair{border:1px solid #ddd;padding:24px;margin:32px 0}.rf-pair figure{margin:0 0 20px}.rf-pair figure:last-child{margin-bottom:0}details{font:16px/1.65 Arial,sans-serif;border-top:1px solid #ccc;margin-top:65px;padding-top:24px}summary{cursor:pointer;font-weight:bold}details h2{font-size:24px}.tools{font:14px/1.5 Arial,sans-serif;margin:0 0 28px}.tools a{color:#385947}dialog{border:0;padding:24px;width:95vw;max-width:1500px;max-height:95vh;background:#fff}dialog::backdrop{background:#000b}dialog img{max-width:100%;display:block;margin:auto}dialog button{position:sticky;top:0;float:right;padding:10px 15px;font-size:16px;cursor:pointer}.dialog-caption{font:16px/1.5 Arial} @media(max-width:700px){main{margin:0;padding:28px 22px}body{font-size:18px}h1{font-size:36px}h3{font-size:25px}.rf-pair{padding:12px}}@media print{body{background:white}main{margin:0;padding:0}figure{break-inside:avoid}h3{break-after:avoid}.tools,details{display:none}}</style><main><nav class="tools"><a href="История_2_0_три_варианта.html">← Сравнение вариантов</a> · <a href="История_2_0_minimal.html">Минимальный</a> · <a href="История_2_0_medium.html">Средний</a> · <a href="История_2_0_maximum.html" aria-current="page">Развёрнутый</a></nav><h1>${escapeHtml(document.title)}</h1><h2>${escapeHtml(document.subtitle)}</h2><p><em>${escapeHtml(document.deck)}</em></p>${chapters}<details><summary>Редакторская сверка и источники</summary><p><a href="Карта_материалов_История_NOVIK.html">Карта 58 найденных материалов</a></p><hr><h2>${escapeHtml(document.notesTitle)}</h2>${notes}</details></main><dialog id="imageViewer"><button type="button" id="closeImage">Закрыть ×</button><p class="dialog-caption"></p><img alt=""></dialog><script>const d=document.getElementById("imageViewer");document.querySelectorAll(".zoom").forEach(b=>b.addEventListener("click",()=>{const i=b.querySelector("img");d.querySelector("img").src=i.src;d.querySelector("img").alt=i.alt;d.querySelector("p").textContent="";d.showModal()}));document.getElementById("closeImage").onclick=()=>d.close();d.addEventListener("click",e=>{if(e.target===d)d.close()});</script></html>`;
}
