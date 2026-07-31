import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import React from 'react'
import { TimerProvider, useTimer } from '@/context/TimerContext'
import { ConfigProvider } from '@/context/ConfigContext'

function wrapper({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider>
      <TimerProvider>{children}</TimerProvider>
    </ConfigProvider>
  )
}

const FOCUS_15_MS = 15 * 60 * 1000
const BREAK_2_MS = 2 * 60 * 1000
const SESSION_HISTORY_STORAGE_KEY = 'focus-timer-session-history'

function createHistoryEntry(completedAt: string) {
  const startedAt = new Date(new Date(completedAt).getTime() - 25 * 60 * 1000).toISOString()
  return {
    id: 'session-1',
    phase: 'focus' as const,
    durationMinutes: 25,
    startedAt,
    completedAt,
    task: 'Write tests',
  }
}

describe('TimerContext', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    localStorage.clear()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('starts in idle state with focus phase at session 1', () => {
    const { result } = renderHook(() => useTimer(), { wrapper })
    expect(result.current.state).toBe('idle')
    expect(result.current.phase).toBe('focus')
    expect(result.current.session).toBe(1)
  })

  it('transitions to running state on startTimer', () => {
    const { result } = renderHook(() => useTimer(), { wrapper })
    act(() => { result.current.startTimer() })
    expect(result.current.state).toBe('running')
  })

  it('pauses the timer and stops decrementing', () => {
    const { result } = renderHook(() => useTimer(), { wrapper })
    act(() => { result.current.startTimer() })
    act(() => { vi.advanceTimersByTime(3000) })
    const secondsAtPause = result.current.minutes * 60 + result.current.seconds
    act(() => { result.current.pauseTimer() })
    expect(result.current.state).toBe('paused')
    act(() => { vi.advanceTimersByTime(5000) })
    expect(result.current.minutes * 60 + result.current.seconds).toBe(secondsAtPause)
  })

  it('resumes from paused state', () => {
    const { result } = renderHook(() => useTimer(), { wrapper })
    act(() => { result.current.startTimer() })
    act(() => { result.current.pauseTimer() })
    act(() => { result.current.resumeTimer() })
    expect(result.current.state).toBe('running')
  })

  it('decrements timer by one each second', () => {
    const { result } = renderHook(() => useTimer(), { wrapper })
    const initialTotal = result.current.minutes * 60 + result.current.seconds
    act(() => { result.current.startTimer() })
    act(() => { vi.advanceTimersByTime(3000) })
    expect(result.current.minutes * 60 + result.current.seconds).toBe(initialTotal - 3)
  })

  it('resets fully on stopTimer', () => {
    const { result } = renderHook(() => useTimer(), { wrapper })
    const initialTotal = result.current.minutes * 60 + result.current.seconds
    act(() => { result.current.startTimer() })
    act(() => { vi.advanceTimersByTime(10000) })
    act(() => { result.current.stopTimer() })
    expect(result.current.state).toBe('idle')
    expect(result.current.phase).toBe('focus')
    expect(result.current.session).toBe(1)
    expect(result.current.minutes * 60 + result.current.seconds).toBe(initialTotal)
  })

  it('transitions from focus to break phase when focus timer hits zero', () => {
    const { result } = renderHook(() => useTimer(), { wrapper })
    act(() => { result.current.setPreset('15') })
    act(() => { result.current.startTimer() })
    act(() => { vi.advanceTimersByTime(FOCUS_15_MS) })
    expect(result.current.phase).toBe('break')
    expect(result.current.state).toBe('idle')
  })

  it('transitions from break to focus and increments session', () => {
    const { result } = renderHook(() => useTimer(), { wrapper })
    act(() => { result.current.setPreset('15') })
    act(() => { result.current.startTimer() })
    act(() => { vi.advanceTimersByTime(FOCUS_15_MS) })
    act(() => { result.current.startTimer() })
    act(() => { vi.advanceTimersByTime(BREAK_2_MS) })
    expect(result.current.phase).toBe('focus')
    expect(result.current.session).toBe(2)
  })

  it('applies a long break every 4 focus sessions', () => {
    const { result } = renderHook(() => useTimer(), { wrapper })
    act(() => { result.current.setPreset('15') })

    for (let i = 0; i < 3; i++) {
      act(() => { result.current.startTimer() })
      act(() => { vi.advanceTimersByTime(FOCUS_15_MS) })
      act(() => { result.current.startTimer() })
      act(() => { vi.advanceTimersByTime(BREAK_2_MS) })
    }

    expect(result.current.session).toBe(4)

    act(() => { result.current.startTimer() })
    act(() => { vi.advanceTimersByTime(FOCUS_15_MS) })

    // Long break for '15' preset = 5 min = 300 seconds
    expect(result.current.phase).toBe('break')
    expect(result.current.minutes * 60 + result.current.seconds).toBe(5 * 60)
  })

  it('updates preset and resets timer when idle', () => {
    const { result } = renderHook(() => useTimer(), { wrapper })
    act(() => { result.current.setPreset('15') })
    expect(result.current.preset).toBe('15')
    expect(result.current.minutes).toBe(15)
    expect(result.current.seconds).toBe(0)
  })

  it('uses custom focus, short break, and long break durations', () => {
    const { result } = renderHook(() => useTimer(), { wrapper })

    act(() => {
      result.current.setCustomPreset({ focus: 1, break: 1, longBreak: 2 })
    })

    expect(result.current.preset).toBe('custom')
    expect(result.current.minutes).toBe(1)

    for (let i = 0; i < 3; i++) {
      act(() => { result.current.startTimer() })
      act(() => { vi.advanceTimersByTime(60 * 1000) })
      expect(result.current.minutes).toBe(1)

      act(() => { result.current.startTimer() })
      act(() => { vi.advanceTimersByTime(60 * 1000) })
    }

    expect(result.current.session).toBe(4)

    act(() => { result.current.startTimer() })
    act(() => { vi.advanceTimersByTime(60 * 1000) })

    expect(result.current.phase).toBe('break')
    expect(result.current.minutes).toBe(2)
  })

  it('does not reset timer when preset is changed while running', () => {
    const { result } = renderHook(() => useTimer(), { wrapper })
    act(() => { result.current.setPreset('25/5') })
    act(() => { result.current.startTimer() })
    act(() => { vi.advanceTimersByTime(5000) })
    const timeWhileRunning = result.current.minutes * 60 + result.current.seconds
    act(() => { result.current.setPreset('15') })
    expect(result.current.minutes * 60 + result.current.seconds).toBe(timeWhileRunning)
  })

  it('restores the most recently saved daily history', () => {
    const session = createHistoryEntry('2026-07-28T10:00:00.000Z')
    localStorage.setItem(SESSION_HISTORY_STORAGE_KEY, JSON.stringify({
      date: '2026-07-28',
      sessions: [session],
    }))

    const { result } = renderHook(() => useTimer(), { wrapper })

    expect(result.current.sessionHistoryDate).toBe('2026-07-28')
    expect(result.current.sessionHistory).toEqual([session])
  })

  it('starts a fresh daily history when a timer begins on a new day', () => {
    vi.setSystemTime(new Date('2026-07-29T09:00:00.000Z'))
    const session = createHistoryEntry('2026-07-28T10:00:00.000Z')
    localStorage.setItem(SESSION_HISTORY_STORAGE_KEY, JSON.stringify({
      date: '2026-07-28',
      sessions: [session],
    }))

    const { result } = renderHook(() => useTimer(), { wrapper })
    act(() => { result.current.startTimer() })

    expect(result.current.sessionHistoryDate).toBe('2026-07-29')
    expect(result.current.sessionHistory).toEqual([])
    expect(JSON.parse(localStorage.getItem(SESSION_HISTORY_STORAGE_KEY) ?? '{}')).toEqual({
      date: '2026-07-29',
      sessions: [],
    })
  })

  it('persists completed sessions with their local date', () => {
    vi.setSystemTime(new Date('2026-07-29T09:00:00.000Z'))
    const { result } = renderHook(() => useTimer(), { wrapper })

    act(() => {
      result.current.setCustomPreset({ focus: 1, break: 1, longBreak: 2 })
      result.current.startTimer()
      vi.advanceTimersByTime(60 * 1000)
    })

    expect(JSON.parse(localStorage.getItem(SESSION_HISTORY_STORAGE_KEY) ?? '{}')).toMatchObject({
      date: '2026-07-29',
      sessions: [expect.objectContaining({
        phase: 'focus',
        durationMinutes: 1,
        startedAt: '2026-07-29T09:00:00.000Z',
        completedAt: '2026-07-29T09:01:00.000Z',
      })],
    })
  })
})
