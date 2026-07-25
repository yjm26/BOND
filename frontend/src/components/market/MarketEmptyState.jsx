export default function MarketEmptyState({ search, wallet }) {
  return (
    <div className="grid min-h-[260px] place-items-center border border-[#fafafa]/10 bg-[#111111] p-8 text-center">
      <div className="mb-5 flex h-14 w-14 items-center justify-center border border-[#fafafa]/12 bg-[#0a0a0a] font-mono text-[20px] text-[#fafafa]/44">⌕</div>
      <h3 className="mb-2 text-[26px] font-medium tracking-[-0.06em] text-[#fafafa]">{search ? 'No results found' : 'No listings yet'}</h3>
      <p className="max-w-[420px] text-[14px] leading-[1.65] text-[#a3a3a3]">{search ? `No listings match "${search}"` : wallet ? 'Post the first listing and define the escrow terms before value moves.' : 'Connect your wallet to post a listing. Deals should start with clear terms, price, proof, and settlement path.'}</p>
    </div>
  )
}
