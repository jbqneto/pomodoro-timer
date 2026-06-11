import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import React from 'react'
import { ConfigProvider, useConfig } from '@/context/ConfigContext'

const STORAGE_KEY = 'focus-timer-config'

function wrapper({ children }: { children: React.ReactNode }) {
  return <ConfigProvider>{children}</ConfigProvider>
}

describe('ConfigContext', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('initializes with correct default values', () => {
    const { result } = renderHook(() => useConfig(), { wrapper })
    expect(result.current.soundEnabled).toBe(true)
    expect(result.current.autoPlay).toBe(true)
    expect(result.current.soundVolume).toBe(80)
    expect(result.current.activePlaylist).toBe('catholic')
  })

  it('loads persisted settings from localStorage on mount', async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      soundEnabled: false,
      autoPlay: false,
      soundVolume: 50,
      activePlaylist: 'lofi',
    }))

    const { result } = renderHook(() => useConfig(), { wrapper })

    await waitFor(() => {
      expect(result.current.soundEnabled).toBe(false)
      expect(result.current.soundVolume).toBe(50)
      expect(result.current.activePlaylist).toBe('lofi')
    })
  })

  it('persists settings to localStorage when changed', async () => {
    const { result } = renderHook(() => useConfig(), { wrapper })

    act(() => { result.current.setSoundVolume(60) })

    await waitFor(() => {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!)
      expect(stored.soundVolume).toBe(60)
    })
  })

  it('handles corrupt localStorage data gracefully', async () => {
    localStorage.setItem(STORAGE_KEY, 'not-valid-json{{{')

    const { result } = renderHook(() => useConfig(), { wrapper })

    await waitFor(() => {
      // Defaults should remain intact despite corrupt data
      expect(result.current.soundEnabled).toBe(true)
      expect(result.current.soundVolume).toBe(80)
    })

    // localStorage should contain valid JSON (corrupt entry was replaced by defaults)
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored !== null) {
      expect(() => JSON.parse(stored)).not.toThrow()
    }
  })

  it('rejects invalid activePlaylist values from localStorage', async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      activePlaylist: 'invalid-playlist',
    }))

    const { result } = renderHook(() => useConfig(), { wrapper })

    await waitFor(() => {
      expect(result.current.activePlaylist).toBe('catholic')
    })
  })

  it('returns a valid playlist ID for each playlist', () => {
    const { result } = renderHook(() => useConfig(), { wrapper })
    expect(result.current.getPlaylistId('lofi')).toBeTruthy()
    expect(result.current.getPlaylistId('classical')).toBeTruthy()
    expect(result.current.getPlaylistId('catholic')).toBeTruthy()
  })
})
