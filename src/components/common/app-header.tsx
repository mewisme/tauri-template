import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Kbd, KbdGroup } from "@/components/ui/kbd"

import { AppMenubar } from "./app-menubar";
import { ThemeSwitch } from "../theme-switch";
import { platform } from '@tauri-apps/plugin-os';
import { useCommand } from "@/components/providers/command-provider"

export function AppHeader() {
  const isMac = platform() === "macos"
  const mod = isMac ? "⌘" : "Ctrl"

  const { setOpen } = useCommand()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur border-b">
      <div className="h-12 flex items-center justify-between text-sm text-muted-foreground gap-2 px-5">
        <AppMenubar />
        <div className="space-x-2 flex items-center">
          <InputGroup className="w-42">
            <InputGroupInput readOnly placeholder="Search..." onClick={() => setOpen(true)} />
            <InputGroupAddon align="inline-end">
              <KbdGroup>
                <Kbd>{mod}</Kbd>
                <span>+</span>
                <Kbd>K</Kbd>
              </KbdGroup>
            </InputGroupAddon>
          </InputGroup>
          <ThemeSwitch />
        </div>
      </div>
    </header>
  )
}
