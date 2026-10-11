import { useState } from 'react'
import type { RefObject } from 'react'
import { languages, navSuits } from '../lib'
import type { Language } from '../lib'
import { SuitIcon } from './SuitIcon'

export type NavItem = { id: string; label: string }

type Props = {
  navItems: NavItem[]
  activeId: string | null
  compact: boolean
  language: Language
  onLanguage: (language: Language) => void
  onNavigate: (id: string) => void
  progressRef: RefObject<HTMLDivElement | null>
  labels: { language: string; menu: string; mainNav: string; home: string }
}

const allSuits = <>
  <SuitIcon suit="spades" className="suit-spades" />
  <SuitIcon suit="hearts" className="suit-hearts" />
  <SuitIcon suit="diamonds" className="suit-diamonds" />
  <SuitIcon suit="clubs" className="suit-clubs" />
</>

export function Topbar({ navItems, activeId, compact, language, onLanguage, onNavigate, progressRef, labels }: Props) {
  const [open, setOpen] = useState(false)

  const go = (event: React.MouseEvent, id: string) => {
    event.preventDefault()
    setOpen(false)
    onNavigate(id)
  }

  return (
    <header className={`topbar${compact ? ' is-compact' : ''}${open ? ' menu-open' : ''}`}>
      <div className="scroll-progress" ref={progressRef} aria-hidden="true" />
      <a className="brand-lockup" href="#top" aria-label={labels.home} onClick={(event) => go(event, 'top')}>
        <span className="brand-card" aria-hidden="true">{allSuits}</span>
        <span className="brand-name">Roberto Gallego Barbarán</span>
      </a>
      <nav id="main-nav" aria-label={labels.mainNav}>
        {navItems.map((item, index) => (
          <a key={item.id} href={`#${item.id}`} aria-current={activeId === item.id ? 'true' : undefined} onClick={(event) => go(event, item.id)}>
            {index < navSuits.length && <SuitIcon suit={navSuits[index]} className={`nav-suit suit-${navSuits[index]}`} />}
            {item.label}
          </a>
        ))}
      </nav>
      <span className="topbar-suits" aria-hidden="true">{allSuits}</span>
      <div className="topbar-tools">
        <div className="language-switcher" role="group" aria-label={labels.language}>
          {languages.map((code) => (
            <button key={code} className={language === code ? 'selected' : ''} onClick={() => onLanguage(code)} aria-pressed={language === code}>
              {code.toUpperCase()}
            </button>
          ))}
        </div>
        <button className="menu-toggle" aria-expanded={open} aria-controls="main-nav" aria-label={labels.menu} onClick={() => setOpen((value) => !value)}>
          <span aria-hidden="true" />
        </button>
      </div>
    </header>
  )
}
