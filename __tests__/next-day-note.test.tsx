import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import React from 'react'
import { TimerProvider, useTimer } from '@/context/TimerContext'
import { ConfigProvider } from '@/context/ConfigContext'
import { LocalStorageTimerStorage } from '@/infrastructure/persistence/local-storage-timer.storage'
import type { Clock } from '@/application/ports/clock'

const storage = new LocalStorageTimerStorage(localStorage)

function setup(now: Date) {
  const clock: Clock = { now: () => now.getTime() }
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <ConfigProvider><TimerProvider storage={storage} clock={clock}>{children}</TimerProvider></ConfigProvider>
  )
  return renderHook(() => useTimer(), { wrapper })
}

describe('next day note', () => {
  beforeEach(() => localStorage.clear())

  it('shows the note saved on a previous day only after the user starts the timer', () => {
    storage.saveDailyNote('2026-09-30', 'Continue the report')
    const { result } = setup(new Date(2026, 9, 1, 9, 0))
    expect(result.current.showNextDayNote).toBe(false)
    act(() => { result.current.startTimer() })
    expect(result.current.showNextDayNote).toBe(true)
    expect(result.current.nextDayNote).toBe('Continue the report')
    act(() => { result.current.dismissNextDayNote() })
    expect(result.current.showNextDayNote).toBe(false)
    expect(storage.loadDailyNote('2026-09-30')).toBeNull()
  })

  it('does not show a note saved today', () => {
    storage.saveDailyNote('2026-10-01', 'same day')
    const { result } = setup(new Date(2026, 9, 1, 9, 0))
    act(() => { result.current.startTimer() })
    expect(result.current.showNextDayNote).toBe(false)
  })
})
