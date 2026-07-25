import { SOCIAL_OPTIONS } from '../marketConstants'
import { socialLink } from '../marketUtils'

export default function ListingContactLinks({ socials }) {
  if (!socials || Object.keys(socials).length === 0) return null

  return (
    <div className="border border-[var(--a-line)] bg-[var(--a-surface)]/55 p-4">
      <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-[color:var(--a-faint)]">Contact</div>
      <div className="mt-3 flex flex-wrap gap-2">
        {SOCIAL_OPTIONS.map((social) => {
          const val = socials?.[social.key]
          if (!val) return null
          const link = socialLink(social.key, val)
          const className = "inline-flex items-center gap-1.5 border border-[var(--a-line)] px-3 py-1.5 text-[12px] text-[#e5e5e5] transition hover:border-[var(--a-muted)]/34 hover:text-[var(--a-ink)]"

          return link ? (
            <a key={social.key} href={link} target="_blank" rel="noopener noreferrer" className={className} onClick={(event) => event.stopPropagation()}>
              <span>{social.icon}</span> {val}
            </a>
          ) : (
            <span key={social.key} className={className}>
              <span>{social.icon}</span> {val}
            </span>
          )
        })}
      </div>
    </div>
  )
}
