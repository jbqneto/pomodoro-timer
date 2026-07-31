import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MainTemplate from '@/components/templates/main';
import SettingsDialog from '@/components/settings/SettingsDialog';
import { enMessages } from '@/i18n/en';
import { ptMessages } from '@/i18n/pt';

const mocks = vi.hoisted(() => ({ language: 'en' as 'en' | 'pt', preset: 'custom', isFirstVisit: false }));

vi.mock('@/context/LanguageContext', () => ({
  LanguageProvider: ({ children }: { children: React.ReactNode }) => children,
  useLanguage: () => ({
    language: mocks.language,
    setLanguage: (language: 'en' | 'pt') => { mocks.language = language; },
    t: (key: keyof typeof enMessages) => (mocks.language === 'en' ? enMessages : ptMessages)[key],
  }),
}));
vi.mock('@/context/ConfigContext', () => ({
  ConfigProvider: ({ children }: { children: React.ReactNode }) => children,
  useConfig: () => ({
    soundEnabled: true, setSoundEnabled: vi.fn(), soundVolume: 70, setSoundVolume: vi.fn(),
    musicVolume: 50, setMusicVolume: vi.fn(), autoPlay: false, setAutoPlay: vi.fn(),
    showBreakTips: true, setShowBreakTips: vi.fn(),
    interfaceMode: 'advanced', setInterfaceMode: vi.fn(), askForOccasionalFeedback: true, setAskForOccasionalFeedback: vi.fn(),
    isFirstVisit: mocks.isFirstVisit,
  }),
}));
vi.mock('@/context/TimerContext', () => ({
  useTimer: () => ({
    preset: mocks.preset, customPreset: { focus: 25, break: 5, longBreak: 15 },
    setPreset: vi.fn(), setCustomPreset: vi.fn(), state: 'idle',
  }),
}));
vi.mock('@/components/ThemeProvider', () => ({ ThemeProvider: ({ children }: { children: React.ReactNode }) => children }));
vi.mock('@vercel/analytics/next', () => ({ Analytics: () => null }));

describe('navigation and sticky footer shell', () => {
  it('omits the Android item from desktop and mobile navigation', async () => {
    mocks.language = 'en';
    render(<Header />);
    expect(screen.queryByText('Android App')).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Abrir menu' }));
    expect(screen.queryByText('Android App')).not.toBeInTheDocument();
  });

  it('opens settings automatically for a first-time visitor', async () => {
    mocks.isFirstVisit = true;
    render(<Header />);
    expect(await screen.findByRole('dialog', { name: 'Settings' })).toBeInTheDocument();
    mocks.isFirstVisit = false;
  });

  it('renders a semantic sticky-footer structure without fixing the footer', () => {
    const { container } = render(<MainTemplate><p>About content</p></MainTemplate>);
    const shell = container.querySelector('.min-h-screen.flex.flex-col');
    const main = shell?.querySelector(':scope > main');
    const footer = shell?.querySelector(':scope > footer');
    expect(shell).toBeInTheDocument();
    expect(main).toHaveClass('flex-1');
    expect(main?.nextElementSibling).toBe(footer);
    expect(footer).toHaveClass('mt-auto');
    expect(footer).not.toHaveClass('fixed');
  });
});

describe('footer', () => {
  it('shows the English Android notice and current year', () => {
    mocks.language = 'en';
    render(<Footer />);
    expect(screen.getByText(enMessages.androidFooterNotice)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(`© ${new Date().getFullYear()} Focus Beat`))).toBeInTheDocument();
  });

  it('shows the Portuguese Android notice', () => {
    mocks.language = 'pt';
    render(<Footer />);
    expect(screen.getByText(ptMessages.androidFooterNotice)).toBeInTheDocument();
  });
});

describe('settings dialog', () => {
  it('contains the responsive preset grid and custom fields with accessible semantics', () => {
    mocks.language = 'en';
    render(<SettingsDialog open onClose={vi.fn()} />);
    const dialog = screen.getByRole('dialog', { name: 'Settings' });
    expect(dialog).toHaveAccessibleDescription(enMessages.settingsDescription);
    const buttons = ['Classic 25/5', 'Quick 15min', 'Custom'].map((name) => screen.getByRole('button', { name }));
    expect(buttons.every((button) => dialog.contains(button))).toBe(true);
    expect(buttons[0].parentElement).toHaveClass('grid', 'sm:grid-cols-3');
    const fields = ['Focus', 'Short break', 'Long break'].map((name) => screen.getByRole('spinbutton', { name }));
    expect(fields.every((field) => dialog.contains(field))).toBe(true);
    expect(fields[0].closest('fieldset')).toHaveClass('grid-cols-1', 'sm:grid-cols-3');
  });

  it('closes with Escape and restores focus to the opener', async () => {
    mocks.language = 'en';
    render(<Header />);
    const opener = screen.getByRole('button', { name: 'Settings' });
    await userEvent.click(opener);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await waitFor(() => expect(opener).toHaveFocus());
  });
});
