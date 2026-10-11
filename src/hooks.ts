import { useEffect, useState } from 'react'

/** Id of the section currently crossing the reading line (upper-middle of the viewport). */
export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string | null>(null)
  const key = ids.join('|')

  useEffect(() => {
    const elements = key.split('|').map((id) => document.getElementById(id)).filter((el): el is HTMLElement => el !== null)
    if (!('IntersectionObserver' in window) || elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id)
      },
      { rootMargin: '-35% 0px -60% 0px' },
    )
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [key])

  return active
}

/** Adds `is-visible` to every `[data-reveal]` element the first time it enters the viewport. */
export function useReveal(dependency: unknown) {
  useEffect(() => {
    const root = document.documentElement
    const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-visible)'))
    if (!('IntersectionObserver' in window)) {
      targets.forEach((el) => el.classList.add('is-visible'))
      return
    }

    root.classList.add('js-reveal')
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.12 },
    )
    targets.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [dependency])
}
