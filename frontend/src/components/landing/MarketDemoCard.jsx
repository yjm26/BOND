function roleTone(role) {
  return role === 'buyer'
    ? 'border-[#0a0a0a]/20 text-[#0a0a0a]'
    : 'border-[#0a0a0a]/20 text-[#0a0a0a]'
}

/** Static market card — display only, Linear density. */
export default function MarketDemoCard({ listing, dimmed = false, className = '' }) {
  return (
    <article
      className={[
        'border border-[#0a0a0a]/12 bg-[#fafafa] p-4 transition duration-160 ease-out sm:p-5',
        dimmed ? 'opacity-45' : 'opacity-100 shadow-[0_12px_40px_rgba(0,0,0,0.08)]',
        className,
      ].join(' ')}
    >
      <div className="flex items-start justify-between gap-3">
        <span className={`border px-2 py-1 font-mono text-[9px] uppercase tracking-[0.16em] ${roleTone(listing.role)}`}>
          {listing.role}
        </span>
        <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#737373]">{listing.tag}</span>
      </div>
      <h3 className="mt-4 line-clamp-2 text-[17px] font-medium leading-[1.15] tracking-[-0.035em] text-[#0a0a0a] sm:text-[18px]">
        {listing.title}
      </h3>
      <div className="mt-5 flex items-end justify-between gap-3 border-t border-[#0a0a0a]/08 pt-4">
        <div>
          <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#737373]">USDC</div>
          <div className="mt-1 font-mono text-[22px] tracking-[-0.04em] text-[#0a0a0a]">{listing.price}</div>
        </div>
        <div className="text-right">
          <div className="font-mono text-[10px] text-[#525252]">{listing.days}d</div>
          <div className="mt-1 font-mono text-[10px] text-[#737373]">{listing.creator}</div>
        </div>
      </div>
    </article>
  )
}
