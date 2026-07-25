export default function PublicListingsHeader() {
  return (
    <header className="border-b border-[#0a0a0a]/10 pb-8 sm:pb-10">
      <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#737373]">Public market</div>
      <h1 className="mt-4 max-w-[920px] text-[clamp(40px,7vw,72px)] font-medium leading-[0.92] tracking-[-0.07em] text-[#0a0a0a]">
        Recent listings.
      </h1>
      <p className="mt-5 max-w-[560px] text-[16px] leading-[1.65] tracking-[-0.015em] text-[#525252] sm:text-[17px]">
        Browse open deals without connecting a wallet. When something fits, enter the app to open a room or post your own.
      </p>
    </header>
  )
}
