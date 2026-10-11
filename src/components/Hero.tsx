import { assetPath, cvDownloadName, cvHref, profile } from '../lib'
import type { Language } from '../lib'
import { SuitIcon } from './SuitIcon'

type Copy = {
  kicker: string
  title: string
  intro: string
  cta: string
  contact: string
  cvView: string
  cvDownload: string
  profileAlt: string
  scrollNote: string
}

export function Hero({ t, language, onProjects }: { t: Copy; language: Language; onProjects: () => void }) {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow">{t.kicker}</p>
        <h1 id="hero-title">{t.title.split('\n').map((line, index) => <span key={index}>{line}</span>)}</h1>
        <p className="hero-intro">{t.intro}</p>
        <div className="hero-actions">
          <button className="primary-button" onClick={onProjects}>{t.cta} <span aria-hidden="true">→</span></button>
          <a className="text-link" href={`mailto:${profile.email}`}>{t.contact} <span aria-hidden="true">↗</span></a>
        </div>
        <div className="cv-actions">
          <a className="cv-link" href={cvHref(language)} target="_blank" rel="noreferrer">{t.cvView} <span aria-hidden="true">↗</span></a>
          <a className="cv-link cv-download" href={cvHref(language)} download={cvDownloadName(language)}>{t.cvDownload} <span aria-hidden="true">↓</span></a>
        </div>
      </div>
      <div className="hero-card-wrap">
        <div className="hero-card back-card" aria-hidden="true"><span>R</span></div>
        <div className="hero-card ace-card" aria-hidden="true">
          <span className="card-corner">A<SuitIcon suit="spades" className="card-corner-suit" /></span>
          <SuitIcon suit="spades" className="ace-symbol" />
          <span className="card-corner bottom">A<SuitIcon suit="spades" className="card-corner-suit" /></span>
        </div>
        <div className="profile-card">
          <SuitIcon suit="spades" className="profile-suit suit-top-left suit-spades" />
          <SuitIcon suit="hearts" className="profile-suit suit-top-right suit-hearts" />
          <div className="profile-photo-fallback" aria-hidden="true">RG</div>
          <picture>
            <source srcSet={assetPath('profile-photo.webp')} type="image/webp" />
            <img
              src={assetPath('profile-photo.jpg')}
              alt={t.profileAlt}
              width={640}
              height={554}
              decoding="async"
              fetchPriority="high"
              onError={(event) => { event.currentTarget.style.display = 'none' }}
            />
          </picture>
          <SuitIcon suit="clubs" className="profile-suit suit-bottom-left suit-clubs" />
          <SuitIcon suit="diamonds" className="profile-suit suit-bottom-right suit-diamonds" />
        </div>
      </div>
      <div className="scroll-note" aria-hidden="true"><span /> {t.scrollNote}</div>
    </section>
  )
}
