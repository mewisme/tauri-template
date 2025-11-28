"use client"

import * as React from "react"
import { getStrictContext } from "@/lib/get-strict-context"
import { commandRegistry, type Command } from "@/lib/command-registry"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

type CommandContextType = {
  open: boolean
  setOpen: (open: boolean | ((prev: boolean) => boolean)) => void
  registerCommand: (command: Command) => void
  unregisterCommand: (id: string) => void
  executeCommand: (command: Command) => Promise<void>
}

const [CommandProvider, useCommand] = getStrictContext<CommandContextType>("CommandProvider")

function CommandProviderImpl({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  const navigate = useNavigate()

  // Register command palette shortcut (Cmd/Ctrl+K)
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey) && !e.shiftKey && !e.altKey) {
        e.preventDefault()
        e.stopPropagation()
        setOpen((prev) => !prev)
      }
    }
    window.addEventListener("keydown", down, { capture: true })
    return () => window.removeEventListener("keydown", down, { capture: true })
  }, [])

  // Register global shortcuts for all commands
  // Get commands dynamically on each keypress to ensure we have the latest commands
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Skip if command palette is open
      if (open) return

      // Get commands dynamically to ensure we have the latest registered commands
      const commands = commandRegistry.getAllCommands()

      // Check all registered shortcuts
      for (const command of commands) {
        if (!command.shortcut) continue

        const parts = command.shortcut.toLowerCase().split("+").map((s) => s.trim())
        const key = parts[parts.length - 1]
        const wantsCtrl = parts.includes("ctrl") || parts.includes("control")
        const wantsCmd = parts.includes("cmd") || parts.includes("meta")
        const shift = parts.includes("shift")
        const alt = parts.includes("alt")

        // Check if key matches
        if (e.key.toLowerCase() !== key) continue

        // Check modifiers
        // "cmd" should work on both Mac (metaKey) and Windows (ctrlKey)
        // "ctrl" should only work with ctrlKey
        let modifierMatches = false
        if (wantsCmd) {
          // "cmd" matches if either Ctrl (Windows) or Meta (Mac) is pressed
          modifierMatches = e.ctrlKey || e.metaKey
        } else if (wantsCtrl) {
          // "ctrl" only matches Ctrl key
          modifierMatches = e.ctrlKey && !e.metaKey
        } else {
          // No modifier required
          modifierMatches = !e.ctrlKey && !e.metaKey
        }

        if (
          modifierMatches &&
          e.shiftKey === shift &&
          e.altKey === alt
        ) {
          e.preventDefault()
          e.stopPropagation()

          // Execute the command
          if (command.action.type === "navigate") {
            navigate(command.action.path)
            toast.success(command.title, {
              duration: 2000,
            })
          } else if (command.action.type === "function") {
            command.action.handler()
          }
          return
        }
      }
    }

    window.addEventListener("keydown", handler, { capture: true })
    return () => window.removeEventListener("keydown", handler, { capture: true })
  }, [open, navigate])

  const registerCommand = React.useCallback((command: Command) => {
    commandRegistry.register(command)
  }, [])

  const unregisterCommand = React.useCallback((id: string) => {
    commandRegistry.unregister(id)
  }, [])

  const handleExecuteCommand = React.useCallback(async (command: Command) => {
    if (command.action.type === "navigate") {
      navigate(command.action.path)
      toast.success(command.title, {
        duration: 2000,
      })
      setOpen(false)
    } else if (command.action.type === "function") {
      await command.action.handler()
      setOpen(false)
    }
  }, [navigate])

  return (
    <CommandProvider value={{
      open,
      setOpen,
      registerCommand,
      unregisterCommand,
      executeCommand: handleExecuteCommand
    }}>
      {children}
    </CommandProvider>
  )
}

export { CommandProviderImpl as CommandProvider, useCommand }

