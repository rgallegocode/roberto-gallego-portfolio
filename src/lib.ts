import copyData from './data/copy.json'
import projectsData from './data/projects.json'
import skillsData from './data/skills.json'
import timelineData from './data/timeline.json'
import credentialsData from './data/credentials.json'
import profileData from './data/profile.json'

export type Language = 'en' | 'es' | 'de'
export type Suit = 'spades' | 'hearts' | 'diamonds' | 'clubs'

export type Project = {
  name: string
  suit: Suit
  eyebrow: string
  description: string
  detail: string
  stack: string[]
  href: string
  images: { src: string; alt: string }[]
}

export const languages: Language[] = ['en', 'es', 'de']
export const navSuits: Suit[] = ['spades', 'hearts', 'diamonds', 'clubs']

export const suitPaths: Record<Suit, string> = {
  spades: 'M12 2C8.8 5.8 3.4 9.5 3.4 14.1c0 3 2.1 4.8 4.7 4.8 1.7 0 3-.8 3.9-2.2-.3 2.2-1 3.6-2.1 4.4h4.2c-1.1-.8-1.8-2.2-2.1-4.4.9 1.4 2.2 2.2 3.9 2.2 2.6 0 4.7-1.8 4.7-4.8C20.6 9.5 15.2 5.8 12 2Z',
  hearts: 'M12 21s-8.5-5.4-8.5-11.3A4.8 4.8 0 0 1 12 6.4a4.8 4.8 0 0 1 8.5 3.3C20.5 15.6 12 21 12 21Z',
  diamonds: 'M12 2 20 12 12 22 4 12 12 2Z',
  clubs: 'M12 2.4a4.1 4.1 0 0 0-4.1 4.1c0 .6.1 1.2.3 1.7a4.1 4.1 0 1 0 2.5 7.5c-.1 3.8-.7 5.6-2.3 6.7h7.2c-1.6-1.1-2.2-2.9-2.3-6.7a4.1 4.1 0 1 0 2.5-7.5c.2-.5.3-1.1.3-1.7A4.1 4.1 0 0 0 12 2.4Z',
}

const cvFiles: Record<Language, string> = {
  en: 'cv-en.pdf',
  es: 'cv-es.pdf',
  de: 'cv-de.pdf',
}

export const assetPath = (file: string) => `${import.meta.env.BASE_URL}${file}`
export const cvHref = (language: Language) => assetPath(cvFiles[language])
export const cvDownloadName = (language: Language) => `Roberto-Gallego-CV-${language}.pdf`

// Content lives in /data/*.yaml at the repo root and is rendered into ./data/*.json by `career render`.
// Do not edit those JSON files by hand.
export const copy = copyData as Record<Language, (typeof copyData)['en']>
export const projects = projectsData as Record<Language, Project[]>
export const skills = skillsData as Record<Language, { suit: Suit; title: string; items: string }[]>
export const timeline = timelineData as Record<Language, { suit: Suit; title: string; detail: string; logo: string | null }[]>
export const credentials = credentialsData as Record<Language, {
  certifications: { name: string; issuer: string; date: string; url: string | null; suit: Suit }[]
  achievements: { title: string; description: string; date: string; url: string | null; suit: Suit }[]
}>
export const profile = profileData

const storageKey = 'portfolio-language'

export function initialLanguage(): Language {
  try {
    const stored = localStorage.getItem(storageKey)
    if (stored === 'en' || stored === 'es' || stored === 'de') return stored
  } catch {
    // storage unavailable: fall through to the browser language
  }
  const browser = typeof navigator === 'undefined' ? '' : navigator.language.slice(0, 2).toLowerCase()
  return browser === 'es' || browser === 'de' ? browser : 'en'
}

export function storeLanguage(language: Language) {
  try {
    localStorage.setItem(storageKey, language)
  } catch {
    // ignore
  }
}

/** Section labels come as "02 / La mano"; the number is recomputed from the real section order. */
export function numberedLabel(label: string, position: number) {
  return label.replace(/^\d+\s*\//, `${String(position).padStart(2, '0')} /`)
}

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Accessibility-only chrome strings that are not part of the generated content JSON. */
export const uiStrings: Record<Language, { skip: string; menu: string; mainNav: string; home: string; tableNav: string }> = {
  en: { skip: 'Skip to content', menu: 'Open menu', mainNav: 'Main navigation', home: 'Roberto Gallego Barbarán, back to top', tableNav: 'Section index' },
  es: { skip: 'Saltar al contenido', menu: 'Abrir menú', mainNav: 'Navegación principal', home: 'Roberto Gallego Barbarán, volver arriba', tableNav: 'Índice de secciones' },
  de: { skip: 'Zum Inhalt springen', menu: 'Menü öffnen', mainNav: 'Hauptnavigation', home: 'Roberto Gallego Barbarán, nach oben', tableNav: 'Abschnittsindex' },
}
