import { load } from '@tauri-apps/plugin-store'
import { useEffect } from 'react'

/**
 * đồng bộ Zustand store với Tauri Store
 * @param storeKey key để lưu vào Tauri store
 * @param zustandStore đối tượng Zustand store (get/set/subscribe)
 */
export function useTauriStoreSync<T extends object>(
  storeKey: string,
  storeFilename: string,
  zustandStore: {
    getState: () => T
    setState: (state: Partial<T>) => void
    subscribe: (listener: (state: T) => void) => () => void
  }
) {
  useEffect(() => {
    let store: any

    const init = async () => {
      store = await load(storeFilename, {
        autoSave: true, defaults: {
          ...zustandStore.getState() as Record<string, unknown>,
        }
      })

      // 1. Load dữ liệu từ Tauri Store
      const saved = await store.get(storeKey)
      if (saved) {
        zustandStore.setState(saved)
      }

      // 2. Lắng nghe thay đổi từ Zustand -> Tauri
      zustandStore.subscribe(async (newState) => {
        if (!store) store = await load(storeFilename)
        await store.set(storeKey, newState)
        await store.save()
      })
    }

    init()
  }, [storeKey, zustandStore])
}
