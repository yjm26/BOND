import { useTheme } from '../../contexts/ThemeContext'

export default function ThemeToggle({ tone = 'dark' }) {
  const { theme, toggle, isLight } = useTheme()
  const darkChrome = tone === 'dark'

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
      title={isLight ? 'Dark mode' : 'Light mode'}
      className={`inline-flex h-9 w-9 items-center justify-center border transition duration-160 ease-out active:scale-[0.97] ${
        darkChrome
          ? 'border-[#fafafa]/14 bg-[#fafafa]/8 text-[#fafafa]/80 hover:border-[#fafafa]/28 hover:text-[#fafafa]'
          : 'border-[#0a0a0a]/12 bg-[#fafafa]/70 text-[#0a0a0a]/70 hover:border-[#0a0a0a]/25 hover:text-[#0a0a0a]'
      }`}
    >
      {theme === 'light' ? (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M21 14.5A7.5 7.5 0 0 1 9.5 3 9 9 0 1 0 21 14.5Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
          <path
            d="M12 2v2.2M12 19.8V22M4.93 4.93l1.56 1.56M17.51 17.51l1.56 1.56M2 12h2.2M19.8 12H22M4.93 19.07l1.56-1.56M17.51 6.49l1.56-1.56"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      )}
    </button>
  )
}
