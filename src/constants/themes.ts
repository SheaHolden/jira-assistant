import type { ThemeId, ThemeMode } from '@types';

interface ThemeOption {
    id: ThemeId;
    label: string;
    mode: ThemeMode;
    swatch: [background: string, accent: string];
}

export const themes: ThemeOption[] = [
    { id: 'light', label: 'Light', mode: 'light', swatch: ['#ffffff', '#2563eb'] },
    { id: 'parchment', label: 'Parchment', mode: 'light', swatch: ['#f4ecdd', '#b5532a'] },
    { id: 'dark', label: 'Dark', mode: 'dark', swatch: ['#0f172a', '#60a5fa'] },
    { id: 'aurora', label: 'Aurora', mode: 'dark', swatch: ['#0e1024', '#3ee6c1'] },
    { id: 'high-contrast', label: 'High contrast', mode: 'dark', swatch: ['#000000', '#ffffff'] },
];

export const themeClassPrefix = 'ja-theme-';

export function getThemeMode(theme: ThemeId): ThemeMode {
    return themes.find((t) => t.id === theme)?.mode ?? 'light';
}
