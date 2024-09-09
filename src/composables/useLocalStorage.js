import { Storage } from '@/utils/storage'

export function useLocalStorage(key) {
  const storage = new Storage()

  const getLocalData = () => {
    const data = storage.getItem(key)
    return data ? JSON.parse(data) : null
  }

  const setLocalData = (data) => {
    storage.setItem(key, JSON.stringify(data))
  }

  return {
    getLocalData,
    setLocalData
  }
}
