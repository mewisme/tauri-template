import { useEffect } from "react"
import { commandRegistry, type Command } from "@/lib/command-registry"

/**
 * Parse keyboard shortcut string to key combination
 * Format: "ctrl+k", "cmd+shift+p", "alt+s"
 */
function parseShortcut(shortcut: string): {
  key: string
  ctrl: boolean
  meta: boolean
  shift: boolean
  alt: boolean
} {
  const parts = shortcut.toLowerCase().split("+").map((s) => s.trim())
  
  return {
    key: parts[parts.length - 1],
    ctrl: parts.includes("ctrl") || parts.includes("control"),
    meta: parts.includes("cmd") || parts.includes("meta"),
    shift: parts.includes("shift"),
    alt: parts.includes("alt"),
  }
}

/**
 * Check if keyboard event matches the shortcut
 */
function matchesShortcut(
  e: KeyboardEvent,
  shortcut: { key: string; ctrl: boolean; meta: boolean; shift: boolean; alt: boolean }
): boolean {
  return (
    e.key.toLowerCase() === shortcut.key &&
    e.ctrlKey === shortcut.ctrl &&
    e.metaKey === shortcut.meta &&
    e.shiftKey === shortcut.shift &&
    e.altKey === shortcut.alt
  )
}

/**
 * Hook to register a global keyboard shortcut for a command
 */
export function useCommandShortcut(command: Command) {
  useEffect(() => {
    if (!command.shortcut) return

    const shortcut = parseShortcut(command.shortcut)
    
    const handler = (e: KeyboardEvent) => {
      if (matchesShortcut(e, shortcut)) {
        e.preventDefault()
        e.stopPropagation()
        
        if (command.action.type === "navigate") {
          // Navigation will be handled by the command executor
          const cmd = commandRegistry.getCommand(command.id)
          if (cmd) {
            executeCommand(cmd)
          }
        } else if (command.action.type === "function") {
          command.action.handler()
        }
      }
    }

    window.addEventListener("keydown", handler, { capture: true })
    return () => window.removeEventListener("keydown", handler, { capture: true })
  }, [command.id, command.shortcut])
}

/**
 * Execute a command action
 */
export async function executeCommand(command: Command) {
  if (command.action.type === "navigate") {
    // Navigation will be handled by the component that uses this
    return command.action.path
  } else if (command.action.type === "function") {
    await command.action.handler()
  }
}

