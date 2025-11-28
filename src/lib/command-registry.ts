import { LucideIcon } from "lucide-react"

export type CommandAction =
  | { type: "navigate"; path: string }
  | { type: "function"; handler: () => void | Promise<void> }

export interface Command {
  id: string
  label: string
  title?: string
  icon?: LucideIcon
  shortcut?: string
  keywords?: string[]
  group?: string
  action: CommandAction
}

class CommandRegistry {
  private commands: Map<string, Command> = new Map()
  private shortcuts: Map<string, string> = new Map() // shortcut -> commandId

  register(command: Command) {
    this.commands.set(command.id, command)

    if (command.shortcut) {
      this.shortcuts.set(command.shortcut.toLowerCase(), command.id)
    }
  }

  unregister(id: string) {
    const command = this.commands.get(id)
    if (command?.shortcut) {
      this.shortcuts.delete(command.shortcut.toLowerCase())
    }
    this.commands.delete(id)
  }

  getCommand(id: string): Command | undefined {
    return this.commands.get(id)
  }

  getCommandByShortcut(shortcut: string): Command | undefined {
    const commandId = this.shortcuts.get(shortcut.toLowerCase())
    return commandId ? this.commands.get(commandId) : undefined
  }

  getAllCommands(): Command[] {
    return Array.from(this.commands.values())
  }

  searchCommands(query: string): Command[] {
    const lowerQuery = query.toLowerCase()
    return this.getAllCommands().filter((cmd) => {
      const matchesLabel = cmd.label.toLowerCase().includes(lowerQuery)
      const matchesKeywords = cmd.keywords?.some((kw) =>
        kw.toLowerCase().includes(lowerQuery)
      )
      return matchesLabel || matchesKeywords
    })
  }

  getCommandsByGroup(group: string): Command[] {
    return this.getAllCommands().filter((cmd) => cmd.group === group)
  }

  getGroups(): string[] {
    const groups = new Set<string>()
    this.getAllCommands().forEach((cmd) => {
      if (cmd.group) {
        groups.add(cmd.group)
      }
    })
    return Array.from(groups)
  }
}

export const commandRegistry = new CommandRegistry()

