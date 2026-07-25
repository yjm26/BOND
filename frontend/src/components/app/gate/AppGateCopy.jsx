export default function AppGateCopy({ connecting, connectError, onConnect }) {
  return (
    <div className="relative z-10 mx-auto w-full max-w-[640px] text-center">
      <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#a3a3a3]">BOND Gate</div>
      <h1 className="mx-auto mt-5 max-w-[18ch] text-[clamp(40px,6.2vw,72px)] font-medium leading-[0.92] tracking-[-0.07em] text-[#fafafa]">
        Connect wallet to enter your deal workspace.
      </h1>
      <button
        type="button"
        onClick={onConnect}
        disabled={connecting}
        className="mt-8 inline-flex h-12 items-center justify-center border border-[#fafafa] bg-[#fafafa] px-7 font-mono text-[12px] font-semibold uppercase tracking-[0.16em] text-[#111111] transition duration-160 ease-out hover:bg-transparent hover:text-[#fafafa] active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {connecting ? 'Connecting…' : 'Connect wallet'}
      </button>
      {connectError && (
        <div className="mx-auto mt-5 max-w-[480px] border border-[#7f1d1d]/40 bg-[#7f1d1d]/10 px-4 py-3 text-left text-[13px] leading-[1.55] text-[#d4d4d4]">
          {connectError}
        </div>
      )}
      <div className="mt-8 font-mono text-[10px] uppercase tracking-[0.2em] text-[#fafafa]/34">
        Arc Testnet
      </div>
    </div>
  )
}
