import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import type { CaseBlock, Project, UiStrings } from '../lib'
import { SocialIcon, SuitIcon } from './SuitIcon'

// `code` in backticks is the only inline markup a case study uses
function inline(text: string): ReactNode[] {
  return text.split(/(`[^`]+`)/).filter(Boolean).map((part, i) =>
    part.startsWith('`') && part.endsWith('`') ? <code key={i}>{part.slice(1, -1)}</code> : part)
}

function Block({ block, label }: { block: CaseBlock; label: string }) {
  if (block.h) return <h3>{inline(block.h)}</h3>
  if (block.h3) return <h4>{inline(block.h3)}</h4>
  if (block.p) return <p>{inline(block.p)}</p>
  if (block.ul) return <ul>{block.ul.map((item, i) => <li key={i}>{inline(item)}</li>)}</ul>
  if (block.table) {
    const { head = [], rows, caption } = block.table
    return (
      // a wide table scrolls inside its own box, never the page; the box is focusable so the keyboard can scroll it
      <div className="case-table" role="region" aria-label={caption ?? label} tabIndex={0}>
        <table>
          {caption && <caption>{caption}</caption>}
          {head.length > 0 && <thead><tr>{head.map((cell, i) => <th key={i} scope="col">{inline(cell)}</th>)}</tr></thead>}
          <tbody>
            {rows.map((row, r) => (
              <tr key={r}>
                {row.map((cell, c) => c === 0 && head.length === 0
                  ? <th key={c} scope="row">{inline(cell)}</th>
                  : <td key={c}>{inline(cell)}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
  return null
}

export function CaseStudyButton({ project, labels }: { project: Project; labels: UiStrings }) {
  const [open, setOpen] = useState(false)
  if (!project.caseStudy) return null
  return (
    <>
      <button type="button" className="case-open" aria-haspopup="dialog" onClick={() => setOpen(true)}>
        {labels.readCase} <span aria-hidden="true">→</span>
      </button>
      {open && <CaseStudyDialog project={project} labels={labels} onClose={() => setOpen(false)} />}
    </>
  )
}

function CaseStudyDialog({ project, labels, onClose }: { project: Project; labels: UiStrings; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = `case-${project.href.replace(/\W+/g, '-')}`

  useEffect(() => {
    const dialog = dialogRef.current
    if (dialog && !dialog.open) dialog.showModal()
  }, [])

  return (
    <dialog
      ref={dialogRef}
      className={`deck-dialog case-dialog suit-${project.suit}`}
      aria-labelledby={titleId}
      onClose={(event) => { event.stopPropagation(); onClose() }}
      onClick={(event) => {
        event.stopPropagation()
        if (event.target === dialogRef.current) dialogRef.current?.close()
      }}
    >
      <div className="deck-panel">
        <header className="deck-header">
          <div>
            <p className="card-eyebrow">{project.eyebrow}</p>
            <h2 id={titleId}>{project.name}</h2>
          </div>
          <button type="button" className="deck-close" aria-label={labels.close} onClick={() => dialogRef.current?.close()}>
            <span aria-hidden="true">×</span>
          </button>
        </header>
        <div className="deck-scroll">
          <article className="case-body">
            {project.caseStudy!.map((block, i) => <Block key={i} block={block} label={project.name} />)}
            <p className="case-footer">
              <SuitIcon suit={project.suit} className="project-suit" />
              <a className="case-link" href={project.href} target="_blank" rel="noreferrer">
                <SocialIcon kind="github" /> {labels.openSource}
              </a>
            </p>
          </article>
        </div>
      </div>
    </dialog>
  )
}
