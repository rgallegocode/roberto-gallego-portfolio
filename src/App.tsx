import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'

type Language = 'en' | 'es' | 'de'
type Suit = 'spades' | 'hearts' | 'diamonds' | 'clubs'
const sectionIds = ['about', 'projects', 'skills', 'journey', 'contact'] as const

type Project = {
  name: string
  suit: Suit
  eyebrow: string
  description: string
  detail: string
  stack: string[]
  href: string
}

const suits: Record<Suit, string> = {
  spades: '♠',
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
}

const cvFiles: Record<Language, string> = {
  en: 'cv-en.pdf',
  es: 'cv-es.pdf',
  de: 'cv-de.pdf',
}

const assetPath = (file: string) => `${import.meta.env.BASE_URL}${file}`

const copy = {
  en: {
    nav: ['About', 'Projects', 'Skills', 'Journey', 'Contact'],
    language: 'Language',
    progressLabel: 'Page reading progress',
    scrollNote: 'Scroll to explore',
    kicker: 'Software engineering student · Málaga, Spain',
    title: 'Versatility is the wild card\nthat completes any hand.',
    intro: 'I build useful things across backend systems, automation, distributed technologies and the spaces in between.',
    cta: 'Deal me in',
    contact: 'Let’s talk',
    aboutLabel: '01 / The player',
    aboutTitle: 'Curious by default.',
    aboutText: 'I am a Software Engineering student who enjoys understanding the whole table: from Java and Spring services to the infrastructure, tests and workflows that make them dependable.',
    aboutNote: 'Not specialised yet. Deliberately versatile.',
    projectsLabel: '02 / The hand',
    projectsTitle: 'A few cards I have played.',
    skillsLabel: '03 / The deck',
    skillsTitle: 'Tools I reach for.',
    spokenLanguages: 'Spoken languages · Spanish native · English C1',
    journeyLabel: '04 / The long game',
    journeyTitle: 'Still in motion.',
    contactLabel: '05 / The table is open',
    contactTitle: 'Let’s make the next move.',
    contactText: 'Have a project, an opportunity or an interesting problem? The fastest way to reach me is by email.',
    indexLabel: 'Table index',
    degree: 'BSc in Software Engineering',
    university: 'University of Málaga · 2023–2027 expected',
    training: 'University Extension in Blockchain Technologies · 490h',
    trainingDetail: 'Distributed systems, Solidity, smart contracts, Daml, Canton and decentralised infrastructure.',
    dekraRole: 'AI Intern · DEKRA',
    dekraDates: 'September 2026 – March 2027',
    dekraDetail: 'Internship in the Artificial Intelligence department, working on practical solutions with AI.',
    viewGithub: 'View on GitHub',
    cvView: 'View CV',
    cvDownload: 'Download CV',
    profileAlt: 'Portrait of Roberto Gallego Barbarán',
    email: 'Email me',
    footer: 'Built with React, curiosity and a good hand of cards.',
  },
  es: {
    nav: ['Sobre mí', 'Proyectos', 'Habilidades', 'Trayectoria', 'Contacto'],
    language: 'Idioma',
    progressLabel: 'Progreso de lectura de la página',
    scrollNote: 'Desliza para explorar',
    kicker: 'Estudiante de ingeniería del software · Málaga, España',
    title: 'La versatilidad es el comodín\nque completa cualquier jugada.',
    intro: 'Construyo cosas útiles entre backend, automatización, tecnologías distribuidas y todo lo que queda en medio.',
    cta: 'Repartir cartas',
    contact: 'Hablemos',
    aboutLabel: '01 / El jugador',
    aboutTitle: 'Curiosidad por defecto.',
    aboutText: 'Soy estudiante de Ingeniería del Software y me gusta entender toda la mesa: desde servicios Java y Spring hasta la infraestructura, las pruebas y los flujos que los hacen fiables.',
    aboutNote: 'Aún no especializado. Versátil a propósito.',
    projectsLabel: '02 / La mano',
    projectsTitle: 'Algunas cartas que he jugado.',
    skillsLabel: '03 / La baraja',
    skillsTitle: 'Herramientas a las que recurro.',
    spokenLanguages: 'Idiomas · Español nativo · Inglés C1',
    journeyLabel: '04 / La partida larga',
    journeyTitle: 'Todavía en movimiento.',
    contactLabel: '05 / La mesa está abierta',
    contactTitle: 'Hagamos la siguiente jugada.',
    contactText: '¿Tienes un proyecto, una oportunidad o un problema interesante? La forma más rápida de contactarme es por email.',
    indexLabel: 'Índice de mesa',
    degree: 'Grado en Ingeniería del Software',
    university: 'Universidad de Málaga · 2023–2027 previsto',
    training: 'Extensión Universitaria en Tecnologías Blockchain · 490h',
    trainingDetail: 'Sistemas distribuidos, Solidity, smart contracts, Daml, Canton e infraestructura descentralizada.',
    dekraRole: 'Prácticas en IA · DEKRA',
    dekraDates: 'Septiembre 2026 – Marzo 2027',
    dekraDetail: 'Prácticas en el departamento de Inteligencia Artificial, trabajando en soluciones aplicadas con IA.',
    viewGithub: 'Ver en GitHub',
    cvView: 'Ver CV',
    cvDownload: 'Descargar CV',
    profileAlt: 'Foto de perfil de Roberto Gallego Barbarán',
    email: 'Escríbeme',
    footer: 'Construido con React, curiosidad y una buena mano de cartas.',
  },
  de: {
    nav: ['Über mich', 'Projekte', 'Fähigkeiten', 'Werdegang', 'Kontakt'],
    language: 'Sprache',
    progressLabel: 'Lesefortschritt der Seite',
    scrollNote: 'Scrollen zum Entdecken',
    kicker: 'Softwaretechnik-Student · Málaga, Spanien',
    title: 'Vielseitigkeit ist der Joker,\nder jedes Blatt vervollständigt.',
    intro: 'Ich entwickle nützliche Lösungen zwischen Backend-Systemen, Automatisierung, verteilten Technologien und allem dazwischen.',
    cta: 'Karten austeilen',
    contact: 'Kontakt aufnehmen',
    aboutLabel: '01 / Der Spieler',
    aboutTitle: 'Neugier als Ausgangspunkt.',
    aboutText: 'Ich studiere Softwaretechnik und möchte den ganzen Tisch verstehen: von Java- und Spring-Services bis zu Infrastruktur, Tests und Workflows, die sie zuverlässig machen.',
    aboutNote: 'Noch nicht spezialisiert. Bewusst vielseitig.',
    projectsLabel: '02 / Die Hand',
    projectsTitle: 'Einige gespielte Karten.',
    skillsLabel: '03 / Das Deck',
    skillsTitle: 'Werkzeuge, die ich einsetze.',
    spokenLanguages: 'Sprachen · Spanisch (Muttersprache) · Englisch C1',
    journeyLabel: '04 / Das lange Spiel',
    journeyTitle: 'Noch in Bewegung.',
    contactLabel: '05 / Der Tisch ist offen',
    contactTitle: 'Machen wir den nächsten Zug.',
    contactText: 'Du hast ein Projekt, eine Gelegenheit oder ein interessantes Problem? Am schnellsten erreichst du mich per E-Mail.',
    indexLabel: 'Tischindex',
    degree: 'Bachelor Softwaretechnik',
    university: 'Universität Málaga · 2023–2027 voraussichtlich',
    training: 'Universitäre Weiterbildung in Blockchain-Technologien · 490h',
    trainingDetail: 'Verteilte Systeme, Solidity, Smart Contracts, Daml, Canton und dezentrale Infrastruktur.',
    dekraRole: 'KI-Praktikum · DEKRA',
    dekraDates: 'September 2026 – März 2027',
    dekraDetail: 'Praktikum in der Abteilung für Künstliche Intelligenz mit Fokus auf praxisnahe KI-Lösungen.',
    viewGithub: 'Auf GitHub ansehen',
    cvView: 'CV ansehen',
    cvDownload: 'CV herunterladen',
    profileAlt: 'Profilfoto von Roberto Gallego Barbarán',
    email: 'E-Mail schreiben',
    footer: 'Gebaut mit React, Neugier und einer guten Kartenhand.',
  },
} as const

const projects: Record<Language, Project[]> = {
  en: [
    { name: 'Bancosol Campaigns', suit: 'hearts', eyebrow: 'Team web application', description: 'A food-collection campaign platform with a role-aware Captain module.', detail: 'Layered Spring MVC architecture with authenticated-user filtering, JWT access control and MariaDB persistence.', stack: ['Java 17', 'Spring Boot', 'JPA', 'JWT'], href: 'https://github.com/rgallegocode/Bancosol' },
    { name: 'Canton Daml IOBuilders UMA', suit: 'diamonds', eyebrow: 'Distributed systems', description: 'A local tokenised bond platform running across a Dockerised Canton network.', detail: 'Go API, Daml contracts, gRPC ledger integration and Playwright tests for issuance, transfers and burns.', stack: ['Go', 'Daml', 'Canton', 'Docker'], href: 'https://github.com/JavierStark/Project-CantonDaml-IoBuilders-UMA' },
    { name: 'Cava Bot', suit: 'clubs', eyebrow: 'Personal automation', description: 'A daily Telegram financial briefing assembled from news, markets and an LLM.', detail: 'A serverless-style scheduled pipeline using external APIs, Gemini and GitHub Actions secrets.', stack: ['Python', 'Gemini API', 'GitHub Actions'], href: 'https://github.com/rgallegocode/cava-bot' },
  ],
  es: [
    { name: 'Bancosol Campañas', suit: 'hearts', eyebrow: 'Aplicación web en equipo', description: 'Plataforma de campañas de recogida de alimentos con un módulo específico para capitanes.', detail: 'Arquitectura Spring MVC por capas, filtrado por usuario autenticado, control JWT y persistencia MariaDB.', stack: ['Java 17', 'Spring Boot', 'JPA', 'JWT'], href: 'https://github.com/rgallegocode/Bancosol' },
    { name: 'Canton Daml IOBuilders UMA', suit: 'diamonds', eyebrow: 'Sistemas distribuidos', description: 'Plataforma local de bonos tokenizados sobre una red Canton dockerizada.', detail: 'API en Go, contratos Daml, integración gRPC con el ledger y pruebas Playwright.', stack: ['Go', 'Daml', 'Canton', 'Docker'], href: 'https://github.com/JavierStark/Project-CantonDaml-IoBuilders-UMA' },
    { name: 'Cava Bot', suit: 'clubs', eyebrow: 'Automatización personal', description: 'Boletín financiero diario para Telegram combinando noticias, mercados y un LLM.', detail: 'Pipeline programado sin servidor dedicado usando APIs externas, Gemini y GitHub Actions.', stack: ['Python', 'Gemini API', 'GitHub Actions'], href: 'https://github.com/rgallegocode/cava-bot' },
  ],
  de: [
    { name: 'Bancosol Campañas', suit: 'hearts', eyebrow: 'Team-Webanwendung', description: 'Plattform für Lebensmittel-Sammelaktionen mit einem rollenbasierten Kapitänsmodul.', detail: 'Schichtenarchitektur mit Spring MVC, Benutzerfilterung, JWT-Zugriffskontrolle und MariaDB.', stack: ['Java 17', 'Spring Boot', 'JPA', 'JWT'], href: 'https://github.com/rgallegocode/Bancosol' },
    { name: 'Canton Daml IOBuilders UMA', suit: 'diamonds', eyebrow: 'Verteilte Systeme', description: 'Lokale Plattform für tokenisierte Anleihen auf einem dockerisierten Canton-Netzwerk.', detail: 'Go-API, Daml-Verträge, gRPC-Ledger-Integration und Playwright-Tests.', stack: ['Go', 'Daml', 'Canton', 'Docker'], href: 'https://github.com/JavierStark/Project-CantonDaml-IoBuilders-UMA' },
    { name: 'Cava Bot', suit: 'clubs', eyebrow: 'Persönliche Automatisierung', description: 'Tägliches Finanzbriefing für Telegram aus Nachrichten, Marktdaten und einem LLM.', detail: 'Zeitgesteuerte Pipeline ohne eigenen Server mit externen APIs, Gemini und GitHub Actions.', stack: ['Python', 'Gemini API', 'GitHub Actions'], href: 'https://github.com/rgallegocode/cava-bot' },
  ],
}

const skills: Record<Language, { suit: Suit; title: string; items: string }[]> = {
  en: [
    { suit: 'spades', title: 'Backend', items: 'Java · Spring Boot · JPA · REST · SQL' },
    { suit: 'diamonds', title: 'Infrastructure', items: 'Docker · Linux · CI/CD · Nginx · Terraform' },
    { suit: 'clubs', title: 'Languages', items: 'Go · Python · JavaScript · C/C++ · Git' },
    { suit: 'hearts', title: 'Quality & systems', items: 'JUnit · Mockito · Playwright · gRPC · Distributed systems' },
  ],
  es: [
    { suit: 'spades', title: 'Backend', items: 'Java · Spring Boot · JPA · REST · SQL' },
    { suit: 'diamonds', title: 'Infraestructura', items: 'Docker · Linux · CI/CD · Nginx · Terraform' },
    { suit: 'clubs', title: 'Lenguajes', items: 'Go · Python · JavaScript · C/C++ · Git' },
    { suit: 'hearts', title: 'Calidad y sistemas', items: 'JUnit · Mockito · Playwright · gRPC · Sistemas distribuidos' },
  ],
  de: [
    { suit: 'spades', title: 'Backend', items: 'Java · Spring Boot · JPA · REST · SQL' },
    { suit: 'diamonds', title: 'Infrastruktur', items: 'Docker · Linux · CI/CD · Nginx · Terraform' },
    { suit: 'clubs', title: 'Programmiersprachen', items: 'Go · Python · JavaScript · C/C++ · Git' },
    { suit: 'hearts', title: 'Qualität und Systeme', items: 'JUnit · Mockito · Playwright · gRPC · Verteilte Systeme' },
  ],
}

function App() {
  const [language, setLanguage] = useState<Language>(() => {
    const stored = localStorage.getItem('portfolio-language')
    return stored === 'es' || stored === 'de' ? stored : 'en'
  })
  const [scrollProgress, setScrollProgress] = useState(0)
  const t = copy[language]

  useEffect(() => {
    localStorage.setItem('portfolio-language', language)
    document.documentElement.lang = language
    document.title = `Roberto Gallego Barbarán | ${language === 'en' ? 'Portfolio' : language === 'es' ? 'Portfolio' : 'Portfolio'}`
  }, [language])

  useEffect(() => {
    let frame = 0
    const updateProgress = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight
        setScrollProgress(scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0)
      })
    }

    updateProgress()
    window.addEventListener('scroll', updateProgress, { passive: true })
    window.addEventListener('resize', updateProgress)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', updateProgress)
      window.removeEventListener('resize', updateProgress)
    }
  }, [])

  const scrollTo = (id: string) => {
    const target = document.getElementById(id)
    if (!target) return

    const headerHeight = document.querySelector('.topbar')?.getBoundingClientRect().height ?? 88
    const visualStart = target.querySelector('.section-heading') ?? target
    const targetTop = visualStart.getBoundingClientRect().top + window.scrollY - headerHeight - 24
    window.scrollTo({ top: Math.max(0, targetTop), behavior: 'smooth' })
  }

  return (
    <div className="site-shell">
      <div className="grain" aria-hidden="true" />
      <a className="skip-link" href="#top">Skip to content</a>
      <header className="topbar">
        <div className="scroll-progress" role="progressbar" aria-label={t.progressLabel} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(scrollProgress)} style={{ transform: `scaleX(${scrollProgress / 100})` }} />
         <a className="brand-lockup" href="#top" aria-label="Roberto Gallego Barbarán, home"><span className="brand-card" aria-hidden="true"><b>♠</b><b>♥</b><b>♦</b><b>♣</b></span><span className="brand-name">Roberto Gallego Barbarán</span></a>
        <nav aria-label="Main navigation">
          {t.nav.map((label, index) => <button key={label} onClick={() => scrollTo(sectionIds[index])}>{label}</button>)}
        </nav>
        <div className="language-switcher" aria-label={t.language}>
          {(['en', 'es', 'de'] as Language[]).map((code) => <button className={language === code ? 'selected' : ''} key={code} onClick={() => setLanguage(code)} aria-pressed={language === code}>{code.toUpperCase()}</button>)}
        </div>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">{t.kicker}</p>
            <h1 id="hero-title">{t.title.split('\n').map((line) => <span key={line}>{line}</span>)}</h1>
            <p className="hero-intro">{t.intro}</p>
            <div className="hero-actions"><button className="primary-button" onClick={() => scrollTo('projects')}>{t.cta} <span aria-hidden="true">→</span></button><a className="text-link" href="mailto:robertogallego004@gmail.com">{t.contact} <span aria-hidden="true">↗</span></a></div>
            <div className="cv-actions"><a className="cv-link" href={assetPath(cvFiles[language])} target="_blank" rel="noreferrer">{t.cvView} <span aria-hidden="true">↗</span></a><a className="cv-link cv-download" href={assetPath(cvFiles[language])} download>{t.cvDownload} <span aria-hidden="true">↓</span></a></div>
          </div>
          <div className="hero-card-wrap" aria-label="Playing card illustration">
            <div className="hero-card back-card" aria-hidden="true"><span>R</span></div>
            <div className="hero-card ace-card"><span className="card-corner">A<br /><b>♠</b></span><span className="ace-symbol" aria-hidden="true">♠</span><span className="card-corner bottom">A<br /><b>♠</b></span></div>
            <div className="profile-card"><span className="profile-suit suit-top-left" aria-hidden="true">♠</span><span className="profile-suit suit-top-right" aria-hidden="true">♥</span><div className="profile-photo-fallback" aria-hidden="true">RG</div><img src={assetPath('profile-photo.jpg')} alt={t.profileAlt} onError={(event) => { event.currentTarget.style.display = 'none' }} /><span className="profile-suit suit-bottom-left" aria-hidden="true">♣</span><span className="profile-suit suit-bottom-right" aria-hidden="true">♦</span></div>
          </div>
          <div className="scroll-note" aria-hidden="true"><span /> {t.scrollNote}</div>
        </section>

        <section className="section about-section" id="about" aria-labelledby="about-title">
          <div className="section-heading"><p className="section-label">{t.aboutLabel}</p><h2 id="about-title">{t.aboutTitle}</h2></div>
          <div className="about-grid"><p className="large-copy">{t.aboutText}</p><aside className="quote-card"><span className="quote-mark">“</span><p>{t.aboutNote}</p><span className="quote-suit">♣</span></aside></div>
        </section>

        <section className="section" id="projects" aria-labelledby="projects-title">
          <div className="section-heading"><p className="section-label">{t.projectsLabel}</p><h2 id="projects-title">{t.projectsTitle}</h2></div>
          <div className="project-grid">{projects[language].map((project, index) => <ProjectCard key={project.name} project={project} index={index} label={t.viewGithub} />)}</div>
        </section>

        <section className="section skills-section" id="skills" aria-labelledby="skills-title">
          <div className="section-heading"><p className="section-label">{t.skillsLabel}</p><h2 id="skills-title">{t.skillsTitle}</h2></div>
          <div className="skills-grid">{skills[language].map((skill) => <article className="skill-card" key={skill.title}><span className={`suit suit-${skill.suit}`} aria-hidden="true">{suits[skill.suit]}</span><span className="skill-title">{skill.title}</span><span className="skill-items">{skill.items}</span></article>)}</div><p className="spoken-languages">{t.spokenLanguages}</p>
        </section>

        <section className="section journey-section" id="journey" aria-labelledby="journey-title">
          <div className="section-heading"><p className="section-label">{t.journeyLabel}</p><h2 id="journey-title">{t.journeyTitle}</h2></div>
          <div className="timeline"><TimelineCard suit="hearts" title={t.dekraRole} detail={`${t.dekraDates} · ${t.dekraDetail}`} logo /><TimelineCard suit="spades" title={t.degree} detail={t.university} /><TimelineCard suit="diamonds" title={t.training} detail={t.trainingDetail} /></div>
        </section>

        <section className="section contact-section" id="contact" aria-labelledby="contact-title">
          <div className="section-heading"><p className="section-label">{t.contactLabel}</p><h2 id="contact-title">{t.contactTitle}</h2></div>
          <div className="contact-card"><div className="contact-copy"><p>{t.contactText}</p><a className="contact-email" href="mailto:robertogallego004@gmail.com">robertogallego004@gmail.com <span aria-hidden="true">↗</span></a></div><div className="contact-details"><span className="contact-suit" aria-hidden="true">♥</span><div className="contact-links"><a className="contact-social-link" href="https://github.com/rgallegocode" target="_blank" rel="noreferrer"><SocialIcon kind="github" /><span>GitHub</span><b aria-hidden="true">↗</b></a><a className="contact-social-link" href="https://www.linkedin.com/in/roberto-gallego-barbar%C3%A1n-5508b329b/" target="_blank" rel="noreferrer"><SocialIcon kind="linkedin" /><span>LinkedIn</span><b aria-hidden="true">↗</b></a></div></div></div>
        </section>
      </main>

      <footer className="footer"><div><span className="footer-suit">♥</span><span>{t.footer}</span></div><div className="footer-links"><a href="https://github.com/rgallegocode" target="_blank" rel="noreferrer">GitHub ↗</a><a href="https://www.linkedin.com/in/roberto-gallego-barbar%C3%A1n-5508b329b/" target="_blank" rel="noreferrer">LinkedIn ↗</a><a href="mailto:robertogallego004@gmail.com">{t.email} ↗</a></div></footer>
    </div>
  )
}

function ProjectCard({ project, index, label }: { project: Project; index: number; label: string }) {
  return <article className={`project-card suit-${project.suit}`} style={{ '--delay': `${index * 100}ms` } as CSSProperties}><div className="card-topline"><span className="project-index">0{index + 1}</span><span className="project-suit" aria-hidden="true">{suits[project.suit]}</span></div><p className="card-eyebrow">{project.eyebrow}</p><h3>{project.name}</h3><p className="project-description">{project.description}</p><p className="project-detail">{project.detail}</p><div className="project-bottom"><div className="stack">{project.stack.map((item) => <span key={item}>{item}</span>)}</div><a href={project.href} target="_blank" rel="noreferrer" aria-label={`${label}: ${project.name}`}>↗</a></div></article>
}

function SocialIcon({ kind }: { kind: 'github' | 'linkedin' }) {
  if (kind === 'github') {
    return <svg className="social-icon" viewBox="0 0 16 16" aria-hidden="true"><path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" /></svg>
  }

  return <svg className="social-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4.98 3.5A2.5 2.5 0 1 1 0 3.5a2.5 2.5 0 0 1 4.98 0ZM.24 8.25h4.48V24H.24V8.25ZM7.34 8.25h4.29v2.15h.06c.6-1.13 2.06-2.33 4.24-2.33 4.53 0 5.37 2.98 5.37 6.86V24h-4.47v-8.04c0-1.92-.04-4.39-2.68-4.39-2.69 0-3.1 2.1-3.1 4.25V24H7.34V8.25Z" transform="translate(2.5 0) scale(.8)" /></svg>
}

function TimelineCard({ suit, title, detail, logo = false }: { suit: Suit; title: string; detail: string; logo?: boolean }) {
  return <article className={`timeline-card${logo ? ' timeline-card-featured' : ''}`}><div className="timeline-marker">{logo ? <img src={assetPath('dekra-logo.jpg')} alt="DEKRA" /> : <span className={`timeline-suit suit-${suit}`} aria-hidden="true">{suits[suit]}</span>}</div><div><h3>{title}</h3><p>{detail}</p></div></article>
}

export default App
