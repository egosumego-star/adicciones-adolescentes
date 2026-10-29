import rss from '@astrojs/rss';
import { LANGS, T, articleSlug, niceTitle } from '../../lib/i18n';
import { articlesIn } from '../../lib/articles';

export function getStaticPaths() {
  return LANGS.map((lang) => ({ params: { lang } }));
}

// Este canal lo lee la newsletter para enviar cada artículo nuevo automáticamente
export async function GET({ params, site }) {
  const lang = params.lang;
  const posts = (await articlesIn(lang)).slice(0, 20);
  return rss({
    title: T[lang].siteName,
    description: T[lang].tagline,
    site,
    customData: `<language>${lang}</language>`,
    items: posts.map((p) => ({
      title: niceTitle(p.data.title),
      pubDate: p.data.date,
      description: p.data.description ?? '',
      link: `/${lang}/${articleSlug(p.id)}/`,
      enclosure: p.data.image ? { url: p.data.image, length: 0, type: 'image/jpeg' } : undefined,
    })),
  });
}
