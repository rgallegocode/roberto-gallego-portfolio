import { useEffect, useMemo, useRef, useState } from 'react'
import { rankOf } from '../lib'
import type { Project, UiStrings } from '../lib'
import { SocialIcon, SuitIcon } from './SuitIcon'

// the rest stay behind "more" so a long stack never pushes the cards out of view
const visibleTechs = 12

const normalize = (text: string) => text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase()

type Props = {
  projects: Project[]
  labels: UiStrings
  githubLabel: string
  onClose: () => void
}

export function ProjectDeck({ projects, labels, githubLabel, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<string[]>([])
  const [showAllTechs, setShowAllTechs] = useState(false)

  useEffect(() => {
    const dialog = dialogRef.current
    if (dialog && !dialog.open) dialog.showModal()
  }, [])

  // ordered by how many projects use each technology
  const techs = useMemo(() => {
    const totals = new Map<string, number>()
    for (const project of projects) for (const tech of project.stack) totals.set(tech, (totals.get(tech) ?? 0) + 1)
    return [...totals.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([tech]) => tech)
  }, [projects])

  const named = projects.filter((project) => normalize(project.name).includes(normalize(query.trim())))
  const hasAll = (project: Project, wanted: string[]) => wanted.every((tech) => project.stack.includes(tech))
  const matches = named.filter((project) => hasAll(project, selected))
  const countWith = (tech: string) => named.filter((project) => hasAll(project, [...selected, tech])).length

  const toggle = (tech: string) =>
    setSelected((current) => (current.includes(tech) ? current.filter((item) => item !== tech) : [...current, tech]))
  const clear = () => { setQuery(''); setSelected([]) }

  const shownTechs = showAllTechs ? techs : techs.filter((tech, index) => index < visibleTechs || selected.includes(tech))
  const isFiltering = query !== '' || selected.length > 0

  return (
    <dialog
      ref={dialogRef}
      className="deck-dialog"
      aria-labelledby="deck-title"
      onClose={onClose}
      onClick={(event) => { if (event.target === dialogRef.current) dialogRef.current?.close() }}
    >
      <div className="deck-panel">
        <header className="deck-header">
          <h2 id="deck-title">{labels.deckTitle}</h2>
          <button type="button" className="deck-close" aria-label={labels.close} onClick={() => dialogRef.current?.close()}>
            <span aria-hidden="true">×</span>
          </button>
        </header>

        <div className="deck-scroll">
          <div className="deck-filters">
            <label className="deck-search">
              <span>{labels.searchLabel}</span>
              <input type="search" value={query} placeholder={labels.searchPlaceholder} onChange={(event) => setQuery(event.target.value)} />
            </label>
            <div className="deck-techs" role="group" aria-label={labels.techLabel}>
              {shownTechs.map((tech) => {
                const count = countWith(tech)
                const pressed = selected.includes(tech)
                return (
                  <button key={tech} type="button" className="tech-chip" aria-pressed={pressed} disabled={!pressed && count === 0} onClick={() => toggle(tech)}>
                    {tech} <b>{count}</b>
                  </button>
                )
              })}
              {techs.length > visibleTechs && (
                <button type="button" className="tech-more" aria-expanded={showAllTechs} onClick={() => setShowAllTechs((value) => !value)}>
                  {showAllTechs ? labels.fewerTechs : `${labels.moreTechs} (${techs.length - visibleTechs})`}
                </button>
              )}
            </div>
            <div className="deck-status">
              <p role="status">{labels.results.replace('{shown}', String(matches.length)).replace('{total}', String(projects.length))}</p>
              {isFiltering && <button type="button" className="text-button" onClick={clear}>{labels.clear}</button>}
            </div>
          </div>

          {matches.length > 0 ? (
            <ul className="deck-grid">
              {matches.map((project) => <DeckCard key={project.name} project={project} rank={rankOf(projects.indexOf(project))} githubLabel={githubLabel} />)}
            </ul>
          ) : (
            <div className="deck-empty">
              <SuitIcon suit="spades" className="deck-empty-suit" />
              <p>{labels.noMatch}</p>
            </div>
          )}
        </div>
      </div>
    </dialog>
  )
}

function DeckCard({ project, rank, githubLabel }: { project: Project; rank: string; githubLabel: string }) {
  return (
    <li className={`deck-card suit-${project.suit}`}>
      <div className="card-topline">
        <span className="card-rank">{rank}</span>
        <SuitIcon suit={project.suit} className="project-suit" />
      </div>
      <p className="card-eyebrow">{project.eyebrow}</p>
      <h3>{project.name}</h3>
      <p className="project-description">{project.description}</p>
      <div className="project-bottom">
        <ul className="stack">{project.stack.map((item) => <li key={item}>{item}</li>)}</ul>
        <a className="project-link" href={project.href} target="_blank" rel="noreferrer" aria-label={`${githubLabel}: ${project.name}`} title={githubLabel}><SocialIcon kind="github" /></a>
      </div>
    </li>
  )
}
