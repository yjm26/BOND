export default function AppGateCopy({ connecting, connectError, onConnect }) {
  return (
    <div className="relative z-10 mx-auto w-full max-w-[640px] text-center">
      <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--a-muted)]">BOND Gate</div>
      <h1 className="mx-auto mt-5 max-w-[18ch] text-[clamp(40px,6.2vw,72px)] font-medium leading-[0.92] tracking-[-0.07em] text-[var(--a-ink)]">
        {connecting ? 'Restoring your workspace…' : 'Connect wallet to enter your deal workspace.'}
      </h1>
      {connecting && (
        <p className="mx-auto mt-4 max-w-[42ch] text-[14px] leading-[1.6] text-[var(--a-muted)]">
          Checking the wallet session in this tab. If this hangs, use the button below.
        </p>
      )}
      <button
        type="button"
        onClick={onConnect}
        disabled={false}
        className="group mt-8 inline-flex h-[52px] items-center justify-center gap-2 border border-[var(--a-ink)] bg-[var(--a-inverse-bg)] px-8 font-mono text-[12px] font-semibold uppercase tracking-[0.16em] text-[var(--a-inverse-ink)] transition duration-160 ease-out hover:bg-transparent hover:text-[var(--a-ink)] active:scale-[0.97]"
      >
        {connecting ? 'Connecting… · tap to retry' : 'Connect wallet'}
        {!connecting && (
          <span className="inline-block transition-transform duration-200 ease-out group-hover:translate-x-0.5">→</span>
        )}
      </button>
      {connectError && (
        <div className="mx-auto mt-5 max-w-[480px] border border-[#7f1d1d]/40 bg-[#7f1d1d]/10 px-4 py-3 text-left text-[13px] leading-[1.55] text-[#b91c1c]">
          {connectError}
        </div>
      )}
      <div className="mt-8 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--a-faint)]">
        Build on Arc
      </div>
    </div>
  )
}
