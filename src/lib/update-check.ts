import { check } from "@tauri-apps/plugin-updater"
import { getVersion } from "@tauri-apps/api/app"
import { toast } from "sonner"

/**
 * Check for app updates and show toast notifications
 */
export async function checkForUpdates() {
  try {
    toast.loading("Checking for updates...", { id: "update-check" })

    const currentVersion = await getVersion()
    const update = await check()

    if (update) {
      toast.success(
        `Update available! Version ${update.version} is ready to download.`,
        {
          id: "update-check",
          duration: 5000,
          action: {
            label: "View Details",
            onClick: () => {
              // Open the update dialog
              window.dispatchEvent(new CustomEvent("show-update-dialog"))
            }
          }
        }
      )
      return { available: true, version: update.version, currentVersion }
    } else {
      toast.success("You're running the latest version!", {
        id: "update-check",
        duration: 3000
      })
      return { available: false, currentVersion }
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    toast.error(`Failed to check for updates: ${errorMessage}`, {
      id: "update-check",
      duration: 5000
    })
    throw error
  }
}

