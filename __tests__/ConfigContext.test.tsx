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
    expect(result.current.soundVolume).toBe(25)
    expect(result.current.musicVolume).toBe(25)
    expect(result.current.activePlaylist).toBe('gregorian')
    expect(result.current.showBreakTips).toBe(true)
    expect(result.current.interfaceMode).toBe('simple')
    expect(result.current.isFirstVisit).toBe(true)
  })

  it('persists interface mode changes', async () => {
    const { result } = renderHook(() => useConfig(), { wrapper })
    act(() => result.current.setInterfaceMode('advanced'))
    await waitFor(() => expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).interfaceMode).toBe('advanced'))
  })

  it('loads persisted settings from localStorage on mount', async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      soundEnabled: false,
      autoPlay: false,
      soundVolume: 50,
      activePlaylist: 'lofi',
      showBreakTips: false,
    }))

    const { result } = renderHook(() => useConfig(), { wrapper })

    await waitFor(() => {
      expect(result.current.soundEnabled).toBe(false)
      expect(result.current.soundVolume).toBe(50)
      expect(result.current.activePlaylist).toBe('lofi')
      expect(result.current.showBreakTips).toBe(false)
      expect(result.current.isFirstVisit).toBe(false)
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

  it('persists a custom YouTube source', async () => {
    const { result } = renderHook(() => useConfig(), { wrapper })
    const source = { type: 'youtube-video' as const, videoId: '2ojMshIhLmw' }

    act(() => {
      result.current.setCustomMusicSource(source)
      result.current.setActivePlaylist('custom')
    })

    await waitFor(() => expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).customMusicSource).toEqual(source))
  })

  it('handles corrupt localStorage data gracefully', async () => {
    localStorage.setItem(STORAGE_KEY, 'not-valid-json{{{')

    const { result } = renderHook(() => useConfig(), { wrapper })

    await waitFor(() => {
      // Defaults should remain intact despite corrupt data
      expect(result.current.soundEnabled).toBe(true)
      expect(result.current.soundVolume).toBe(25)
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
      expect(result.current.activePlaylist).toBe('gregorian')
    })
  })

})
