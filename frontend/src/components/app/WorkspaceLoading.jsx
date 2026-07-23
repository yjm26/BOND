export default function WorkspaceLoading({ label = 'Preparing workspace' }) {
  return (
    <section className="min-h-screen overflow-hidden bg-[#050505] px-6 pt-[96px] text-[#ede9df] sm:px-10 lg:px-14">
      <div className="relative flex min-h-[calc(100vh-96px)] items-center justify-center">
        <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(237,233,223,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(237,233,223,0.08)_1px,transparent_1px)] [background-size:32px_32px]" />
        <div className="absolute h-[420px] w-[420px] rounded-full bg-[#d8b15f]/10 blur-3xl" />
        <div className="relative w-full max-w-[460px] border border-[#ede9df]/12 bg-[#20201f]/80 p-6 text-center sm:p-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#ede9df]/12">
            <div className="h-9 w-9 animate-spin rounded-full border border-[#ede9df]/16 border-t-[#d8b15f]" />
          </div>
          <div className="mt-6 font-mono text-[10px] uppercase tracking-[0.28em] text-[#d8b15f]">{label}</div>
          <p className="mt-3 text-[15px] leading-[1.6] text-[#b9b2a5]">
            Loading wallet context, room surfaces, and workspace preferences.
          </p>
        </div>
      </div>
    </section>
  )
}
