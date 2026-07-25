export default function RoomLoadingState() {
  return (
    <section className="min-h-screen bg-[var(--a-bg)] px-4 pt-[88px] text-[var(--a-ink)] sm:px-6 lg:px-8">
      <div className="grid min-h-[calc(100vh-88px)] place-items-center pb-4">
        <div className="w-full max-w-[560px] border border-[var(--a-line)] bg-[var(--a-surface)] p-8 text-center text-[14px] text-[var(--a-muted)]">Loading room…</div>
      </div>
    </section>
  )
}
