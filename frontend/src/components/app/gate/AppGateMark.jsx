import { useTheme } from '../../../contexts/ThemeContext'

export default function AppGateMark({ compact = false }) {
  const { isLight } = useTheme()
  const size = compact
    ? 'h-[96px] w-[96px] sm:h-[112px] sm:w-[112px]'
    : 'h-[120px] w-[120px] sm:h-[140px] sm:w-[140px] lg:h-[156px] lg:w-[156px]'

  const src = isLight ? '/brand/bond-logo-black-512.png' : '/brand/bond-logo-white-512.png'

  return (
    <div className="relative mx-auto flex items-center justify-center">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[180%] w-[180%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--a-ink)]/[0.04] blur-3xl"
      />
      <img
        src={src}
        alt=""
        aria-hidden="true"
        draggable="false"
        width={156}
        height={156}
        className={`relative select-none object-contain opacity-[0.96] ${size}`}
      />
    </div>
  )
}
