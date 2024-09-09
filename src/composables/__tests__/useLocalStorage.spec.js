import { describe, expect, it, beforeEach } from 'vitest'
import { useLocalStorage } from '../useLocalStorage'

describe('useLocalStorage', () => {
  const key = 'testKey'
  const initialValue = { name: 'John', age: 30 }

  beforeEach(() => {
    localStorage.clear()
  })

  it('should set and get a value from localStorage', () => {
    const { getLocalData, setLocalData } = useLocalStorage(key)
    setLocalData(initialValue)
    expect(getLocalData()).toEqual(initialValue)
  })

  it('should update the value and localStorage when setLocalData is called', () => {
    const { getLocalData, setLocalData } = useLocalStorage(key)

    setLocalData(initialValue)
    expect(getLocalData()).toEqual(initialValue)

    const newValue = { name: 'Jane', age: 25 }
    setLocalData(newValue)
    expect(getLocalData()).toEqual(newValue)
  })

  it('should return null if key does not exist in localStorage', () => {
    const { getLocalData } = useLocalStorage('nonexistentKey')

    expect(getLocalData()).toBeNull()
  })
})
