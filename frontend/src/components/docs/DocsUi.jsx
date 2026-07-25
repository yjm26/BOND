import { Link } from 'react-router-dom'

export function NavPill({ item, active }) {
  return (
    <Link
      to={`/docs/${item.id}`}
      className={`shrink-0 border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] transition duration-160 ease-out active:scale-[0.97] ${
        active
          ? 'border-[#0a0a0a] bg-[#0a0a0a] text-[#fafafa]'
          : 'border-[#0a0a0a]/14 text-[#525252] hover:border-[#0a0a0a]/38'
      }`}
    >
      {item.label}
    </Link>
  )
}

export function SideLink({ item, active }) {
  return (
    <Link
      to={`/docs/${item.id}`}
      className={`block px-3 py-2 text-[14px] tracking-[-0.01em] transition duration-160 ease-out ${
        active ? 'bg-[#0a0a0a] text-[#fafafa]' : 'text-[#525252] hover:bg-[#0a0a0a]/[0.04] hover:text-[#0a0a0a]'
      }`}
    >
      {item.label}
    </Link>
  )
}

export function Section({ eyebrow, title, intro, children }) {
  return (
    <article className="animate-page-enter">
      <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#a3a3a3]">{eyebrow}</div>
      <h2 className="mt-4 max-w-[760px] text-[clamp(36px,5vw,68px)] font-medium leading-[0.92] tracking-[-0.075em]">
        {title}
      </h2>
      {intro && (
        <p className="mt-5 max-w-[680px] text-[16px] leading-[1.72] tracking-[-0.01em] text-[#525252]">{intro}</p>
      )}
      <div className="mt-8 space-y-8">{children}</div>
    </article>
  )
}

export function H3({ children }) {
  return (
    <h3 className="mb-3 text-[24px] font-medium leading-[1] tracking-[-0.055em] text-[#0a0a0a] sm:text-[30px]">
      {children}
    </h3>
  )
}

export function P({ children }) {
  return (
    <p className="max-w-[700px] text-[14px] leading-[1.72] tracking-[-0.01em] text-[#525252] sm:text-[15px]">
      {children}
    </p>
  )
}

export function Code({ children }) {
  return (
    <code className="border border-[#0a0a0a]/14 bg-[#f5f5f5] px-1.5 py-0.5 font-mono text-[12px] text-[#0a0a0a]">
      {children}
    </code>
  )
}

export function Card({ children, tone = 'paper' }) {
  const style =
    tone === 'dark'
      ? 'border-[#fafafa]/12 bg-[#111111] text-[#fafafa]'
      : 'border-[#0a0a0a]/14 bg-[#f5f5f5] text-[#0a0a0a]'
  return <div className={`border p-5 sm:p-6 ${style}`}>{children}</div>
}

export function FactGrid({ items }) {
  return (
    <div className="grid border border-[#0a0a0a]/14 md:grid-cols-2">
      {items.map(([label, body], index) => (
        <div
          key={label}
          className={`bg-[#f5f5f5] p-5 sm:p-6 ${index > 0 ? 'border-t border-[#0a0a0a]/14 md:border-t-0' : ''} ${
            index % 2 ? 'md:border-l md:border-[#0a0a0a]/14' : ''
          } ${index > 1 ? 'md:border-t md:border-[#0a0a0a]/14' : ''}`}
        >
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#737373]">{label}</div>
          <p className="mt-4 text-[14px] leading-[1.65] tracking-[-0.01em] text-[#525252]">{body}</p>
        </div>
      ))}
    </div>
  )
}

export function Table({ headers, rows }) {
  return (
    <div className="overflow-hidden border border-[#0a0a0a]/14 bg-[#f5f5f5]">
      <table className="w-full text-left text-[13px]">
        <thead>
          <tr className="border-b border-[#0a0a0a]/14 bg-[#0a0a0a]/[0.04]">
            {headers.map((header) => (
              <th
                key={header}
                className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-[#737373]"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className="border-t border-[#0a0a0a]/10 first:border-t-0">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-4 py-3 align-top text-[#262626]">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function Callout({ title, children, danger = false }) {
  return (
    <div
      className={`border px-4 py-3 ${
        danger
          ? 'border-[#b87333]/35 bg-[#b87333]/10 text-[#44403c]'
          : 'border-[#a3a3a3]/30 bg-[#a3a3a3]/[0.09] text-[#404040]'
      }`}
    >
      <div className="font-mono text-[10px] uppercase tracking-[0.2em]">{title}</div>
      <div className="mt-2 text-[13px] leading-[1.65] tracking-[-0.01em]">{children}</div>
    </div>
  )
}

export function SmallFact({ label, value }) {
  return (
    <div className="border border-[#0a0a0a]/12 bg-[#fafafa] p-4">
      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#737373]">{label}</div>
      <div className="mt-2 text-[18px] font-medium tracking-[-0.04em] text-[#0a0a0a]">{value}</div>
    </div>
  )
}

export function Faq({ q, children }) {
  return (
    <details className="group border border-[#0a0a0a]/14 bg-[#f5f5f5] p-4 open:bg-[#f5f5f5]">
      <summary className="cursor-pointer list-none text-[16px] font-medium tracking-[-0.035em] text-[#0a0a0a]">
        {q}
        <span className="float-right font-mono text-[11px] text-[#737373] transition group-open:rotate-45">+</span>
      </summary>
      <div className="mt-3 text-[14px] leading-[1.7] tracking-[-0.01em] text-[#525252]">{children}</div>
    </details>
  )
}
