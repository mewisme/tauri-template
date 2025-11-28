"use client"

import { useEffect } from "react"
import { useTheme } from "next-themes"

/**
 * Component that listens for toggle-theme events and toggles the theme
 * This allows the theme to be toggled from anywhere in the app via events
 */
export function ThemeToggleListener() {
  const { theme, setTheme, resolvedTheme } = useTheme()

  useEffect(() => {
    const handleToggleTheme = () => {
      // Use resolvedTheme if available (actual theme after system resolution)
      // Otherwise fall back to theme
      const currentTheme = resolvedTheme || theme
      
      if (currentTheme === "light") {
        setTheme("dark")
      } else if (currentTheme === "dark") {
        setTheme("light")
      } else {
        // If system or undefined, check the actual resolved theme
        // or default to toggling to dark
        const htmlElement = document.documentElement
        const isDark = htmlElement.classList.contains("dark")
        setTheme(isDark ? "light" : "dark")
      }
    }

    window.addEventListener("toggle-theme", handleToggleTheme)
    return () => window.removeEventListener("toggle-theme", handleToggleTheme)
  }, [theme, resolvedTheme, setTheme])

  return null
}

