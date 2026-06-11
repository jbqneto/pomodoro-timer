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

  it('does not reset timer when preset is changed while running', () => {
    const { result } = renderHook(() => useTimer(), { wrapper })
    act(() => { result.current.setPreset('25/5') })
    act(() => { result.current.startTimer() })
    act(() => { vi.advanceTimersByTime(5000) })
    const timeWhileRunning = result.current.minutes * 60 + result.current.seconds
    act(() => { result.current.setPreset('15') })
    expect(result.current.minutes * 60 + result.current.seconds).toBe(timeWhileRunning)
  })
})
