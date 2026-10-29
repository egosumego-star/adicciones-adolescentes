import { getCollection, type CollectionEntry } from 'astro:content';
import { LANGS, articleLang, type Lang } from './i18n';

export type Article = CollectionEntry<'articulos'>;

export async function allArticles() {
  const list = await getCollection('articulos', (a) => !a.data.draft);
  return list.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export async function articlesIn(lang: Lang) {
  return (await allArticles()).filter((a) => articleLang(a.id) === lang);
}

// Para cada idioma, la versión del mismo artículo (mismo «key»), si existe
export async function translationsOf(article: Article) {
  const all = await allArticles();
  const out: Partial<Record<Lang, Article>> = {};
  for (const l of LANGS) {
    const t = all.find((a) => a.data.key === article.data.key && articleLang(a.id) === l);
    if (t) out[l] = t;
  }
  return out;
}
