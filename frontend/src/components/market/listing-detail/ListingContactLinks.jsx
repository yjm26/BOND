import { SOCIAL_OPTIONS } from '../marketConstants'
import { socialLink } from '../marketUtils'

export default function ListingContactLinks({ socials }) {
  if (!socials || Object.keys(socials).length === 0) return null
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-[2px] text-zinc-400 mb-2">Contact</div>
      <div className="flex flex-wrap gap-2">
        {SOCIAL_OPTIONS.map((social) => {
          const val = socials?.[social.key]
          if (!val) return null
          const link = socialLink(social.key, val)
          return link ? (
            <a key={social.key} href={link} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-zinc-200 dark:border-white/10 text-[12px] text-zinc-700 dark:text-gray-300 hover:bg-zinc-50 dark:hover:bg-white/5 transition" onClick={(event) => event.stopPropagation()}>
              <span>{social.icon}</span> {val}
            </a>
          ) : (
            <span key={social.key} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-zinc-200 dark:border-white/10 text-[12px] text-zinc-500 dark:text-gray-400">
              <span>{social.icon}</span> {val}
            </span>
          )
        })}
      </div>
    </div>
  )
}
