import { describe, it, expect, beforeEach, vi } from 'vitest'
import { Storage } from '../storage'

describe('Storage', () => {
  let storageInstance
  let mockLocalStorage

  beforeEach(() => {
    mockLocalStorage = {
      setItem: vi.fn(),
      getItem: vi.fn(),
      removeItem: vi.fn()
    }
    window.localStorage = mockLocalStorage
    storageInstance = new Storage('test-prefix')
  })

  it('constructor sets default prefix', () => {
    const defaultStorage = new Storage()
    expect(defaultStorage.prefix).toBe('todo-app-v1')
  })

  it('constructor sets custom prefix', () => {
    expect(storageInstance.prefix).toBe('test-prefix')
  })

  it('setItem calls localStorage.setItem with prefixed key', () => {
    storageInstance.setItem('key', 'value')
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('test-prefix-key', 'value')
  })

  it('getItem calls localStorage.getItem with prefixed key', () => {
    storageInstance.getItem('key')
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('test-prefix-key')
  })

  it('removeItem calls localStorage.removeItem with prefixed key', () => {
    storageInstance.removeItem('key')
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('test-prefix-key')
  })
})
