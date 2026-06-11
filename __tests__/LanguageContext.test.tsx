import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import React from 'react'
import { LanguageProvider, useLanguage } from '@/context/LanguageContext'

const STORAGE_KEY = 'focus-timer-language'

function wrapper({ children }: { children: React.ReactNode }) {
  return <LanguageProvider>{children}</LanguageProvider>
}

describe('LanguageContext', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('defaults to English', () => {
    const { result } = renderHook(() => useLanguage(), { wrapper })
    expect(result.current.language).toBe('en')
  })

  it('translates keys correctly in English', () => {
    const { result } = renderHook(() => useLanguage(), { wrapper })
    expect(result.current.t('focus')).toBe('Focus')
    expect(result.current.t('start')).toBe('START')
    expect(result.current.t('break')).toBe('Break')
  })

  it('switches to Portuguese and returns PT translations', () => {
    const { result } = renderHook(() => useLanguage(), { wrapper })
    act(() => { result.current.setLanguage('pt') })
    expect(result.current.language).toBe('pt')
    expect(result.current.t('focus')).toBe('Foco')
    expect(result.current.t('start')).toBe('INICIAR')
    expect(result.current.t('break')).toBe('Pausa')
  })

  it('returns the key itself when translation is missing', () => {
    const { result } = renderHook(() => useLanguage(), { wrapper })
    expect(result.current.t('key.that.does.not.exist')).toBe('key.that.does.not.exist')
  })

  it('loads language from localStorage on mount', async () => {
    localStorage.setItem(STORAGE_KEY, 'pt')
    const { result } = renderHook(() => useLanguage(), { wrapper })
    await waitFor(() => {
      expect(result.current.language).toBe('pt')
    })
  })

  it('persists language choice to localStorage', () => {
    const { result } = renderHook(() => useLanguage(), { wrapper })
    act(() => { result.current.setLanguage('pt') })
    expect(localStorage.getItem(STORAGE_KEY)).toBe('pt')
  })

  it('PT has all translation keys that EN has', () => {
    const { result } = renderHook(() => useLanguage(), { wrapper })

    const coreKeys = [
      'focus', 'break', 'session', 'timeToFocus', 'timeForBreak',
      'start', 'pause', 'resume', 'stop',
      'classic', 'quick', 'timerPreset',
      'lofi', 'classical', 'catholic',
      'home', 'about', 'settings', 'close',
      'alarm', 'volume', 'startMusicWithTimer',
      'disclaimer', 'heroTitle', 'heroDescription',
      'aboutTitle', 'focusCycleTitle', 'musicTitle',
    ]

    act(() => { result.current.setLanguage('pt') })

    for (const key of coreKeys) {
      expect(
        result.current.t(key),
        `Missing PT translation for key: "${key}"`
      ).not.toBe(key)
    }
  })
})
