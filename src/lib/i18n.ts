export const LANGS = ['es', 'en', 'fr'] as const;
export type Lang = (typeof LANGS)[number];

export const T = {
  es: {
    siteName: 'Adicciones Adolescentes',
    tagline: 'Orientar a profesionales y padres sobre adicciones: alcohol, cannabis y tecnología.',
    heroA: 'Adolescentes, pantallas y sustancias:',
    heroMark: 'entender',
    heroB: 'para poder ayudar',
    heroP: 'Artículos para familias y profesionales escritos desde la consulta, con la voz del autor.',
    nav: { articles: 'Artículos', about: 'Sobre mí' },
    listen: 'Escuchar el artículo con la voz del autor',
    latest: 'Últimos artículos',
    all: 'Todos los artículos',
    read: 'Leer',
    minutes: 'min de lectura',
    subTitle: 'Recibe cada nuevo artículo',
    subText: 'Un correo cuando publico. Sin spam.',
    subButton: 'Suscribirme',
    subSoon: 'La newsletter estará disponible muy pronto.',
    readIn: 'Leer en',
    back: 'Volver a los artículos',
    category: 'Categoría',
    review: 'Traducción pendiente de revisión por el autor.',
    footer: 'Enfermero especialista en adicciones, adolescentes y familias.',
    locale: 'es-ES',
  },
  en: {
    siteName: 'Teen Addictions',
    tagline: 'Guidance for professionals and parents on addictions: alcohol, cannabis and technology.',
    heroA: 'Teens, screens and substances:',
    heroMark: 'understand',
    heroB: 'in order to help',
    heroP: 'Articles for families and professionals, written from clinical practice, in the author’s own voice.',
    nav: { articles: 'Articles', about: 'About' },
    listen: 'Listen to the article in the author’s voice (in Spanish)',
    latest: 'Latest articles',
    all: 'All articles',
    read: 'Read',
    minutes: 'min read',
    subTitle: 'Get every new article',
    subText: 'One email when I publish. No spam.',
    subButton: 'Subscribe',
    subSoon: 'The newsletter will be available very soon.',
    readIn: 'Read in',
    back: 'Back to articles',
    category: 'Category',
    review: 'Translation pending the author’s review.',
    footer: 'Nurse specialised in addictions, adolescents and families.',
    locale: 'en-GB',
  },
  fr: {
    siteName: 'Addictions Adolescents',
    tagline: 'Orienter les professionnels et les parents sur les addictions : alcool, cannabis et technologie.',
    heroA: 'Ados, écrans et substances :',
    heroMark: 'comprendre',
    heroB: 'pour pouvoir aider',
    heroP: 'Des articles pour les familles et les professionnels, écrits depuis la consultation, avec la voix de l’auteur.',
    nav: { articles: 'Articles', about: 'À propos' },
    listen: 'Écouter l’article avec la voix de l’auteur (en espagnol)',
    latest: 'Derniers articles',
    all: 'Tous les articles',
    read: 'Lire',
    minutes: 'min de lecture',
    subTitle: 'Recevez chaque nouvel article',
    subText: 'Un e-mail à chaque publication. Pas de spam.',
    subButton: 'M’abonner',
    subSoon: 'La newsletter sera bientôt disponible.',
    readIn: 'Lire en',
    back: 'Retour aux articles',
    category: 'Catégorie',
    review: 'Traduction en attente de relecture par l’auteur.',
    footer: 'Infirmier spécialisé en addictions, adolescents et familles.',
    locale: 'fr-FR',
  },
} as const;

export const LANG_NAMES = { es: 'Español', en: 'English', fr: 'Français' } as const;

// Nombres de categoría tal y como estaban en WordPress, traducidos
const CATS: Record<string, { es: string; en: string; fr: string }> = {
  padres: { es: 'Padres', en: 'Parents', fr: 'Parents' },
  educacion: { es: 'Educación', en: 'Education', fr: 'Éducation' },
  tratamiento: { es: 'Tratamiento', en: 'Treatment', fr: 'Traitement' },
  tecnologia: { es: 'Tecnología', en: 'Technology', fr: 'Technologie' },
  'salud-mental': { es: 'Salud mental', en: 'Mental health', fr: 'Santé mentale' },
  alcohol: { es: 'Alcohol', en: 'Alcohol', fr: 'Alcool' },
  sexo: { es: 'Sexo', en: 'Sex', fr: 'Sexualité' },
  delincuente: { es: 'Delincuencia', en: 'Delinquency', fr: 'Délinquance' },
  tabaco: { es: 'Tabaco', en: 'Tobacco', fr: 'Tabac' },
  'ia-inteligencia-artificial': { es: 'Inteligencia artificial', en: 'Artificial intelligence', fr: 'Intelligence artificielle' },
};
export const catSlug = (c: string) =>
  c.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
export const catName = (c: string, lang: Lang) => CATS[catSlug(c)]?.[lang] ?? c;

export const articleLang = (id: string) => id.split('/')[0] as Lang;
export const articleSlug = (id: string) => id.split('/').slice(1).join('/');

export const fmtDate = (d: Date, lang: Lang) =>
  d.toLocaleDateString(T[lang].locale, { day: 'numeric', month: 'long', year: 'numeric' });

// Muchos títulos antiguos están en MAYÚSCULAS; los mostramos en tipo frase
export const niceTitle = (t: string) => {
  const letters = t.replace(/[^A-Za-zÁÉÍÓÚÑÜÀÈÊÇ]/g, '');
  if (!letters || letters !== letters.toUpperCase()) return t;
  const lower = t.toLowerCase();
  return lower.replace(/(^|[¿¡"“«(]\s*)([a-záéíóúñü])/u, (_, a, b) => a + b.toUpperCase());
};

export const readingMinutes = (body = '') => Math.max(1, Math.round(body.split(/\s+/).length / 200));
