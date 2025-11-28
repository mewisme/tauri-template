import { VariantProps } from 'class-variance-authority'
import { badgeVariants } from '@/components/ui/badge'
import { create } from 'zustand'
import { load } from '@tauri-apps/plugin-store'

interface CursorState {
  enableCursor: boolean
  enableCursorFollow: boolean
  cursorFollowSide: 'top' | 'right' | 'bottom' | 'left'
  cursorFollowAlign: 'start' | 'center' | 'end'
  cursorFollowSideOffset: number
  cursorFollowAlignOffset: number

  cursorFollowContent: string
  cursorFollowBadgeVariant: VariantProps<typeof badgeVariants>['variant']

  setState: (data: Partial<CursorState>) => void
}

const defaultState: Omit<CursorState, 'setState'> = {
  enableCursor: true,
  enableCursorFollow: true,
  cursorFollowSide: 'bottom',
  cursorFollowAlign: 'end',
  cursorFollowSideOffset: 15,
  cursorFollowAlignOffset: 5,
  cursorFollowContent: 'Mew',
  cursorFollowBadgeVariant: 'default',
}

let tauriStore: any = null
const STORE_KEY = 'cursorState'
const STORE_FILENAME = 'cursor-store.json'

async function getStore() {
  if (!tauriStore) {
    tauriStore = await load(STORE_FILENAME, {
      autoSave: true,
      defaults: defaultState as Record<string, unknown>,
    })
  }
  return tauriStore
}

async function saveToTauri(state: CursorState) {
  try {
    const store = await getStore()
    await store.set(STORE_KEY, state)
    await store.save()
  } catch (error) {
    console.error('Failed to save cursor state to Tauri store:', error)
  }
}

export const useCursorStore = create<CursorState>((set) => ({
  ...defaultState,

  setState: (data) => {
    set((state) => {
      const newState = { ...state, ...data }
      // Auto-save to Tauri store
      saveToTauri(newState as CursorState)
      return newState
    })
  }
}))

export async function loadCursorStore() {
  try {
    const store = await getStore()
    const saved = await store.get(STORE_KEY)
    if (saved) {
      useCursorStore.setState(saved)
    }
  } catch (error) {
    console.error('Failed to load cursor state from Tauri store:', error)
  }
}