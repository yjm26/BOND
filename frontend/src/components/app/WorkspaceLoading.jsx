export default function WorkspaceLoading({ label = 'Preparing workspace' }) {
  return (
    <section className="min-h-screen overflow-hidden bg-[#000000] px-6 pt-[96px] text-[#fafafa] sm:px-10 lg:px-14">
      <div className="relative flex min-h-[calc(100vh-96px)] items-center justify-center">
        <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(250,250,250,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(250,250,250,0.08)_1px,transparent_1px)] [background-size:32px_32px]" />
        <div className="absolute h-[420px] w-[420px] rounded-full bg-[#a3a3a3]/10 blur-3xl" />
        <div className="relative w-full max-w-[460px] border border-[#fafafa]/12 bg-[#111111]/80 p-6 text-center sm:p-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#fafafa]/12">
            <div className="h-9 w-9 animate-spin rounded-full border border-[#fafafa]/16 border-t-[#a3a3a3]" />
          </div>
          <div className="mt-6 font-mono text-[10px] uppercase tracking-[0.28em] text-[#a3a3a3]">{label}</div>
          <p className="mt-3 text-[15px] leading-[1.6] text-[#a3a3a3]">
            Loading wallet context, room surfaces, and workspace preferences.
          </p>
        </div>
      </div>
    </section>
  )
}
