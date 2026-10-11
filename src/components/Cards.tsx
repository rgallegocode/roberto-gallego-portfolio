import type { CSSProperties } from 'react'
import { assetPath } from '../lib'
import type { Project, Suit } from '../lib'
import { SuitIcon } from './SuitIcon'

const rankLabels = ['A', 'K', 'Q', 'J']

export function ProjectCard({ project, index, label }: { project: Project; index: number; label: string }) {
  const number = String(index + 1).padStart(2, '0')
  return (
    <article className={`project-card suit-${project.suit}`} data-reveal style={{ '--delay': `${index * 120}ms` } as CSSProperties}>
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
        <a className="project-link" href={project.href} target="_blank" rel="noreferrer" aria-label={`${label}: ${project.name}`}>↗</a>
      </div>
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
  const webp = logo ? logo.replace(/\.(jpe?g|png)$/i, '.webp') : null
  return (
    <li className={`timeline-card${logo ? ' timeline-card-featured' : ''}`} data-reveal style={{ '--delay': `${(step - 1) * 90}ms` } as CSSProperties}>
      <span className="timeline-node" aria-hidden="true"><SuitIcon suit={suit} className={`suit-${suit}`} /></span>
      <span className="timeline-step" aria-hidden="true">{String(step).padStart(2, '0')}</span>
      <h3>{title}</h3>
      <p>{detail}</p>
      {href && <p><a className="text-link" href={href} target="_blank" rel="noreferrer">{hrefLabel} <span aria-hidden="true">↗</span></a></p>}
      {logo && webp && (
        <picture>
          <source srcSet={assetPath(webp)} type="image/webp" />
          <img className="timeline-logo-bottom" src={assetPath(logo)} width={272} height={75} loading="lazy" decoding="async" alt={title.split(' · ').pop() ?? ''} />
        </picture>
      )}
    </li>
  )
}
