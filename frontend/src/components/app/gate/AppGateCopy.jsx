export default function AppGateCopy({ connecting, connectError, onConnect }) {
  return (
    <div className="relative z-10 max-w-[560px]">
      <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#d8b15f]">BOND Gate</div>
      <h1 className="mt-5 text-[clamp(40px,5.6vw,72px)] font-medium leading-[0.92] tracking-[-0.07em] text-[#ede9df]">
        Connect wallet to enter your deal workspace.
      </h1>
      <button
        type="button"
        onClick={onConnect}
        disabled={connecting}
        className="mt-8 inline-flex h-12 items-center justify-center border border-[#ede9df] bg-[#ede9df] px-6 font-mono text-[12px] font-semibold uppercase tracking-[0.16em] text-[#20201f] transition duration-160 ease-out hover:bg-transparent hover:text-[#ede9df] active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {connecting ? 'Connecting…' : 'Connect wallet'}
      </button>
      {connectError && (
        <div className="mt-4 max-w-[480px] border border-[#8d2f2f]/40 bg-[#8d2f2f]/10 px-4 py-3 text-[13px] leading-[1.55] text-[#f0c2b8]">
          {connectError}
        </div>
      )}
    </div>
  )
}
