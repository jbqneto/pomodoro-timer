import React, { useState } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ConfigProvider, useConfig } from '@/context/ConfigContext'
import { LanguageProvider } from '@/context/LanguageContext'
import SettingsDialog from '@/components/settings/SettingsDialog'
import MusicMiniCard from '@/components/music/MusicMiniCard'
import { TimerProvider } from '@/context/TimerContext'

vi.mock('@/components/YouTubePlayer', () => {
  const MockPlayer = React.forwardRef(() => <div data-testid="youtube-player" />)
  MockPlayer.displayName = 'MockYouTubePlayer'
  return { default: MockPlayer }
})

function providers(children: React.ReactNode) {
  return <LanguageProvider><ConfigProvider><TimerProvider>{children}</TimerProvider></ConfigProvider></LanguageProvider>
}

function SettingsHarness() {
  const [open, setOpen] = useState(false)
  return <><button onClick={() => setOpen(true)}>Open settings</button><SettingsDialog open={open} onClose={() => setOpen(false)} /></>
}

function SilenceHarness() {
  const { setActivePlaylist } = useConfig()
  return <><button onClick={() => setActivePlaylist('silence')}>Choose silence</button><MusicMiniCard /></>
}

describe('accessible dialogs and YouTube consent', () => {
  beforeEach(() => localStorage.clear())

  it('traps focus, closes on Escape, and restores focus to the opener', async () => {
    const user = userEvent.setup()
    render(providers(<SettingsHarness />))
    const opener = screen.getByRole('button', { name: 'Open settings' })
    await user.click(opener)
    const dialog = screen.getByRole('dialog', { name: 'Settings' })
    expect(dialog).toHaveAccessibleDescription('Configure timer presets and audio preferences.')
    expect(dialog).toContainElement(document.activeElement as HTMLElement)
    for (let index = 0; index < 8; index += 1) {
      await user.tab()
      expect(dialog).toContainElement(document.activeElement as HTMLElement)
    }
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(opener).toHaveFocus()
  })

  it('does not load YouTube before consent and supports refusal and acceptance', async () => {
    const user = userEvent.setup()
    render(providers(<MusicMiniCard />))
    const dialog = await screen.findByRole('dialog', { name: 'YouTube player consent' })
    expect(dialog).toHaveAccessibleDescription('Required before loading the embedded player')
    expect(screen.queryByTestId('youtube-player')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Not now' }))
    expect(localStorage.getItem('youtube-media-consent')).toBe('denied')
    expect(screen.queryByTestId('youtube-player')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Review YouTube consent' }))
    await user.click(screen.getByRole('button', { name: 'Allow YouTube player' }))
    await waitFor(() => expect(screen.getByTestId('youtube-player')).toBeInTheDocument())
    expect(localStorage.getItem('youtube-media-consent')).toBe('granted')
  })

  it('never renders YouTube in silence mode and disables player controls', async () => {
    localStorage.setItem('focus-timer-config', JSON.stringify({ activePlaylist: 'silence' }))
    const user = userEvent.setup()
    render(providers(<SilenceHarness />))
    await user.click(screen.getByRole('button', { name: 'Choose silence' }))
    expect(screen.queryByTestId('youtube-player')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Play video' })).toBeDisabled()
    expect(screen.queryByRole('dialog', { name: 'YouTube player consent' })).not.toBeInTheDocument()
  })
})
