import { describe, test, expect, beforeEach, vi } from 'vitest'
import { Storage } from '../storage'

describe('Storage', () => {
  let storage
  let mockLocalStorage

  beforeEach(() => {
    mockLocalStorage = {
      setItem: vi.fn(),
      getItem: vi.fn(),
      removeItem: vi.fn()
    }
    window.localStorage = mockLocalStorage
    storage = new Storage('test-prefix')
  })

  test('constructor sets default prefix', () => {
    const defaultStorage = new Storage()
    expect(defaultStorage.prefix).toBe('todo-app-v1')
  })

  test('constructor sets custom prefix', () => {
    expect(storage.prefix).toBe('test-prefix')
  })

  test('setItem calls localStorage.setItem with prefixed key', () => {
    storage.setItem('key', 'value')
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('test-prefix-key', 'value')
  })

  test('getItem calls localStorage.getItem with prefixed key', () => {
    storage.getItem('key')
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('test-prefix-key')
  })

  test('removeItem calls localStorage.removeItem with prefixed key', () => {
    storage.removeItem('key')
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('test-prefix-key')
  })
})
