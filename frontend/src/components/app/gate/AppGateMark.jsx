export default function AppGateMark() {
  return (
    <div className="relative flex min-h-[260px] items-center justify-center lg:min-h-[520px] lg:justify-center">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[min(52vw,420px)] w-[min(52vw,420px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ede9df]/[0.045] blur-3xl"
      />
      <img
        src="/brand/bond-logo-white-512.png"
        alt="BOND"
        draggable="false"
        width={400}
        height={400}
        className="relative h-[min(42vw,280px)] w-[min(42vw,280px)] select-none object-contain opacity-[0.96] sm:h-[320px] sm:w-[320px] lg:h-[380px] lg:w-[380px] xl:h-[420px] xl:w-[420px]"
      />
    </div>
  )
}
