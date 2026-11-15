import { createContext, useContext } from "react"

export type Theme = "light" | "dark"

export type ThemeContextType = {
  theme: Theme
  toggleTheme: () => void
}

// Must match the key used by the inline script in index.html
export const THEME_STORAGE_KEY = "theme"

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) throw new Error("useTheme must be used within ThemeProvider")
  return context
}
