export default function MarketEmptyState({ search, wallet }) {
  return (
    <div className="grid min-h-[260px] place-items-center border border-[#ede9df]/10 bg-[#20201f] p-8 text-center">
      <div className="mb-5 flex h-14 w-14 items-center justify-center border border-[#ede9df]/12 bg-[#111110] font-mono text-[20px] text-[#ede9df]/44">⌕</div>
      <h3 className="mb-2 text-[26px] font-medium tracking-[-0.06em] text-[#ede9df]">{search ? 'No results found' : 'No listings yet'}</h3>
      <p className="max-w-[420px] text-[14px] leading-[1.65] text-[#b9b2a5]">{search ? `No listings match "${search}"` : wallet ? 'Post the first listing and define the escrow terms before value moves.' : 'Connect your wallet to post a listing. Deals should start with clear terms, price, proof, and settlement path.'}</p>
    </div>
  )
}
