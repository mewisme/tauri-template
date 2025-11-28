import { useEffect } from "react"
import { useCommand } from "@/components/providers/command-provider"
import { type Command } from "@/lib/command-registry"

/**
 * Hook to register a command when component mounts
 * Automatically unregisters when component unmounts
 */
export function useRegisterCommand(command: Command) {
  const { registerCommand, unregisterCommand } = useCommand()

  useEffect(() => {
    registerCommand(command)
    return () => {
      unregisterCommand(command.id)
    }
  }, [command.id, registerCommand, unregisterCommand])
}

