import { useCallback, useEffect, useRef, useState } from 'react'
import {
  copy, credentials, featuredFirst, initialLanguage, numberedLabel, prefersReducedMotion, profile, projects, skills, storeLanguage, timeline, uiStrings,
} from './lib'
import type { Language } from './lib'
import { useActiveSection, useReveal } from './hooks'
import { Topbar } from './components/Topbar'
import type { NavItem } from './components/Topbar'
import { Hero } from './components/Hero'
import { ProjectCard, SkillCard, TimelineCard } from './components/Cards'
import { SocialIcon, SuitIcon } from './components/SuitIcon'
import { cvDownloadName, cvHref } from './lib'

function App() {
  const [language, setLanguage] = useState<Language>(initialLanguage)
  const [isCompactHeader, setIsCompactHeader] = useState(false)
  const progressRef = useRef<HTMLDivElement>(null)
  const t = copy[language]
  const ui = uiStrings[language]
  const cred = credentials[language]
  const hasCredentials = cred.certifications.length + cred.achievements.length > 0

  const sectionIds = hasCredentials
    ? ['about', 'projects', 'skills', 'journey', 'credentials', 'contact']
    : ['about', 'projects', 'skills', 'journey', 'contact']
  const navLabels = hasCredentials ? [...t.nav.slice(0, 4), t.navCredentials, t.nav[4]] : t.nav
  const navItems: NavItem[] = sectionIds.map((id, index) => ({ id, label: navLabels[index] }))
  const label = (id: string, raw: string) => numberedLabel(raw, sectionIds.indexOf(id) + 1)
  const activeId = useActiveSection(sectionIds)

  useEffect(() => {
    storeLanguage(language)
    document.documentElement.lang = language
    document.title = `Roberto Gallego Barbarán | ${t.nav[1]}`
    document.querySelector('meta[name="description"]')?.setAttribute('content', t.intro)
  }, [language, t])

  useReveal(`${language}-${hasCredentials}`)

  useEffect(() => {
    let frame = 0
    const update = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight
        const progress = scrollable > 0 ? window.scrollY / scrollable : 0
        progressRef.current?.style.setProperty('transform', `scaleX(${progress})`)
        setIsCompactHeader(window.scrollY > 32)
      })
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  const scrollTo = useCallback((id: string) => {
    const behavior: ScrollBehavior = prefersReducedMotion() ? 'auto' : 'smooth'
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior })
      return
    }
    const target = document.getElementById(id)
    if (!target) return

    const headerHeight = document.querySelector('.topbar')?.getBoundingClientRect().height ?? 88
    const visualStart = target.querySelector('.section-heading') ?? target
    const top = visualStart.getBoundingClientRect().top + window.scrollY - headerHeight - 24
    window.scrollTo({ top: Math.max(0, top), behavior })
    history.replaceState(null, '', `#${id}`)
  }, [])

  return (
    <div className="site-shell" id="top">
      <div className="grain" aria-hidden="true" />
      <a className="skip-link" href="#main">{ui.skip}</a>
      <Topbar
        navItems={navItems}
        activeId={activeId}
        compact={isCompactHeader}
        language={language}
        onLanguage={setLanguage}
        onNavigate={scrollTo}
        progressRef={progressRef}
        labels={{ language: t.language, menu: ui.menu, mainNav: ui.mainNav, home: ui.home }}
      />

      <nav className="table-rail" aria-hidden="true">
        {navItems.map((item) => (
          <a key={item.id} href={`#${item.id}`} tabIndex={-1} className={activeId === item.id ? 'active' : ''} onClick={(event) => { event.preventDefault(); scrollTo(item.id) }}>
            <span>{item.label}</span>
            <i />
          </a>
        ))}
      </nav>

      <main id="main" tabIndex={-1}>
        <Hero t={t} language={language} onProjects={() => scrollTo('projects')} />

        <section className="section about-section" id="about" aria-labelledby="about-title">
          <div className="section-heading"><p className="section-label">{label('about', t.aboutLabel)}</p><h2 id="about-title">{t.aboutTitle}</h2></div>
          <div className="about-grid">
            <p className="large-copy">{t.aboutText}</p>
            <aside className="quote-card"><span className="quote-mark" aria-hidden="true">“</span><p>{t.aboutNote}</p><SuitIcon suit="clubs" className="quote-suit suit-clubs" /></aside>
          </div>
        </section>

        <section className="section" id="projects" aria-labelledby="projects-title">
          <div className="section-heading"><p className="section-label">{label('projects', t.projectsLabel)}</p><h2 id="projects-title">{t.projectsTitle}</h2></div>
          <div className="project-grid">{featuredFirst(projects[language]).map((project, index) => <ProjectCard key={project.href} project={project} index={index} label={t.viewGithub} />)}</div>
        </section>

        <section className="section skills-section" id="skills" aria-labelledby="skills-title">
          <div className="section-heading"><p className="section-label">{label('skills', t.skillsLabel)}</p><h2 id="skills-title">{t.skillsTitle}</h2></div>
          <div className="skills-grid">{skills[language].map((skill, index) => <SkillCard key={skill.suit} suit={skill.suit} title={skill.title} items={skill.items} index={index} />)}</div>
          <p className="spoken-languages">{t.spokenLanguages}</p>
        </section>

        <section className="section journey-section" id="journey" aria-labelledby="journey-title">
          <div className="section-heading"><p className="section-label">{label('journey', t.journeyLabel)}</p><h2 id="journey-title">{t.journeyTitle}</h2></div>
          <ol className="timeline">
            {timeline[language].map((item, index) => <TimelineCard key={index} step={index + 1} suit={item.suit} title={item.title} detail={item.detail} logo={item.logo} />)}
          </ol>
        </section>

        {hasCredentials && (
          <section className="section credentials-section" id="credentials" aria-labelledby="credentials-title">
            <div className="section-heading"><p className="section-label">{label('credentials', t.credentialsLabel)}</p><h2 id="credentials-title">{t.credentialsTitle}</h2></div>
            <ol className="timeline">
              {cred.certifications.map((item, index) => <TimelineCard key={`c-${index}`} step={index + 1} suit={item.suit} title={item.name} detail={`${t.certificationsHeading} · ${item.issuer} · ${item.date}`} href={item.url} hrefLabel={t.credentialLink} />)}
              {cred.achievements.map((item, index) => <TimelineCard key={`a-${index}`} step={cred.certifications.length + index + 1} suit={item.suit} title={item.title} detail={`${t.achievementsHeading} · ${item.date} · ${item.description}`} href={item.url} hrefLabel={t.credentialLink} />)}
            </ol>
          </section>
        )}

        <section className="section contact-section" id="contact" aria-labelledby="contact-title">
          <div className="section-heading"><p className="section-label">{label('contact', t.contactLabel)}</p><h2 id="contact-title">{t.contactTitle}</h2></div>
          <div className="contact-card" data-reveal>
            <div className="contact-copy">
              <p>{t.contactText}</p>
              <a className="contact-email" href={`mailto:${profile.email}`}>{profile.email} <span aria-hidden="true">↗</span></a>
            </div>
            <div className="contact-details">
              <span className="contact-chip" aria-hidden="true"><SuitIcon suit="hearts" className="contact-suit suit-hearts" /></span>
              <div className="contact-links">
                <a className="contact-social-link" href={profile.githubUrl} target="_blank" rel="noreferrer"><SocialIcon kind="github" /><span>GitHub</span><b aria-hidden="true">↗</b></a>
                <a className="contact-social-link" href={profile.linkedinUrl} target="_blank" rel="noreferrer"><SocialIcon kind="linkedin" /><span>LinkedIn</span><b aria-hidden="true">↗</b></a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div><SuitIcon suit="hearts" className="footer-suit suit-hearts" /><span>{t.footer}</span></div>
        <div className="footer-links">
          <a href={cvHref(language)} download={cvDownloadName(language)}>{t.cvDownload} ↓</a>
          <a href={profile.githubUrl} target="_blank" rel="noreferrer">GitHub ↗</a>
          <a href={profile.linkedinUrl} target="_blank" rel="noreferrer">LinkedIn ↗</a>
          <a href={`mailto:${profile.email}`}>{t.email} ↗</a>
        </div>
      </footer>
    </div>
  )
}

export default App
