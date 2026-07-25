import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const ThemeContext = createContext({
  theme: 'dark',
  isDark: true,
  isLight: false,
  toggle: () => {},
  setTheme: () => {},
})

const STORAGE_KEY = 'bond_app_theme'

function readStoredTheme() {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    if (value === 'light' || value === 'dark') return value
  } catch {
    /* ignore */
  }
  return 'dark'
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() =>
    typeof window === 'undefined' ? 'dark' : readStoredTheme()
  )

  const setTheme = useCallback((next) => {
    setThemeState(next === 'light' ? 'light' : 'dark')
  }, [])

  const toggle = useCallback(() => {
    setThemeState((current) => (current === 'light' ? 'dark' : 'light'))
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      /* ignore */
    }
  }, [theme])

  const value = useMemo(
    () => ({
      theme,
      isDark: theme === 'dark',
      isLight: theme === 'light',
      toggle,
      setTheme,
    }),
    [theme, toggle, setTheme]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  return useContext(ThemeContext)
}

/** Keep landing free of app theme; only app shell routes receive data-app-theme. */
export function useAppThemeRouteSync(isAppShellRoute) {
  const { theme } = useTheme()

  useEffect(() => {
    const root = document.documentElement
    if (isAppShellRoute) {
      root.dataset.appTheme = theme
      root.style.colorScheme = theme
    } else {
      delete root.dataset.appTheme
      root.style.colorScheme = 'light'
    }
  }, [isAppShellRoute, theme])
}
