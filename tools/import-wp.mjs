// Convierte la exportación de WordPress (.xml) en artículos Markdown por idioma.
// Uso: node tools/import-wp.mjs ruta/al/export.xml
import fs from 'node:fs';
import path from 'node:path';
import { XMLParser } from 'fast-xml-parser';
import TurndownService from 'turndown';

const file = process.argv[2];
const xml = fs.readFileSync(file, 'utf8');
const parser = new XMLParser({ ignoreAttributes: false, cdataPropName: false, textNodeName: '#text' });
const items = [].concat(parser.parse(xml).rss.channel.item);
const txt = (v) => (v == null ? '' : typeof v === 'object' ? (v['#text'] ?? '') : String(v));

const meta = (it, key) => {
  const m = [].concat(it['wp:postmeta'] || []).find((x) => txt(x['wp:meta_key']) === key);
  return m ? txt(m['wp:meta_value']) : '';
};
const attachments = new Map();
for (const it of items) if (txt(it['wp:post_type']) === 'attachment') attachments.set(txt(it['wp:post_id']), txt(it['wp:attachment_url']));

// Grupos de traducción ya publicados como entradas separadas
const groups = {
  'que-es-primero-la-enfermedad-o-la-adiccion': 'enfermedad-o-adiccion',
  '__trashed-2': 'enfermedad-o-adiccion',
  'pathologie-duale-quest-ce-qui-vient-en-premier-la-maladie-ou-laddiction': 'enfermedad-o-adiccion',
  'y-si-la-ia-sabe-mas-de-tu-hijo-que-tu': 'ia-y-tu-hijo',
  'what-if-ai-knows-more-about-your-child-than-you-do': 'ia-y-tu-hijo',
  'et-si-lia-connaissait-mieux-votre-enfant-que-vous': 'ia-y-tu-hijo',
  'cuando-la-adiccion-lleva-tacones': 'adiccion-con-tacones',
  'when-addiction-wears-heels': 'adiccion-con-tacones',
  'quand-laddiction-porte-des-talons': 'adiccion-con-tacones',
};
const slugFix = { '__trashed': 'violacion-y-tecnologias', '__trashed-2': 'what-comes-first-illness-or-addiction' };

const stop = {
  es: ['que', 'de', 'los', 'las', 'el', 'la', 'por', 'con', 'una', 'para', 'es', 'del', 'se', 'no', 'su', 'como', 'pero', 'más'],
  en: ['the', 'and', 'of', 'to', 'is', 'in', 'that', 'they', 'with', 'for', 'are', 'this', 'it', 'you', 'their', 'not', 'but', 'what'],
  fr: ['le', 'les', 'des', 'et', 'est', 'une', 'pour', 'pas', 'dans', 'qui', 'ce', 'sur', 'vous', 'du', 'au', 'mais', 'leur', 'avec'],
};
const detect = (html) => {
  const words = html.replace(/<[^>]+>/g, ' ').toLowerCase().match(/[a-záéíóúñüàèêçâîôû']+/g) || [];
  const score = Object.fromEntries(Object.entries(stop).map(([l, s]) => [l, words.filter((w) => s.includes(w)).length]));
  return Object.entries(score).sort((a, b) => b[1] - a[1])[0][0];
};

const td = new TurndownService({ headingStyle: 'atx', bulletListMarker: '-', emDelimiter: '*' });
td.keep(['audio', 'video', 'iframe']);
const toMd = (html) => {
  html = html
    .replace(/<!--more-->/g, '')
    .replace(/\[audio (?:mp3|m4a|wav)="([^"]+)"\]\[\/audio\]/g, '<audio controls preload="none" src="$1"></audio>')
    .replace(/\[embed\](.*?)\[\/embed\]/g, '<a href="$1">$1</a>')
    .replace(/\[caption[^\]]*\](.*?)\[\/caption\]/gs, '$1');
  html = html.split(/\n{2,}/).map((p) => (/^\s*</.test(p) ? p : `<p>${p.replace(/\n/g, '<br>')}</p>`)).join('\n');
  return td.turndown(html).replace(/\n{3,}/g, '\n\n').trim();
};
const firstAudio = (html) => (html.match(/(?:mp3|m4a|wav)="([^"]+)"/) || [])[1] || '';
const yaml = (s) => JSON.stringify(s);

const outDir = path.resolve('src/content/articulos');
for (const l of ['es', 'en', 'fr']) fs.mkdirSync(path.join(outDir, l), { recursive: true });
const report = [];

for (const it of items) {
  if (txt(it['wp:post_type']) !== 'post' || txt(it['wp:status']) !== 'publish') continue;
  const wpSlug = txt(it['wp:post_name']);
  const slug = slugFix[wpSlug] || wpSlug;
  const html = txt(it['content:encoded']);
  const date = txt(it['wp:post_date']).slice(0, 10);
  const cats = [].concat(it.category || []).filter((c) => c['@_domain'] === 'category').map(txt).filter((c) => !/uncategorized|sin categor/i.test(c));
  const image = attachments.get(meta(it, '_thumbnail_id')) || '';
  const title = txt(it.title);
  const key = groups[wpSlug] || slug;
  const description = meta(it, '_yoast_wpseo_metadesc');

  // Separar artículos con varias lenguas en el mismo texto (divididos por <hr />)
  const parts = html.split(/<hr\s*\/?>/i);
  const byLang = {};
  let last = null;
  for (const p of parts) {
    const words = p.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).length;
    const l = words < 60 && last ? last : detect(p);
    byLang[l] = (byLang[l] || '') + (byLang[l] ? '\n<hr />\n' : '') + p;
    last = l;
  }
  const langs = Object.keys(byLang);
  const mainLang = groups[wpSlug] ? detect(html) : 'es';
  const split = !groups[wpSlug] && langs.length > 1;
  // Títulos bilingües "ES - EN" o "ES / EN"
  const titleParts = title.split(/\s+[-–\/]\s*|\s*\/\s*/).map((s) => s.replace(/^-|-$/g, '').trim()).filter(Boolean);

  for (const l of split ? langs : [mainLang]) {
    const body = split ? byLang[l] : html;
    let t = title;
    if (split && titleParts.length >= 2) t = l === 'es' ? titleParts[0] : titleParts.find((x, i) => i > 0 && detect(x) === l) || titleParts[titleParts.length - 1];
    const fm = [
      '---',
      `title: ${yaml(t)}`,
      `date: ${date}`,
      `key: ${yaml(key)}`,
      `categories: ${yaml(cats)}`,
      image ? `image: ${yaml(image)}` : null,
      firstAudio(body) ? `audio: ${yaml(firstAudio(body))}` : null,
      description && l === 'es' ? `description: ${yaml(description)}` : null,
      split && l !== 'es' ? 'review: true' : null,
      '---',
    ].filter(Boolean).join('\n');
    const md = toMd(body.replace(/\[audio [^\]]+\]\[\/audio\]/, '')); // el primer audio va en la cabecera
    const name = l === mainLang || !split ? slug : `${slug}`;
    fs.writeFileSync(path.join(outDir, l, `${name}.md`), `${fm}\n\n${md}\n`);
    report.push(`${l}\t${date}\t${name}`);
  }
}
const counts = report.reduce((a, r) => ((a[r.split('\t')[0]] = (a[r.split('\t')[0]] || 0) + 1), a), {});
console.log(counts);
