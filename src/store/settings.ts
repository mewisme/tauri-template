import { create } from 'zustand'
import { load } from '@tauri-apps/plugin-store'

interface SettingsState {
  autoSave: boolean
  autoCheckUpdate: boolean
  updateCheckInterval: number // minutes
  setState: (data: Partial<SettingsState>) => void
  reset: () => void
}

const defaultSettings: Omit<SettingsState, 'setState' | 'reset'> = {
  autoSave: true,
  autoCheckUpdate: true,
  updateCheckInterval: 1, // minutes
}

let tauriStore: any = null
const STORE_KEY = 'settingsState'
const STORE_FILENAME = 'settings-store.json'

async function getStore() {
  if (!tauriStore) {
    tauriStore = await load(STORE_FILENAME, {
      autoSave: true,
      defaults: defaultSettings as Record<string, unknown>,
    })
  }
  return tauriStore
}

async function saveToTauri(state: SettingsState) {
  try {
    const store = await getStore()
    await store.set(STORE_KEY, state)
    await store.save()
  } catch (error) {
    console.error('Failed to save settings state to Tauri store:', error)
  }
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  ...defaultSettings,

  setState: (data) => {
    set((state) => {
      const newState = { ...state, ...data }
      // Auto-save to Tauri store
      saveToTauri(newState as SettingsState)
      return newState
    })
  },

  reset: () => {
    set(defaultSettings)
    saveToTauri({ ...defaultSettings, setState: get().setState, reset: get().reset } as SettingsState)
  },
}))

export async function loadSettingsStore() {
  try {
    const store = await getStore()
    const saved = await store.get(STORE_KEY) as Partial<SettingsState> | null
    if (saved) {
      useSettingsStore.setState(saved)
    }
  } catch (error) {
    console.error('Failed to load settings state from Tauri store:', error)
  }
}

