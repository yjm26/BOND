export default function AppGateMark() {
  return (
    <div className="relative flex min-h-[200px] items-center justify-center lg:min-h-[380px] lg:justify-end">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-8%] top-1/2 hidden h-[280px] w-[280px] -translate-y-1/2 rounded-full bg-[#ede9df]/[0.04] blur-3xl lg:block"
      />
      <img
        src="/brand/bond-logo-white-512.png"
        alt="BOND"
        draggable="false"
        width={200}
        height={200}
        className="relative h-[150px] w-[150px] select-none object-contain opacity-[0.94] sm:h-[170px] sm:w-[170px] lg:h-[200px] lg:w-[200px]"
      />
    </div>
  )
}
