import { Download as DownloadIcon, Home as HomeIcon, Settings as SettingsIcon } from "lucide-react"

import { checkForUpdates } from "./update-check"
import { commandRegistry } from "./command-registry"

// Register default commands
export function registerDefaultCommands() {
  commandRegistry.register({
    id: "navigate-home",
    label: "Go to Home",
    title: "Navigate to the home page",
    icon: HomeIcon,
    shortcut: "cmd+shift+h",
    keywords: ["home", "main"],
    group: "Navigation",
    action: {
      type: "navigate",
      path: "/",
    },
  })

  commandRegistry.register({
    id: "navigate-settings",
    label: "Open Settings",
    title: "Navigate to the settings page",
    icon: SettingsIcon,
    shortcut: "cmd+shift+s",
    keywords: ["settings", "preferences", "config"],
    group: "Navigation",
    action: {
      type: "navigate",
      path: "/settings",
    },
  })

  commandRegistry.register({
    id: "toggle-theme",
    label: "Toggle Theme",
    title: "Toggle the theme of the app",
    shortcut: "cmd+shift+t",
    keywords: ["theme", "dark", "light", "mode"],
    group: "Appearance",
    action: {
      type: "function",
      handler: () => {
        // This will be handled by your theme provider
        const event = new CustomEvent("toggle-theme")
        window.dispatchEvent(event)
      },
    },
  })

  commandRegistry.register({
    id: "check-update",
    label: "Check for Updates",
    title: "Check for updates for the app",
    icon: DownloadIcon,
    keywords: ["update", "upgrade", "version", "check"],
    group: "System",
    action: {
      type: "function",
      handler: async () => {
        await checkForUpdates()
      },
    },
  })
}

