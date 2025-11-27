import { ThemeSwitch } from '@/components/theme-switch';
import { VersionDisplay } from '@/components/updater/version-display';

export function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <VersionDisplay />
      <h1>Home</h1>
      <ThemeSwitch />
    </div>
  )
}