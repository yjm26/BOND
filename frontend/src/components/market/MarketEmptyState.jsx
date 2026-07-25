export default function MarketEmptyState({ search, wallet }) {
  return (
    <div className="grid min-h-[260px] place-items-center border border-[var(--a-line)] bg-[var(--a-surface)] p-8 text-center">
      <div className="mb-5 flex h-14 w-14 items-center justify-center border border-[var(--a-line)] bg-[var(--a-panel)] font-mono text-[20px] text-[color:var(--a-faint)]">⌕</div>
      <h3 className="mb-2 text-[26px] font-medium tracking-[-0.06em] text-[var(--a-ink)]">{search ? 'No results found' : 'No listings yet'}</h3>
      <p className="max-w-[420px] text-[14px] leading-[1.65] text-[var(--a-muted)]">{search ? `No listings match "${search}"` : wallet ? 'Post the first listing and define the escrow terms before value moves.' : 'Connect your wallet to post a listing. Deals should start with clear terms, price, proof, and settlement path.'}</p>
    </div>
  )
}
