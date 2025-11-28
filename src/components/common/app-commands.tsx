import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { useNavigate } from "react-router-dom"
import { useCommand } from "@/components/providers/command-provider"
import { commandRegistry, type Command } from "@/lib/command-registry"
import { useState, useMemo } from "react"

export function AppCommands() {
  const { open, setOpen, executeCommand } = useCommand()
  const navigate = useNavigate()
  const [search, setSearch] = useState("")

  const commands = useMemo(() => {
    if (search.trim()) {
      return commandRegistry.searchCommands(search)
    }
    return commandRegistry.getAllCommands()
  }, [search])

  const groups = useMemo(() => {
    const groupMap = new Map<string, Command[]>()
    commands.forEach((cmd) => {
      const group = cmd.group || "General"
      if (!groupMap.has(group)) {
        groupMap.set(group, [])
      }
      groupMap.get(group)!.push(cmd)
    })
    return Array.from(groupMap.entries())
  }, [commands])

  const handleSelect = async (command: Command) => {
    if (command.action.type === "navigate") {
      navigate(command.action.path)
      setOpen(false)
    } else {
      await executeCommand(command)
    }
  }

  const formatShortcut = (shortcut?: string) => {
    if (!shortcut) return undefined
    return shortcut
      .split("+")
      .map((s) => {
        const trimmed = s.trim().toLowerCase()
        if (trimmed === "cmd" || trimmed === "meta") return "⌘"
        if (trimmed === "ctrl" || trimmed === "control") return "⌃"
        if (trimmed === "shift") return "⇧"
        if (trimmed === "alt") return "⌥"
        return s.trim().toUpperCase()
      })
      .join("")
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder="Type a command or search..."
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        {groups.length === 0 && <CommandEmpty>No results found.</CommandEmpty>}
        {groups.map(([groupName, groupCommands], index) => (
          <div key={groupName}>
            {index > 0 && <CommandSeparator />}
            <CommandGroup heading={groupName}>
              {groupCommands.map((command) => (
                <CommandItem
                  key={command.id}
                  onSelect={() => handleSelect(command)}
                >
                  {command.icon && <command.icon className="mr-2 h-4 w-4" />}
                  <span>{command.label}</span>
                  {command.shortcut && (
                    <CommandShortcut>{formatShortcut(command.shortcut)}</CommandShortcut>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </div>
        ))}
      </CommandList>
    </CommandDialog>
  )
}
