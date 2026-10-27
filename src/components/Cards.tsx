import { useState } from 'react'
import type { CSSProperties } from 'react'
import { assetPath } from '../lib'
import type { Project, Suit } from '../lib'
import { SocialIcon, SuitIcon } from './SuitIcon'

const rankLabels = ['A', 'K', 'Q', 'J']

const webpOf = (file: string) => file.replace(/\.(jpe?g|png)$/i, '.webp')

function ProjectGallery({ images }: { images: Project['images'] }) {
  const [active, setActive] = useState(0)
  const image = images[active]
  return (
    <div className="project-gallery">
      <a className="project-shot" href={assetPath(image.src)} target="_blank" rel="noreferrer">
        <picture>
          <source srcSet={assetPath(webpOf(image.src))} type="image/webp" />
          <img src={assetPath(image.src)} width={1600} height={1000} loading="lazy" decoding="async" alt={image.alt} />
        </picture>
      </a>
      {images.length > 1 && (
        <div className="project-thumbs">
          {images.map((item, i) => (
            <button key={item.src} type="button" className={i === active ? 'is-active' : ''} aria-pressed={i === active} aria-label={item.alt} onClick={() => setActive(i)}>
              <picture>
                <source srcSet={assetPath(webpOf(item.src))} type="image/webp" />
                <img src={assetPath(item.src)} width={160} height={100} loading="lazy" decoding="async" alt="" />
              </picture>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function ProjectCard({ project, index, label }: { project: Project; index: number; label: string }) {
  const number = String(index + 1).padStart(2, '0')
  const featured = project.images.length > 0
  return (
    <article className={`project-card suit-${project.suit}${featured ? ' project-card-featured' : ''}`} data-reveal style={{ '--delay': `${index * 120}ms` } as CSSProperties}>
      <div className="project-body">
        <div className="card-topline">
          <span className="project-index">{number}</span>
          <SuitIcon suit={project.suit} className="project-suit" />
        </div>
        <p className="card-eyebrow">{project.eyebrow}</p>
        <h3>{project.name}</h3>
        <p className="project-description">{project.description}</p>
        <p className="project-detail">{project.detail}</p>
        <div className="project-bottom">
          <ul className="stack">{project.stack.map((item) => <li key={item}>{item}</li>)}</ul>
          <a className="project-link" href={project.href} target="_blank" rel="noreferrer" aria-label={`${label}: ${project.name}`} title={label}><SocialIcon kind="github" /></a>
        </div>
      </div>
      {featured && <ProjectGallery images={project.images} />}
    </article>
  )
}

export function SkillCard({ suit, title, items, index }: { suit: Suit; title: string; items: string; index: number }) {
  const list = items.split('·').map((item) => item.trim()).filter(Boolean)
  const rank = rankLabels[index % rankLabels.length]
  return (
    <article className={`skill-card suit-${suit}`} data-reveal style={{ '--delay': `${index * 90}ms` } as CSSProperties}>
      <span className="skill-corner" aria-hidden="true">{rank}<SuitIcon suit={suit} className={`suit suit-${suit}`} /></span>
      <h3 className="skill-title">{title}</h3>
      <ul className="skill-items">{list.map((item) => <li key={item}>{item}</li>)}</ul>
      <span className="skill-corner bottom" aria-hidden="true">{rank}<SuitIcon suit={suit} className={`suit suit-${suit}`} /></span>
    </article>
  )
}

type TimelineProps = {
  suit: Suit
  title: string
  detail: string
  step: number
  logo?: string | null
  href?: string | null
  hrefLabel?: string
}

export function TimelineCard({ suit, title, detail, step, logo = null, href = null, hrefLabel = '' }: TimelineProps) {
  const webp = logo && !logo.endsWith('.svg') ? webpOf(logo) : null
  return (
    <li className={`timeline-card${logo ? ' timeline-card-featured' : ''}`} data-reveal style={{ '--delay': `${(step - 1) * 90}ms` } as CSSProperties}>
      <span className="timeline-node" aria-hidden="true"><SuitIcon suit={suit} className={`suit-${suit}`} /></span>
      <span className="timeline-step" aria-hidden="true">{String(step).padStart(2, '0')}</span>
      <h3>{title}</h3>
      <p>{detail}</p>
      {href && <p><a className="text-link" href={href} target="_blank" rel="noreferrer">{hrefLabel} <span aria-hidden="true">↗</span></a></p>}
      {logo && (
        <picture className="timeline-logo-plate">
          {webp && <source srcSet={assetPath(webp)} type="image/webp" />}
          <img className="timeline-logo-bottom" src={assetPath(logo)} width={272} height={75} loading="lazy" decoding="async" alt={title.split(' · ').pop() ?? ''} />
        </picture>
      )}
    </li>
  )
}
